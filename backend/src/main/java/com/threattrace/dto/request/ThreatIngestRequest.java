package com.threattrace.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ThreatIngestRequest {

    @NotBlank(message = "Source type is required")
    @Pattern(regexp = "^(EMAIL|WEB_REPORT|SOCIAL_MEDIA|MESSAGE|USER_REPORT|API|FILE_UPLOAD)$",
            message = "Source type must be one of: EMAIL, WEB_REPORT, SOCIAL_MEDIA, MESSAGE, USER_REPORT, API, FILE_UPLOAD")
    private String sourceType;

    @Size(max = 255, message = "Source reference cannot exceed 255 characters")
    private String sourceReference;

    @NotBlank(message = "Content cannot be blank")
    @Size(min = 5, max = 100000, message = "Threat content must be between 5 and 100,000 characters")
    private String rawContent;

    private String locationName;
    private Double latitude;
    private Double longitude;

    public ThreatIngestRequest() {}

    public String getSourceType() { return sourceType; }
    public void setSourceType(String sourceType) { this.sourceType = sourceType; }

    public String getSourceReference() { return sourceReference; }
    public void setSourceReference(String sourceReference) { this.sourceReference = sourceReference; }

    public String getRawContent() { return rawContent; }
    public void setRawContent(String rawContent) { this.rawContent = rawContent; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}
