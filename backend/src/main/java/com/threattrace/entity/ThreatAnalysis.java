package com.threattrace.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "threat_analyses")
public class ThreatAnalysis {

    @Id
    @Column(length = 36)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "threat_id", nullable = false, unique = true)
    private Threat threat;

    @Column(name = "predicted_category", nullable = false, length = 100)
    private String predictedCategory;

    @Column(nullable = false)
    private Double confidence;

    @Column(name = "risk_score", nullable = false)
    private Integer riskScore;

    @Column(nullable = false, length = 30)
    private String severity;

    @Column(name = "sentiment_label", length = 50)
    private String sentimentLabel;

    @Column(name = "sentiment_score")
    private Double sentimentScore;

    @Column(name = "urgency_score")
    private Double urgencyScore;

    @Column(name = "explanation_summary", columnDefinition = "TEXT")
    private String explanationSummary;

    @Column(name = "signal_breakdown", columnDefinition = "TEXT")
    private String signalBreakdown;

    @Column(name = "model_name", nullable = false, length = 100)
    private String modelName;

    @Column(name = "model_version", nullable = false, length = 50)
    private String modelVersion;

    @Column(name = "human_review_required")
    private Boolean humanReviewRequired = true;

    @Column(name = "analyzed_at", nullable = false)
    private Instant analyzedAt;

    @OneToMany(mappedBy = "analysis", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ThreatEntity> entities = new ArrayList<>();

    @OneToMany(mappedBy = "analysis", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ThreatIndicator> indicators = new ArrayList<>();

    public ThreatAnalysis() {}

    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = java.util.UUID.randomUUID().toString();
        }
        if (analyzedAt == null) {
            analyzedAt = Instant.now();
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Threat getThreat() { return threat; }
    public void setThreat(Threat threat) { this.threat = threat; }

    public String getPredictedCategory() { return predictedCategory; }
    public void setPredictedCategory(String predictedCategory) { this.predictedCategory = predictedCategory; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getSentimentLabel() { return sentimentLabel; }
    public void setSentimentLabel(String sentimentLabel) { this.sentimentLabel = sentimentLabel; }

    public Double getSentimentScore() { return sentimentScore; }
    public void setSentimentScore(Double sentimentScore) { this.sentimentScore = sentimentScore; }

    public Double getUrgencyScore() { return urgencyScore; }
    public void setUrgencyScore(Double urgencyScore) { this.urgencyScore = urgencyScore; }

    public String getExplanationSummary() { return explanationSummary; }
    public void setExplanationSummary(String explanationSummary) { this.explanationSummary = explanationSummary; }

    public String getSignalBreakdown() { return signalBreakdown; }
    public void setSignalBreakdown(String signalBreakdown) { this.signalBreakdown = signalBreakdown; }

    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }

    public String getModelVersion() { return modelVersion; }
    public void setModelVersion(String modelVersion) { this.modelVersion = modelVersion; }

    public Boolean getHumanReviewRequired() { return humanReviewRequired; }
    public void setHumanReviewRequired(Boolean humanReviewRequired) { this.humanReviewRequired = humanReviewRequired; }

    public Instant getAnalyzedAt() { return analyzedAt; }
    public void setAnalyzedAt(Instant analyzedAt) { this.analyzedAt = analyzedAt; }

    public List<ThreatEntity> getEntities() { return entities; }
    public void setEntities(List<ThreatEntity> entities) { this.entities = entities; }

    public List<ThreatIndicator> getIndicators() { return indicators; }
    public void setIndicators(List<ThreatIndicator> indicators) { this.indicators = indicators; }
}
