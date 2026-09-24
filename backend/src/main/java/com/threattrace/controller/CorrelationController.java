package com.threattrace.controller;

import com.threattrace.dto.response.CorrelationGraphResponse;
import com.threattrace.service.CorrelationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/correlations")
@Tag(name = "Threat Correlations & Intelligence Graph", description = "Endpoints for relational threat graph and multi-signal correlations")
public class CorrelationController {

    private final CorrelationService correlationService;

    public CorrelationController(CorrelationService correlationService) {
        this.correlationService = correlationService;
    }

    @GetMapping("/graph")
    @Operation(summary = "Retrieve connected threat intelligence graph nodes and link relations")
    public ResponseEntity<CorrelationGraphResponse> getGlobalGraph() {
        return ResponseEntity.ok(correlationService.buildGlobalGraph());
    }
}
