package com.threattrace.controller;

import com.threattrace.dto.response.ModelVersionResponse;
import com.threattrace.service.ModelRegistryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/models")
@Tag(name = "Model Intelligence Registry", description = "Endpoints for inspecting deployed AI models, versions, and evaluation metrics")
public class ModelController {

    private final ModelRegistryService modelRegistryService;

    public ModelController(ModelRegistryService modelRegistryService) {
        this.modelRegistryService = modelRegistryService;
    }

    @GetMapping
    @Operation(summary = "List all deployed model artifacts and their measured evaluation metrics")
    public ResponseEntity<List<ModelVersionResponse>> getRegisteredModels() {
        return ResponseEntity.ok(modelRegistryService.getRegisteredModels());
    }
}
