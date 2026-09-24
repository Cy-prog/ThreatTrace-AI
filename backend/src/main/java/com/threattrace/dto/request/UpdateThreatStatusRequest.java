package com.threattrace.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class UpdateThreatStatusRequest {

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(PENDING|ANALYZED|IN_REVIEW|ESCALATED|RESOLVED|FALSE_POSITIVE)$",
            message = "Status must be PENDING, ANALYZED, IN_REVIEW, ESCALATED, RESOLVED, or FALSE_POSITIVE")
    private String status;

    public UpdateThreatStatusRequest() {}

    public UpdateThreatStatusRequest(String status) {
        this.status = status;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
