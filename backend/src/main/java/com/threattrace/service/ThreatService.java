package com.threattrace.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.threattrace.client.AIServiceClient;
import com.threattrace.dto.request.ThreatIngestRequest;
import com.threattrace.dto.request.UpdateThreatStatusRequest;
import com.threattrace.dto.response.*;
import com.threattrace.entity.*;
import com.threattrace.exception.ResourceNotFoundException;
import com.threattrace.repository.*;
import com.threattrace.service.notification.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.Year;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class ThreatService {

    private static final Logger logger = LoggerFactory.getLogger(ThreatService.class);

    private final ThreatRepository threatRepository;
    private final ThreatAnalysisRepository analysisRepository;
    private final ThreatEntityRepository entityRepository;
    private final ThreatIndicatorRepository indicatorRepository;
    private final UserRepository userRepository;
    private final AIServiceClient aiServiceClient;
    private final AlertService alertService;
    private final CorrelationService correlationService;
    private final NotificationService notificationService;
    private final AuditService auditService;
    private final ObjectMapper objectMapper;
    private final AtomicInteger referenceCounter = new AtomicInteger(200);

    public ThreatService(ThreatRepository threatRepository,
                         ThreatAnalysisRepository analysisRepository,
                         ThreatEntityRepository entityRepository,
                         ThreatIndicatorRepository indicatorRepository,
                         UserRepository userRepository,
                         AIServiceClient aiServiceClient,
                         AlertService alertService,
                         CorrelationService correlationService,
                         NotificationService notificationService,
                         AuditService auditService) {
        this.threatRepository = threatRepository;
        this.analysisRepository = analysisRepository;
        this.entityRepository = entityRepository;
        this.indicatorRepository = indicatorRepository;
        this.userRepository = userRepository;
        this.aiServiceClient = aiServiceClient;
        this.alertService = alertService;
        this.correlationService = correlationService;
        this.notificationService = notificationService;
        this.auditService = auditService;
        this.objectMapper = new ObjectMapper();
    }

    @Transactional
    public ThreatDetailResponse ingestThreat(ThreatIngestRequest request, String reporterUsername) {
        String reference = String.format("THR-%d-%06d", Year.now().getValue(), referenceCounter.incrementAndGet());

        User reporter = null;
        if (reporterUsername != null) {
            reporter = userRepository.findByUsername(reporterUsername)
                    .or(() -> userRepository.findByEmail(reporterUsername))
                    .orElse(null);
        }

        Threat threat = new Threat();
        threat.setThreatReference(reference);
        threat.setSourceType(request.getSourceType());
        threat.setSourceReference(request.getSourceReference());
        threat.setRawContent(request.getRawContent());
        threat.setStatus("PENDING");
        threat.setLocationName(request.getLocationName());
        threat.setLatitude(request.getLatitude());
        threat.setLongitude(request.getLongitude());
        threat.setGeoVerified(request.getLatitude() != null && request.getLongitude() != null);
        threat.setReportedBy(reporter);
        threat.setSubmittedAt(Instant.now());

        Threat savedThreat = threatRepository.save(threat);

        // Execute AI Threat Intelligence Pipeline
        ThreatAnalysisDTO aiResult = aiServiceClient.analyzeThreat(
                savedThreat.getId(), savedThreat.getRawContent(), savedThreat.getSourceType()
        );

        // Persist Analysis
        persistAnalysis(savedThreat, aiResult);
        savedThreat.setStatus("ANALYZED");
        threatRepository.save(savedThreat);

        // Evaluate Rules for Alerts
        alertService.evaluateAndCreateAlerts(savedThreat, aiResult);

        // Correlate with historical corpus
        correlationService.correlateThreat(savedThreat);

        // Dispatch Real-time Notification
        ThreatDetailResponse detail = mapToDetail(savedThreat);
        notificationService.dispatch("NEW_THREAT_INGESTED", "Threat " + reference + " analyzed: " + aiResult.getPredictedCategory(), detail);

        // Record Audit Trail
        auditService.record(reporterUsername != null ? reporterUsername : "anonymous",
                "THREAT_CREATED", "THREAT", savedThreat.getId(), getClientIp(),
                String.format("{\"reference\":\"%s\",\"category\":\"%s\",\"risk\":%d}",
                        reference, aiResult.getPredictedCategory(), aiResult.getRiskScore()));

        return detail;
    }

    @Transactional
    public void persistAnalysis(Threat threat, ThreatAnalysisDTO dto) {
        // Safely remove existing analysis if re-analyzing
        if (threat.getAnalysis() != null) {
            ThreatAnalysis oldAnalysis = threat.getAnalysis();
            threat.setAnalysis(null);
            analysisRepository.delete(oldAnalysis);
            analysisRepository.flush();
        }

        ThreatAnalysis analysis = new ThreatAnalysis();
        analysis.setThreat(threat);
        analysis.setPredictedCategory(dto.getPredictedCategory());
        analysis.setConfidence(dto.getConfidence());
        analysis.setRiskScore(dto.getRiskScore());
        analysis.setSeverity(dto.getSeverity());
        analysis.setSentimentLabel(dto.getSentimentLabel());
        analysis.setSentimentScore(dto.getSentimentScore());
        analysis.setUrgencyScore(dto.getUrgencyScore());
        analysis.setExplanationSummary(dto.getExplanationSummary());
        analysis.setModelName(dto.getModelName());
        analysis.setModelVersion(dto.getModelVersion());
        analysis.setHumanReviewRequired(dto.getHumanReviewRequired());
        analysis.setAnalyzedAt(Instant.now());

        try {
            analysis.setSignalBreakdown(objectMapper.writeValueAsString(dto.getSignalBreakdown()));
        } catch (Exception e) {
            analysis.setSignalBreakdown("[]");
        }

        ThreatAnalysis savedAnalysis = analysisRepository.save(analysis);

        // Save Entities
        if (dto.getEntities() != null) {
            for (ThreatEntityDTO eDto : dto.getEntities()) {
                ThreatEntity entity = new ThreatEntity();
                entity.setAnalysis(savedAnalysis);
                entity.setEntityType(eDto.getEntityType());
                entity.setEntityValue(eDto.getEntityValue());
                entity.setConfidence(eDto.getConfidence());
                entity.setStartOffset(eDto.getStartOffset());
                entity.setEndOffset(eDto.getEndOffset());
                entity.setSourceSpan(eDto.getSourceSpan());
                entityRepository.save(entity);
            }
        }

        // Save Indicators
        if (dto.getIndicators() != null) {
            for (ThreatIndicatorDTO iDto : dto.getIndicators()) {
                ThreatIndicator indicator = new ThreatIndicator();
                indicator.setAnalysis(savedAnalysis);
                indicator.setIndicatorType(iDto.getIndicatorType());
                indicator.setLabel(iDto.getLabel());
                indicator.setWeight(iDto.getWeight());
                indicator.setEvidenceSnippet(iDto.getEvidenceSnippet());
                indicatorRepository.save(indicator);
            }
        }

        threat.setAnalysis(savedAnalysis);
    }

    @Transactional(readOnly = true)
    public Page<ThreatSummaryResponse> getThreats(String query, String sourceType, String status,
                                                 String severity, String category, Integer minRisk,
                                                 Integer maxRisk, Pageable pageable) {
        return threatRepository.findWithFilters(query, sourceType, status, severity, category, minRisk, maxRisk, pageable)
                .map(this::mapToSummary);
    }

    @Transactional(readOnly = true)
    public ThreatDetailResponse getThreatById(String id) {
        Threat threat = threatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Threat report not found with ID: " + id));
        return mapToDetail(threat);
    }

    @Transactional
    public ThreatDetailResponse reanalyzeThreat(String id, String actorUsername) {
        Threat threat = threatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Threat report not found with ID: " + id));

        ThreatAnalysisDTO aiResult = aiServiceClient.analyzeThreat(threat.getId(), threat.getRawContent(), threat.getSourceType());
        persistAnalysis(threat, aiResult);
        threat.setStatus("ANALYZED");
        Threat saved = threatRepository.save(threat);

        auditService.record(actorUsername, "THREAT_REANALYZED", "THREAT", threat.getId(), getClientIp(), "{}");

        return mapToDetail(saved);
    }

    @Transactional
    public ThreatDetailResponse updateStatus(String id, UpdateThreatStatusRequest request, String actorUsername) {
        Threat threat = threatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Threat report not found with ID: " + id));

        threat.setStatus(request.getStatus());
        Threat saved = threatRepository.save(threat);

        auditService.record(actorUsername, "THREAT_STATUS_UPDATED", "THREAT", id, getClientIp(),
                String.format("{\"new_status\":\"%s\"}", request.getStatus()));

        return mapToDetail(saved);
    }

    @Transactional(readOnly = true)
    public List<ThreatSummaryResponse> getGeoVerifiedThreats() {
        return threatRepository.findGeoVerifiedThreats().stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());
    }

    public ThreatSummaryResponse mapToSummary(Threat t) {
        ThreatSummaryResponse r = new ThreatSummaryResponse();
        r.setId(t.getId());
        r.setThreatReference(t.getThreatReference());
        r.setSourceType(t.getSourceType());
        r.setSourceReference(t.getSourceReference());
        r.setStatus(t.getStatus());
        r.setLocationName(t.getLocationName());
        r.setLatitude(t.getLatitude());
        r.setLongitude(t.getLongitude());
        r.setGeoVerified(t.getGeoVerified());
        r.setCreatedAt(t.getCreatedAt());

        if (t.getAnalysis() != null) {
            r.setCategory(t.getAnalysis().getPredictedCategory());
            r.setSeverity(t.getAnalysis().getSeverity());
            r.setRiskScore(t.getAnalysis().getRiskScore());
            r.setConfidence(t.getAnalysis().getConfidence());
        } else {
            r.setCategory("PENDING");
            r.setSeverity("LOW");
            r.setRiskScore(0);
            r.setConfidence(0.0);
        }
        return r;
    }

    public ThreatDetailResponse mapToDetail(Threat t) {
        ThreatDetailResponse r = new ThreatDetailResponse();
        r.setId(t.getId());
        r.setThreatReference(t.getThreatReference());
        r.setSourceType(t.getSourceType());
        r.setSourceReference(t.getSourceReference());
        r.setRawContent(t.getRawContent());
        r.setStatus(t.getStatus());
        r.setLocationName(t.getLocationName());
        r.setLatitude(t.getLatitude());
        r.setLongitude(t.getLongitude());
        r.setGeoVerified(t.getGeoVerified());
        r.setReportedByUsername(t.getReportedBy() != null ? t.getReportedBy().getUsername() : null);
        r.setSubmittedAt(t.getSubmittedAt());
        r.setCreatedAt(t.getCreatedAt());
        r.setUpdatedAt(t.getUpdatedAt());

        if (t.getAnalysis() != null) {
            ThreatAnalysis a = t.getAnalysis();
            ThreatAnalysisDTO aDto = new ThreatAnalysisDTO();
            aDto.setId(a.getId());
            aDto.setPredictedCategory(a.getPredictedCategory());
            aDto.setConfidence(a.getConfidence());
            aDto.setRiskScore(a.getRiskScore());
            aDto.setSeverity(a.getSeverity());
            aDto.setSentimentLabel(a.getSentimentLabel());
            aDto.setSentimentScore(a.getSentimentScore());
            aDto.setUrgencyScore(a.getUrgencyScore());
            aDto.setExplanationSummary(a.getExplanationSummary());
            aDto.setModelName(a.getModelName());
            aDto.setModelVersion(a.getModelVersion());
            aDto.setHumanReviewRequired(a.getHumanReviewRequired());
            aDto.setAnalyzedAt(a.getAnalyzedAt());

            // Signal breakdown
            try {
                if (a.getSignalBreakdown() != null) {
                    List<SignalBreakdownItem> items = objectMapper.readValue(a.getSignalBreakdown(), new TypeReference<>() {});
                    aDto.setSignalBreakdown(items);
                }
            } catch (Exception ignored) {}

            // Entities
            List<ThreatEntity> entities = entityRepository.findByAnalysisId(a.getId());
            aDto.setEntities(entities.stream().map(e -> new ThreatEntityDTO(
                    e.getId(), e.getEntityType(), e.getEntityValue(), e.getConfidence(),
                    e.getStartOffset(), e.getEndOffset(), e.getSourceSpan()
            )).collect(Collectors.toList()));

            // Indicators
            List<ThreatIndicator> indicators = indicatorRepository.findByAnalysisId(a.getId());
            aDto.setIndicators(indicators.stream().map(i -> new ThreatIndicatorDTO(
                    i.getId(), i.getIndicatorType(), i.getLabel(), i.getWeight(), i.getEvidenceSnippet()
            )).collect(Collectors.toList()));

            r.setAnalysis(aDto);
        }

        return r;
    }

    private String getClientIp() {
        try {
            org.springframework.web.context.request.RequestAttributes attrs = org.springframework.web.context.request.RequestContextHolder.getRequestAttributes();
            if (attrs instanceof org.springframework.web.context.request.ServletRequestAttributes servletAttrs) {
                return com.threattrace.security.RateLimiterService.resolveClientIp(servletAttrs.getRequest());
            }
        } catch (Exception ignored) {}
        return "127.0.0.1";
    }
}
