package com.threattrace.dto.response;

import java.time.Instant;

public class InvestigationNoteResponse {
    private String id;
    private String authorId;
    private String authorName;
    private String content;
    private Instant createdAt;

    public InvestigationNoteResponse() {}

    public InvestigationNoteResponse(String id, String authorId, String authorName, String content, Instant createdAt) {
        this.id = id;
        this.authorId = authorId;
        this.authorName = authorName;
        this.content = content;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAuthorId() { return authorId; }
    public void setAuthorId(String authorId) { this.authorId = authorId; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
