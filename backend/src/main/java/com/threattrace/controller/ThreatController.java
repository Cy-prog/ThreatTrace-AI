package com.threattrace.controller;

import com.threattrace.dto.request.ThreatIngestRequest;
import com.threattrace.dto.request.UpdateThreatStatusRequest;
import com.threattrace.dto.response.ThreatDetailResponse;
import com.threattrace.dto.response.ThreatSummaryResponse;
import com.threattrace.security.UserPrincipal;
import com.threattrace.service.ThreatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/threats")
@Tag(name = "Threat Intelligence", description = "Endpoints for threat ingestion, triage, retrieval, and re-analysis")
public class ThreatController {

    private final ThreatService threatService;

    public ThreatController(ThreatService threatService) {
        this.threatService = threatService;
    }

    @GetMapping
    @Operation(summary = "Search and filter threat reports with pagination")
    public ResponseEntity<Page<ThreatSummaryResponse>> getThreats(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String sourceType,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Integer minRisk,
            @RequestParam(required = false) Integer maxRisk,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Page<ThreatSummaryResponse> results = threatService.getThreats(
                query, sourceType, status, severity, category, minRisk, maxRisk, PageRequest.of(page, size, sort)
        );
        return ResponseEntity.ok(results);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ANALYST', 'INVESTIGATOR', 'ADMIN')")
    @Operation(summary = "Ingest a new threat report for automated AI pipeline analysis")
    public ResponseEntity<ThreatDetailResponse> ingestThreat(
            @Valid @RequestBody ThreatIngestRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        String username = (principal != null) ? principal.getUsername() : null;
        ThreatDetailResponse response = threatService.ingestThreat(request, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Retrieve detailed threat intelligence including entities and indicators")
    public ResponseEntity<ThreatDetailResponse> getThreatById(@PathVariable String id) {
        return ResponseEntity.ok(threatService.getThreatById(id));
    }

    @PostMapping("/{id}/reanalyze")
    @PreAuthorize("hasAnyRole('ANALYST', 'INVESTIGATOR', 'ADMIN')")
    @Operation(summary = "Re-execute AI analysis pipeline on existing threat content")
    public ResponseEntity<ThreatDetailResponse> reanalyzeThreat(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        String username = (principal != null) ? principal.getUsername() : "anonymous";
        return ResponseEntity.ok(threatService.reanalyzeThreat(id, username));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ANALYST', 'INVESTIGATOR', 'ADMIN')")
    @Operation(summary = "Update threat investigation status (e.g. IN_REVIEW, FALSE_POSITIVE, RESOLVED)")
    public ResponseEntity<ThreatDetailResponse> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateThreatStatusRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        String username = (principal != null) ? principal.getUsername() : "anonymous";
        return ResponseEntity.ok(threatService.updateStatus(id, request, username));
    }

    @GetMapping("/map")
    @Operation(summary = "Retrieve verified geocoded threat incidents for the SOC Threat Map")
    public ResponseEntity<List<ThreatSummaryResponse>> getThreatMapData() {
        return ResponseEntity.ok(threatService.getGeoVerifiedThreats());
    }
}
