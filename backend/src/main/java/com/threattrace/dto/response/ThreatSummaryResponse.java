package com.threattrace.dto.response;

import java.time.Instant;

public class ThreatSummaryResponse {
    private String id;
    private String threatReference;
    private String sourceType;
    private String sourceReference;
    private String status;
    private String locationName;
    private Double latitude;
    private Double longitude;
    private Boolean geoVerified;
    private Instant createdAt;
    private String category;
    private String severity;
    private Integer riskScore;
    private Double confidence;

    public ThreatSummaryResponse() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getThreatReference() { return threatReference; }
    public void setThreatReference(String threatReference) { this.threatReference = threatReference; }

    public String getSourceType() { return sourceType; }
    public void setSourceType(String sourceType) { this.sourceType = sourceType; }

    public String getSourceReference() { return sourceReference; }
    public void setSourceReference(String sourceReference) { this.sourceReference = sourceReference; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Boolean getGeoVerified() { return geoVerified; }
    public void setGeoVerified(Boolean geoVerified) { this.geoVerified = geoVerified; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }
}
