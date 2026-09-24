package com.threattrace.dto.response;

import java.time.Instant;

public class AlertResponse {
    private String id;
    private String alertReference;
    private String threatId;
    private String threatReference;
    private String threatSnippet;
    private String alertType;
    private String severity;
    private String status;
    private String acknowledgedById;
    private String acknowledgedByName;
    private Instant acknowledgedAt;
    private Instant createdAt;

    public AlertResponse() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAlertReference() { return alertReference; }
    public void setAlertReference(String alertReference) { this.alertReference = alertReference; }

    public String getThreatId() { return threatId; }
    public void setThreatId(String threatId) { this.threatId = threatId; }

    public String getThreatReference() { return threatReference; }
    public void setThreatReference(String threatReference) { this.threatReference = threatReference; }

    public String getThreatSnippet() { return threatSnippet; }
    public void setThreatSnippet(String threatSnippet) { this.threatSnippet = threatSnippet; }

    public String getAlertType() { return alertType; }
    public void setAlertType(String alertType) { this.alertType = alertType; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAcknowledgedById() { return acknowledgedById; }
    public void setAcknowledgedById(String acknowledgedById) { this.acknowledgedById = acknowledgedById; }

    public String getAcknowledgedByName() { return acknowledgedByName; }
    public void setAcknowledgedByName(String acknowledgedByName) { this.acknowledgedByName = acknowledgedByName; }

    public Instant getAcknowledgedAt() { return acknowledgedAt; }
    public void setAcknowledgedAt(Instant acknowledgedAt) { this.acknowledgedAt = acknowledgedAt; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
