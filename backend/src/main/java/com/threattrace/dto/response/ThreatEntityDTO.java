package com.threattrace.dto.response;

public class ThreatEntityDTO {
    private String id;
    private String entityType;
    private String entityValue;
    private Double confidence;
    private Integer startOffset;
    private Integer endOffset;
    private String sourceSpan;

    public ThreatEntityDTO() {}

    public ThreatEntityDTO(String id, String entityType, String entityValue, Double confidence,
                           Integer startOffset, Integer endOffset, String sourceSpan) {
        this.id = id;
        this.entityType = entityType;
        this.entityValue = entityValue;
        this.confidence = confidence;
        this.startOffset = startOffset;
        this.endOffset = endOffset;
        this.sourceSpan = sourceSpan;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public String getEntityValue() { return entityValue; }
    public void setEntityValue(String entityValue) { this.entityValue = entityValue; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public Integer getStartOffset() { return startOffset; }
    public void setStartOffset(Integer startOffset) { this.startOffset = startOffset; }

    public Integer getEndOffset() { return endOffset; }
    public void setEndOffset(Integer endOffset) { this.endOffset = endOffset; }

    public String getSourceSpan() { return sourceSpan; }
    public void setSourceSpan(String sourceSpan) { this.sourceSpan = sourceSpan; }
}
