package com.threattrace.service;

import com.threattrace.dto.request.AddInvestigationNoteRequest;
import com.threattrace.dto.request.CreateInvestigationRequest;
import com.threattrace.dto.request.UpdateInvestigationStatusRequest;
import com.threattrace.dto.response.InvestigationNoteResponse;
import com.threattrace.dto.response.InvestigationResponse;
import com.threattrace.entity.Investigation;
import com.threattrace.entity.InvestigationNote;
import com.threattrace.entity.Threat;
import com.threattrace.entity.User;
import com.threattrace.exception.ResourceNotFoundException;
import com.threattrace.repository.InvestigationNoteRepository;
import com.threattrace.repository.InvestigationRepository;
import com.threattrace.repository.ThreatRepository;
import com.threattrace.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.Year;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class InvestigationService {

    private final InvestigationRepository investigationRepository;
    private final InvestigationNoteRepository noteRepository;
    private final ThreatRepository threatRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;
    private final AtomicInteger caseCounter = new AtomicInteger(100);

    public InvestigationService(InvestigationRepository investigationRepository,
                                InvestigationNoteRepository noteRepository,
                                ThreatRepository threatRepository,
                                UserRepository userRepository,
                                AuditService auditService) {
        this.investigationRepository = investigationRepository;
        this.noteRepository = noteRepository;
        this.threatRepository = threatRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    @Transactional
    public InvestigationResponse createInvestigation(CreateInvestigationRequest request, String actorUsername) {
        Threat threat = threatRepository.findById(request.getThreatId())
                .orElseThrow(() -> new ResourceNotFoundException("Threat not found with ID: " + request.getThreatId()));

        User analyst = null;
        if (request.getAssignedAnalystId() != null) {
            analyst = userRepository.findById(request.getAssignedAnalystId()).orElse(null);
        }
        if (analyst == null) {
            analyst = userRepository.findByUsername(actorUsername).orElse(null);
        }

        String ref = String.format("INV-%d-%06d", Year.now().getValue(), caseCounter.incrementAndGet());

        Investigation inv = new Investigation();
        inv.setInvestigationReference(ref);
        inv.setThreat(threat);
        inv.setAssignedAnalyst(analyst);
        inv.setPriority(request.getPriority());
        inv.setStatus("OPEN");
        inv.setTitle(request.getTitle());
        inv.setSummary(request.getSummary());

        Investigation saved = investigationRepository.save(inv);

        // Update threat status
        threat.setStatus("IN_REVIEW");
        threatRepository.save(threat);

        auditService.record(actorUsername, "INVESTIGATION_CREATED", "INVESTIGATION", saved.getId(), "127.0.0.1",
                String.format("{\"reference\":\"%s\",\"threat\":\"%s\"}", ref, threat.getThreatReference()));

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public Page<InvestigationResponse> getInvestigations(String status, String priority, Pageable pageable) {
        return investigationRepository.findWithFilters(status, priority, pageable).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public InvestigationResponse getInvestigationById(String id) {
        Investigation inv = investigationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Investigation not found with ID: " + id));
        return mapToResponse(inv);
    }

    @Transactional
    public InvestigationResponse updateStatus(String id, UpdateInvestigationStatusRequest req, String actorUsername) {
        Investigation inv = investigationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Investigation not found with ID: " + id));

        inv.setStatus(req.getStatus());
        if (req.getResolutionNotes() != null) {
            inv.setResolutionNotes(req.getResolutionNotes());
        }
        if ("RESOLVED".equals(req.getStatus()) || "CLOSED".equals(req.getStatus()) || "FALSE_POSITIVE".equals(req.getStatus())) {
            inv.setClosedAt(Instant.now());
            if (inv.getThreat() != null) {
                inv.getThreat().setStatus(req.getStatus());
                threatRepository.save(inv.getThreat());
            }
        }

        Investigation saved = investigationRepository.save(inv);

        auditService.record(actorUsername, "INVESTIGATION_STATUS_UPDATED", "INVESTIGATION", id, "127.0.0.1",
                String.format("{\"status\":\"%s\"}", req.getStatus()));

        return mapToResponse(saved);
    }

    @Transactional
    public InvestigationResponse addNote(String id, AddInvestigationNoteRequest req, String actorUsername) {
        Investigation inv = investigationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Investigation not found with ID: " + id));

        User author = userRepository.findByUsername(actorUsername)
                .or(() -> userRepository.findByEmail(actorUsername))
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + actorUsername));

        InvestigationNote note = new InvestigationNote();
        note.setInvestigation(inv);
        note.setAuthor(author);
        note.setContent(req.getContent());

        noteRepository.save(note);

        auditService.record(actorUsername, "INVESTIGATION_NOTE_ADDED", "INVESTIGATION", id, "127.0.0.1", "{}");

        return mapToResponse(inv);
    }

    public InvestigationResponse mapToResponse(Investigation inv) {
        InvestigationResponse resp = new InvestigationResponse();
        resp.setId(inv.getId());
        resp.setInvestigationReference(inv.getInvestigationReference());
        if (inv.getThreat() != null) {
            resp.setThreatId(inv.getThreat().getId());
            resp.setThreatReference(inv.getThreat().getThreatReference());
            String raw = inv.getThreat().getRawContent();
            resp.setThreatContentSnippet(raw.length() > 140 ? raw.substring(0, 137) + "..." : raw);
        }
        if (inv.getAssignedAnalyst() != null) {
            resp.setAssignedAnalystId(inv.getAssignedAnalyst().getId());
            resp.setAssignedAnalystName(inv.getAssignedAnalyst().getFullName());
        }
        resp.setPriority(inv.getPriority());
        resp.setStatus(inv.getStatus());
        resp.setTitle(inv.getTitle());
        resp.setSummary(inv.getSummary());
        resp.setResolutionNotes(inv.getResolutionNotes());
        resp.setCreatedAt(inv.getCreatedAt());
        resp.setUpdatedAt(inv.getUpdatedAt());
        resp.setClosedAt(inv.getClosedAt());

        resp.setNotes(noteRepository.findByInvestigationIdOrderByCreatedAtAsc(inv.getId()).stream()
                .map(n -> new InvestigationNoteResponse(
                        n.getId(),
                        n.getAuthor().getId(),
                        n.getAuthor().getFullName(),
                        n.getContent(),
                        n.getCreatedAt()
                ))
                .collect(Collectors.toList()));

        return resp;
    }
}
