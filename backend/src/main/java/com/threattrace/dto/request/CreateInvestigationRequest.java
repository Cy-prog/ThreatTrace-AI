package com.threattrace.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class CreateInvestigationRequest {

    @NotBlank(message = "Threat ID is required")
    private String threatId;

    @NotBlank(message = "Title is required")
    private String title;

    private String summary;

    @NotBlank(message = "Priority is required")
    @Pattern(regexp = "^(LOW|MEDIUM|HIGH|CRITICAL)$", message = "Priority must be LOW, MEDIUM, HIGH, or CRITICAL")
    private String priority;

    private String assignedAnalystId;

    public CreateInvestigationRequest() {}

    public String getThreatId() { return threatId; }
    public void setThreatId(String threatId) { this.threatId = threatId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getAssignedAnalystId() { return assignedAnalystId; }
    public void setAssignedAnalystId(String assignedAnalystId) { this.assignedAnalystId = assignedAnalystId; }
}
