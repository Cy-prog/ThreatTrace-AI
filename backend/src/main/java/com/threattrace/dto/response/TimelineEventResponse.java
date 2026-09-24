package com.threattrace.dto.response;

import java.time.Instant;

public class TimelineEventResponse {
    private String id;
    private Instant timestamp;
    private String threatId;
    private String threatReference;
    private String source;
    private String category;
    private String severity;
    private Integer riskScore;
    private String status;
    private String analyst;
    private String location;
    private String snippet;

    public TimelineEventResponse() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    public String getThreatId() { return threatId; }
    public void setThreatId(String threatId) { this.threatId = threatId; }

    public String getThreatReference() { return threatReference; }
    public void setThreatReference(String threatReference) { this.threatReference = threatReference; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAnalyst() { return analyst; }
    public void setAnalyst(String analyst) { this.analyst = analyst; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getSnippet() { return snippet; }
    public void setSnippet(String snippet) { this.snippet = snippet; }
}
