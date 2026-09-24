package com.threattrace.dto.request;

import jakarta.validation.constraints.NotBlank;

public class AddInvestigationNoteRequest {

    @NotBlank(message = "Note content cannot be empty")
    private String content;

    public AddInvestigationNoteRequest() {}

    public AddInvestigationNoteRequest(String content) {
        this.content = content;
    }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
