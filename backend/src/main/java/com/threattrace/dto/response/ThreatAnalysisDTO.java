package com.threattrace.dto.response;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class ThreatAnalysisDTO {
    private String id;
    private String predictedCategory;
    private Double confidence;
    private Integer riskScore;
    private String severity;
    private String sentimentLabel;
    private Double sentimentScore;
    private Double urgencyScore;
    private String explanationSummary;
    private List<SignalBreakdownItem> signalBreakdown = new ArrayList<>();
    private String modelName;
    private String modelVersion;
    private Boolean humanReviewRequired;
    private Instant analyzedAt;
    private List<ThreatEntityDTO> entities = new ArrayList<>();
    private List<ThreatIndicatorDTO> indicators = new ArrayList<>();

    public ThreatAnalysisDTO() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

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

    public List<SignalBreakdownItem> getSignalBreakdown() { return signalBreakdown; }
    public void setSignalBreakdown(List<SignalBreakdownItem> signalBreakdown) { this.signalBreakdown = signalBreakdown; }

    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }

    public String getModelVersion() { return modelVersion; }
    public void setModelVersion(String modelVersion) { this.modelVersion = modelVersion; }

    public Boolean getHumanReviewRequired() { return humanReviewRequired; }
    public void setHumanReviewRequired(Boolean humanReviewRequired) { this.humanReviewRequired = humanReviewRequired; }

    public Instant getAnalyzedAt() { return analyzedAt; }
    public void setAnalyzedAt(Instant analyzedAt) { this.analyzedAt = analyzedAt; }

    public List<ThreatEntityDTO> getEntities() { return entities; }
    public void setEntities(List<ThreatEntityDTO> entities) { this.entities = entities; }

    public List<ThreatIndicatorDTO> getIndicators() { return indicators; }
    public void setIndicators(List<ThreatIndicatorDTO> indicators) { this.indicators = indicators; }
}
