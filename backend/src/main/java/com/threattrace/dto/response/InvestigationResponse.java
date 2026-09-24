package com.threattrace.dto.response;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class InvestigationResponse {
    private String id;
    private String investigationReference;
    private String threatId;
    private String threatReference;
    private String threatContentSnippet;
    private String assignedAnalystId;
    private String assignedAnalystName;
    private String priority;
    private String status;
    private String title;
    private String summary;
    private String resolutionNotes;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant closedAt;
    private List<InvestigationNoteResponse> notes = new ArrayList<>();

    public InvestigationResponse() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getInvestigationReference() { return investigationReference; }
    public void setInvestigationReference(String investigationReference) { this.investigationReference = investigationReference; }

    public String getThreatId() { return threatId; }
    public void setThreatId(String threatId) { this.threatId = threatId; }

    public String getThreatReference() { return threatReference; }
    public void setThreatReference(String threatReference) { this.threatReference = threatReference; }

    public String getThreatContentSnippet() { return threatContentSnippet; }
    public void setThreatContentSnippet(String threatContentSnippet) { this.threatContentSnippet = threatContentSnippet; }

    public String getAssignedAnalystId() { return assignedAnalystId; }
    public void setAssignedAnalystId(String assignedAnalystId) { this.assignedAnalystId = assignedAnalystId; }

    public String getAssignedAnalystName() { return assignedAnalystName; }
    public void setAssignedAnalystName(String assignedAnalystName) { this.assignedAnalystName = assignedAnalystName; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public Instant getClosedAt() { return closedAt; }
    public void setClosedAt(Instant closedAt) { this.closedAt = closedAt; }

    public List<InvestigationNoteResponse> getNotes() { return notes; }
    public void setNotes(List<InvestigationNoteResponse> notes) { this.notes = notes; }
}
