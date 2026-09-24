package com.threattrace.dto.response;

import java.time.Instant;

public class ModelVersionResponse {
    private String id;
    private String modelName;
    private String modelVersion;
    private String modelType;
    private String trainingDataset;
    private String evaluationMetrics;
    private String status;
    private Instant deployedAt;

    public ModelVersionResponse() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }

    public String getModelVersion() { return modelVersion; }
    public void setModelVersion(String modelVersion) { this.modelVersion = modelVersion; }

    public String getModelType() { return modelType; }
    public void setModelType(String modelType) { this.modelType = modelType; }

    public String getTrainingDataset() { return trainingDataset; }
    public void setTrainingDataset(String trainingDataset) { this.trainingDataset = trainingDataset; }

    public String getEvaluationMetrics() { return evaluationMetrics; }
    public void setEvaluationMetrics(String evaluationMetrics) { this.evaluationMetrics = evaluationMetrics; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getDeployedAt() { return deployedAt; }
    public void setDeployedAt(Instant deployedAt) { this.deployedAt = deployedAt; }
}
