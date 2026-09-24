package com.threattrace.controller;

import com.threattrace.dto.response.AuditLogResponse;
import com.threattrace.entity.AuditLog;
import com.threattrace.repository.AuditLogRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/audit")
@Tag(name = "Audit Log Trail", description = "Endpoints for querying immutable security audit events (Admin only)")
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;

    public AuditLogController(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Search tamper-evident security audit log trail")
    public ResponseEntity<Page<AuditLogResponse>> getAuditLogs(
            @RequestParam(required = false) String actor,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String resourceType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        Page<AuditLog> results = auditLogRepository.findWithFilters(actor, action, resourceType, PageRequest.of(page, size));
        return ResponseEntity.ok(results.map(a -> new AuditLogResponse(
                a.getId(), a.getActor(), a.getAction(), a.getResourceType(), a.getResourceId(),
                a.getIpAddress(), a.getMetadata(), a.getCreatedAt()
        )));
    }
}
