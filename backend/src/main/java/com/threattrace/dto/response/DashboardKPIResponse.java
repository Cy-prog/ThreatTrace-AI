package com.threattrace.dto.response;

import java.util.Map;

public class DashboardKPIResponse {
    private long totalThreats;
    private long highRiskThreats;
    private long activeInvestigations;
    private long openAlerts;
    private long requiringReview;
    private double averageRiskScore;
    private Map<String, Long> severityDistribution;
    private Map<String, Long> categoryDistribution;
    private Map<String, Long> sourceDistribution;

    public DashboardKPIResponse() {}

    public DashboardKPIResponse(long totalThreats, long highRiskThreats, long activeInvestigations,
                                long openAlerts, long requiringReview, double averageRiskScore,
                                Map<String, Long> severityDistribution,
                                Map<String, Long> categoryDistribution,
                                Map<String, Long> sourceDistribution) {
        this.totalThreats = totalThreats;
        this.highRiskThreats = highRiskThreats;
        this.activeInvestigations = activeInvestigations;
        this.openAlerts = openAlerts;
        this.requiringReview = requiringReview;
        this.averageRiskScore = averageRiskScore;
        this.severityDistribution = severityDistribution;
        this.categoryDistribution = categoryDistribution;
        this.sourceDistribution = sourceDistribution;
    }

    public long getTotalThreats() { return totalThreats; }
    public void setTotalThreats(long totalThreats) { this.totalThreats = totalThreats; }

    public long getHighRiskThreats() { return highRiskThreats; }
    public void setHighRiskThreats(long highRiskThreats) { this.highRiskThreats = highRiskThreats; }

    public long getActiveInvestigations() { return activeInvestigations; }
    public void setActiveInvestigations(long activeInvestigations) { this.activeInvestigations = activeInvestigations; }

    public long getOpenAlerts() { return openAlerts; }
    public void setOpenAlerts(long openAlerts) { this.openAlerts = openAlerts; }

    public long getRequiringReview() { return requiringReview; }
    public void setRequiringReview(long requiringReview) { this.requiringReview = requiringReview; }

    public double getAverageRiskScore() { return averageRiskScore; }
    public void setAverageRiskScore(double averageRiskScore) { this.averageRiskScore = averageRiskScore; }

    public Map<String, Long> getSeverityDistribution() { return severityDistribution; }
    public void setSeverityDistribution(Map<String, Long> severityDistribution) { this.severityDistribution = severityDistribution; }

    public Map<String, Long> getCategoryDistribution() { return categoryDistribution; }
    public void setCategoryDistribution(Map<String, Long> categoryDistribution) { this.categoryDistribution = categoryDistribution; }

    public Map<String, Long> getSourceDistribution() { return sourceDistribution; }
    public void setSourceDistribution(Map<String, Long> sourceDistribution) { this.sourceDistribution = sourceDistribution; }
}
