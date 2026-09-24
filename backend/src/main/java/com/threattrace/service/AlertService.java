package com.threattrace.service;

import com.threattrace.dto.response.AlertResponse;
import com.threattrace.dto.response.ThreatAnalysisDTO;
import com.threattrace.entity.Alert;
import com.threattrace.entity.Threat;
import com.threattrace.entity.User;
import com.threattrace.exception.ResourceNotFoundException;
import com.threattrace.repository.AlertRepository;
import com.threattrace.repository.UserRepository;
import com.threattrace.service.notification.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.Year;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class AlertService {

    private final AlertRepository alertRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final AuditService auditService;
    private final AtomicInteger alertCounter = new AtomicInteger(100);

    public AlertService(AlertRepository alertRepository, UserRepository userRepository,
                        NotificationService notificationService, AuditService auditService) {
        this.alertRepository = alertRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.auditService = auditService;
    }

    @Transactional
    public void evaluateAndCreateAlerts(Threat threat, ThreatAnalysisDTO analysis) {
        if (analysis == null) return;

        // Rule 1: Critical Severity Threshold (Risk >= 80)
        if (analysis.getRiskScore() >= 80) {
            createAlert(threat, "CRITICAL_SEVERITY_THRESHOLD", "CRITICAL");
        } 
        // Rule 2: High Risk Category (Risk >= 60)
        else if (analysis.getRiskScore() >= 60) {
            createAlert(threat, "HIGH_RISK_THRESHOLD", "HIGH");
        }
    }

    @Transactional
    public Alert createAlert(Threat threat, String alertType, String severity) {
        String alertRef = String.format("ALT-%d-%06d", Year.now().getValue(), alertCounter.incrementAndGet());

        Alert alert = new Alert();
        alert.setAlertReference(alertRef);
        alert.setThreat(threat);
        alert.setAlertType(alertType);
        alert.setSeverity(severity);
        alert.setStatus("OPEN");
        alert.setCreatedAt(Instant.now());

        Alert saved = alertRepository.save(alert);

        // Dispatch notifications
        notificationService.dispatch("NEW_ALERT: " + alertRef,
                String.format("[%s] Alert triggered for threat %s: %s", severity, threat.getThreatReference(), alertType),
                mapToResponse(saved));

        // Audit log
        auditService.record("system", "ALERT_CREATED", "ALERT", saved.getId(), "127.0.0.1",
                String.format("{\"reference\":\"%s\",\"severity\":\"%s\"}", alertRef, severity));

        return saved;
    }

    @Transactional(readOnly = true)
    public Page<AlertResponse> getAlerts(String status, String severity, Pageable pageable) {
        return alertRepository.findWithFilters(status, severity, pageable).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public AlertResponse getAlertById(String id) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found with ID: " + id));
        return mapToResponse(alert);
    }

    @Transactional
    public AlertResponse acknowledgeAlert(String id, String username) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found with ID: " + id));

        User user = userRepository.findByUsername(username)
                .or(() -> userRepository.findByEmail(username))
                .orElse(null);

        alert.setStatus("ACKNOWLEDGED");
        alert.setAcknowledgedBy(user);
        alert.setAcknowledgedAt(Instant.now());

        Alert updated = alertRepository.save(alert);

        auditService.record(username, "ALERT_ACKNOWLEDGED", "ALERT", alert.getId(), "127.0.0.1",
                String.format("{\"reference\":\"%s\"}", alert.getAlertReference()));

        return mapToResponse(updated);
    }

    public AlertResponse mapToResponse(Alert alert) {
        AlertResponse resp = new AlertResponse();
        resp.setId(alert.getId());
        resp.setAlertReference(alert.getAlertReference());
        if (alert.getThreat() != null) {
            resp.setThreatId(alert.getThreat().getId());
            resp.setThreatReference(alert.getThreat().getThreatReference());
            String raw = alert.getThreat().getRawContent();
            resp.setThreatSnippet(raw.length() > 120 ? raw.substring(0, 117) + "..." : raw);
        }
        resp.setAlertType(alert.getAlertType());
        resp.setSeverity(alert.getSeverity());
        resp.setStatus(alert.getStatus());
        if (alert.getAcknowledgedBy() != null) {
            resp.setAcknowledgedById(alert.getAcknowledgedBy().getId());
            resp.setAcknowledgedByName(alert.getAcknowledgedBy().getFullName());
        }
        resp.setAcknowledgedAt(alert.getAcknowledgedAt());
        resp.setCreatedAt(alert.getCreatedAt());
        return resp;
    }
}
