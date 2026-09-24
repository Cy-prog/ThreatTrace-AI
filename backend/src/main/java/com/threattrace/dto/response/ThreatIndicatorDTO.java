package com.threattrace.dto.response;

public class ThreatIndicatorDTO {
    private String id;
    private String indicatorType;
    private String label;
    private Double weight;
    private String evidenceSnippet;

    public ThreatIndicatorDTO() {}

    public ThreatIndicatorDTO(String id, String indicatorType, String label, Double weight, String evidenceSnippet) {
        this.id = id;
        this.indicatorType = indicatorType;
        this.label = label;
        this.weight = weight;
        this.evidenceSnippet = evidenceSnippet;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getIndicatorType() { return indicatorType; }
    public void setIndicatorType(String indicatorType) { this.indicatorType = indicatorType; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }

    public String getEvidenceSnippet() { return evidenceSnippet; }
    public void setEvidenceSnippet(String evidenceSnippet) { this.evidenceSnippet = evidenceSnippet; }
}
