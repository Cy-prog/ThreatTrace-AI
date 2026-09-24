package com.threattrace.dto.response;

import java.time.Instant;

public class ThreatDetailResponse {
    private String id;
    private String threatReference;
    private String sourceType;
    private String sourceReference;
    private String rawContent;
    private String status;
    private String locationName;
    private Double latitude;
    private Double longitude;
    private Boolean geoVerified;
    private String reportedByUsername;
    private Instant submittedAt;
    private Instant createdAt;
    private Instant updatedAt;
    private ThreatAnalysisDTO analysis;

    public ThreatDetailResponse() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getThreatReference() { return threatReference; }
    public void setThreatReference(String threatReference) { this.threatReference = threatReference; }

    public String getSourceType() { return sourceType; }
    public void setSourceType(String sourceType) { this.sourceType = sourceType; }

    public String getSourceReference() { return sourceReference; }
    public void setSourceReference(String sourceReference) { this.sourceReference = sourceReference; }

    public String getRawContent() { return rawContent; }
    public void setRawContent(String rawContent) { this.rawContent = rawContent; }

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

    public String getReportedByUsername() { return reportedByUsername; }
    public void setReportedByUsername(String reportedByUsername) { this.reportedByUsername = reportedByUsername; }

    public Instant getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Instant submittedAt) { this.submittedAt = submittedAt; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public ThreatAnalysisDTO getAnalysis() { return analysis; }
    public void setAnalysis(ThreatAnalysisDTO analysis) { this.analysis = analysis; }
}
