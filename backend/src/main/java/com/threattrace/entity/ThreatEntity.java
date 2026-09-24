package com.threattrace.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "threat_entities")
public class ThreatEntity {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "analysis_id", nullable = false)
    private ThreatAnalysis analysis;

    @Column(name = "entity_type", nullable = false, length = 50)
    private String entityType;

    @Column(name = "entity_value", nullable = false, length = 255)
    private String entityValue;

    @Column(nullable = false)
    private Double confidence;

    @Column(name = "start_offset")
    private Integer startOffset;

    @Column(name = "end_offset")
    private Integer endOffset;

    @Column(name = "source_span", length = 500)
    private String sourceSpan;

    public ThreatEntity() {}

    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = java.util.UUID.randomUUID().toString();
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public ThreatAnalysis getAnalysis() { return analysis; }
    public void setAnalysis(ThreatAnalysis analysis) { this.analysis = analysis; }

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
