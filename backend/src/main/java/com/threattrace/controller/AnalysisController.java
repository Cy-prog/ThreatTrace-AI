package com.threattrace.controller;

import com.threattrace.dto.response.ThreatAnalysisDTO;
import com.threattrace.dto.response.ThreatDetailResponse;
import com.threattrace.service.ThreatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analyses")
@Tag(name = "AI Threat Analyses", description = "Endpoints for retrieving granular NLP threat analysis objects")
public class AnalysisController {

    private final ThreatService threatService;

    public AnalysisController(ThreatService threatService) {
        this.threatService = threatService;
    }

    @GetMapping("/threat/{threatId}")
    @Operation(summary = "Retrieve specific threat analysis breakdown, entities, and indicators")
    public ResponseEntity<ThreatAnalysisDTO> getAnalysisByThreatId(@PathVariable String threatId) {
        ThreatDetailResponse detail = threatService.getThreatById(threatId);
        return ResponseEntity.ok(detail.getAnalysis());
    }
}
