package com.threattrace.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class UpdateInvestigationStatusRequest {

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(OPEN|IN_REVIEW|ESCALATED|RESOLVED|FALSE_POSITIVE|CLOSED)$",
            message = "Status must be OPEN, IN_REVIEW, ESCALATED, RESOLVED, FALSE_POSITIVE, or CLOSED")
    private String status;

    private String resolutionNotes;

    public UpdateInvestigationStatusRequest() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }
}
