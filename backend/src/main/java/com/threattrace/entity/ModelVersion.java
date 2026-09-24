package com.threattrace.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "model_versions")
public class ModelVersion {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "model_name", nullable = false, length = 100)
    private String modelName;

    @Column(name = "model_version", nullable = false, length = 50)
    private String modelVersion;

    @Column(name = "model_type", nullable = false, length = 50)
    private String modelType;

    @Column(name = "training_dataset", length = 150)
    private String trainingDataset;

    @Column(name = "evaluation_metrics", columnDefinition = "TEXT")
    private String evaluationMetrics;

    @Column(nullable = false, length = 30)
    private String status;

    @Column(name = "deployed_at", nullable = false)
    private Instant deployedAt;

    public ModelVersion() {}

    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = java.util.UUID.randomUUID().toString();
        }
        if (deployedAt == null) {
            deployedAt = Instant.now();
        }
    }

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
