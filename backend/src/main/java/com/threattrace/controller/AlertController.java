package com.threattrace.controller;

import com.threattrace.dto.response.AlertResponse;
import com.threattrace.security.UserPrincipal;
import com.threattrace.service.AlertService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/alerts")
@Tag(name = "Alert Engine", description = "Endpoints for managing real-time SOC alerts and analyst acknowledgments")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    @Operation(summary = "Query SOC alerts with pagination and severity filtering")
    public ResponseEntity<Page<AlertResponse>> getAlerts(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String severity,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<AlertResponse> alerts = alertService.getAlerts(status, severity, PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(alerts);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get specific alert details")
    public ResponseEntity<AlertResponse> getAlertById(@PathVariable String id) {
        return ResponseEntity.ok(alertService.getAlertById(id));
    }

    @PostMapping("/{id}/acknowledge")
    @PreAuthorize("hasAnyRole('ANALYST', 'INVESTIGATOR', 'ADMIN')")
    @Operation(summary = "Acknowledge an active security alert")
    public ResponseEntity<AlertResponse> acknowledgeAlert(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        String username = (principal != null) ? principal.getUsername() : "anonymous";
        return ResponseEntity.ok(alertService.acknowledgeAlert(id, username));
    }
}
