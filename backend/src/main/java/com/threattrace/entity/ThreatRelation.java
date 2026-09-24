package com.threattrace.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "threat_relations")
public class ThreatRelation {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_threat_id", nullable = false)
    private Threat sourceThreat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_threat_id", nullable = false)
    private Threat targetThreat;

    @Column(name = "similarity_score", nullable = false)
    private Double similarityScore;

    @Column(name = "correlation_reason", nullable = false, length = 100)
    private String correlationReason;

    @Column(columnDefinition = "TEXT")
    private String metadata;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public ThreatRelation() {}

    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = java.util.UUID.randomUUID().toString();
        }
        createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Threat getSourceThreat() { return sourceThreat; }
    public void setSourceThreat(Threat sourceThreat) { this.sourceThreat = sourceThreat; }

    public Threat getTargetThreat() { return targetThreat; }
    public void setTargetThreat(Threat targetThreat) { this.targetThreat = targetThreat; }

    public Double getSimilarityScore() { return similarityScore; }
    public void setSimilarityScore(Double similarityScore) { this.similarityScore = similarityScore; }

    public String getCorrelationReason() { return correlationReason; }
    public void setCorrelationReason(String correlationReason) { this.correlationReason = correlationReason; }

    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
