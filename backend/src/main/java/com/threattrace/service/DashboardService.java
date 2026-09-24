package com.threattrace.service;

import com.threattrace.dto.response.DashboardKPIResponse;
import com.threattrace.dto.response.TimelineEventResponse;
import com.threattrace.entity.Threat;
import com.threattrace.repository.AlertRepository;
import com.threattrace.repository.InvestigationRepository;
import com.threattrace.repository.ThreatRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final ThreatRepository threatRepository;
    private final InvestigationRepository investigationRepository;
    private final AlertRepository alertRepository;

    public DashboardService(ThreatRepository threatRepository,
                            InvestigationRepository investigationRepository,
                            AlertRepository alertRepository) {
        this.threatRepository = threatRepository;
        this.investigationRepository = investigationRepository;
        this.alertRepository = alertRepository;
    }

    @Transactional(readOnly = true)
    public DashboardKPIResponse getDashboardKPIs() {
        long totalThreats = threatRepository.countTotalThreats();
        long highRiskThreats = threatRepository.countHighRiskThreats();
        long activeInvestigations = investigationRepository.countActiveInvestigations();
        long openAlerts = alertRepository.countOpenAlerts();
        long requiringReview = threatRepository.countRequiringReview();
        double avgRisk = threatRepository.calculateAverageRiskScore();

        List<Threat> allThreats = threatRepository.findAll();

        Map<String, Long> severityDist = new HashMap<>();
        Map<String, Long> categoryDist = new HashMap<>();
        Map<String, Long> sourceDist = new HashMap<>();

        for (Threat t : allThreats) {
            sourceDist.merge(t.getSourceType(), 1L, Long::sum);
            if (t.getAnalysis() != null) {
                severityDist.merge(t.getAnalysis().getSeverity(), 1L, Long::sum);
                categoryDist.merge(t.getAnalysis().getPredictedCategory(), 1L, Long::sum);
            } else {
                severityDist.merge("LOW", 1L, Long::sum);
                categoryDist.merge("UNKNOWN", 1L, Long::sum);
            }
        }

        return new DashboardKPIResponse(
                totalThreats,
                highRiskThreats,
                activeInvestigations,
                openAlerts,
                requiringReview,
                Math.round(avgRisk * 10.0) / 10.0,
                severityDist,
                categoryDist,
                sourceDist
        );
    }

    @Transactional(readOnly = true)
    public List<TimelineEventResponse> getThreatActivityTimeline(int limit) {
        List<Threat> threats = threatRepository.findRecentThreats(PageRequest.of(0, Math.min(100, limit)));

        return threats.stream().map(t -> {
            TimelineEventResponse event = new TimelineEventResponse();
            event.setId(t.getId());
            event.setTimestamp(t.getCreatedAt());
            event.setThreatId(t.getId());
            event.setThreatReference(t.getThreatReference());
            event.setSource(t.getSourceType());
            event.setStatus(t.getStatus());
            event.setLocation(t.getLocationName());
            event.setAnalyst(t.getReportedBy() != null ? t.getReportedBy().getFullName() : "Automated System");

            String raw = t.getRawContent();
            event.setSnippet(raw.length() > 90 ? raw.substring(0, 87) + "..." : raw);

            if (t.getAnalysis() != null) {
                event.setCategory(t.getAnalysis().getPredictedCategory());
                event.setSeverity(t.getAnalysis().getSeverity());
                event.setRiskScore(t.getAnalysis().getRiskScore());
            } else {
                event.setCategory("PENDING");
                event.setSeverity("LOW");
                event.setRiskScore(0);
            }
            return event;
        }).collect(Collectors.toList());
    }
}
