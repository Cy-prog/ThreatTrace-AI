package com.threattrace.service;

import com.threattrace.dto.response.ModelVersionResponse;
import com.threattrace.entity.ModelVersion;
import com.threattrace.repository.ModelVersionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ModelRegistryService {

    private final ModelVersionRepository modelVersionRepository;

    public ModelRegistryService(ModelVersionRepository modelVersionRepository) {
        this.modelVersionRepository = modelVersionRepository;
    }

    @Transactional(readOnly = true)
    public List<ModelVersionResponse> getRegisteredModels() {
        return modelVersionRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ModelVersionResponse mapToResponse(ModelVersion model) {
        ModelVersionResponse resp = new ModelVersionResponse();
        resp.setId(model.getId());
        resp.setModelName(model.getModelName());
        resp.setModelVersion(model.getModelVersion());
        resp.setModelType(model.getModelType());
        resp.setTrainingDataset(model.getTrainingDataset());
        resp.setEvaluationMetrics(model.getEvaluationMetrics());
        resp.setStatus(model.getStatus());
        resp.setDeployedAt(model.getDeployedAt());
        return resp;
    }
}
