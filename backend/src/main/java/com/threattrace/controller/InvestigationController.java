package com.threattrace.controller;

import com.threattrace.dto.request.AddInvestigationNoteRequest;
import com.threattrace.dto.request.CreateInvestigationRequest;
import com.threattrace.dto.request.UpdateInvestigationStatusRequest;
import com.threattrace.dto.response.InvestigationResponse;
import com.threattrace.security.UserPrincipal;
import com.threattrace.service.InvestigationService;
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

@RestController
@RequestMapping("/api/v1/investigations")
@Tag(name = "Investigation Workspace", description = "Endpoints for managing SOC investigation cases and analyst notes")
public class InvestigationController {

    private final InvestigationService investigationService;

    public InvestigationController(InvestigationService investigationService) {
        this.investigationService = investigationService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('INVESTIGATOR', 'ADMIN', 'ANALYST')")
    @Operation(summary = "List investigation cases with status/priority filtering")
    public ResponseEntity<Page<InvestigationResponse>> getInvestigations(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<InvestigationResponse> results = investigationService.getInvestigations(
                status, priority, PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
        return ResponseEntity.ok(results);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('INVESTIGATOR', 'ADMIN')")
    @Operation(summary = "Open a new formal investigation case from a threat signal")
    public ResponseEntity<InvestigationResponse> createInvestigation(
            @Valid @RequestBody CreateInvestigationRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        String username = (principal != null) ? principal.getUsername() : "anonymous";
        InvestigationResponse resp = investigationService.createInvestigation(request, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('INVESTIGATOR', 'ADMIN', 'ANALYST')")
    @Operation(summary = "Get full investigation workspace case details and timeline notes")
    public ResponseEntity<InvestigationResponse> getInvestigationById(@PathVariable String id) {
        return ResponseEntity.ok(investigationService.getInvestigationById(id));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('INVESTIGATOR', 'ADMIN')")
    @Operation(summary = "Update investigation case lifecycle status and resolution notes")
    public ResponseEntity<InvestigationResponse> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateInvestigationStatusRequest req,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        String username = (principal != null) ? principal.getUsername() : "anonymous";
        return ResponseEntity.ok(investigationService.updateStatus(id, req, username));
    }

    @PostMapping("/{id}/notes")
    @PreAuthorize("hasAnyRole('INVESTIGATOR', 'ADMIN', 'ANALYST')")
    @Operation(summary = "Add an immutable analyst case note to the investigation log")
    public ResponseEntity<InvestigationResponse> addNote(
            @PathVariable String id,
            @Valid @RequestBody AddInvestigationNoteRequest req,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        String username = (principal != null) ? principal.getUsername() : "anonymous";
        return ResponseEntity.ok(investigationService.addNote(id, req, username));
    }
}
