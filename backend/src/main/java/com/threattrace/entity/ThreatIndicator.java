package com.threattrace.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "threat_indicators")
public class ThreatIndicator {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "analysis_id", nullable = false)
    private ThreatAnalysis analysis;

    @Column(name = "indicator_type", nullable = false, length = 50)
    private String indicatorType;

    @Column(nullable = false, length = 150)
    private String label;

    @Column(nullable = false)
    private Double weight;

    @Column(name = "evidence_snippet", columnDefinition = "TEXT")
    private String evidenceSnippet;

    public ThreatIndicator() {}

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

    public String getIndicatorType() { return indicatorType; }
    public void setIndicatorType(String indicatorType) { this.indicatorType = indicatorType; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }

    public String getEvidenceSnippet() { return evidenceSnippet; }
    public void setEvidenceSnippet(String evidenceSnippet) { this.evidenceSnippet = evidenceSnippet; }
}
