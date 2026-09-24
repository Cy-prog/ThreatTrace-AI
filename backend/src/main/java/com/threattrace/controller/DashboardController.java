package com.threattrace.controller;

import com.threattrace.dto.response.DashboardKPIResponse;
import com.threattrace.dto.response.TimelineEventResponse;
import com.threattrace.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@Tag(name = "SOC Dashboard & Analytics", description = "Endpoints for aggregated SOC KPI metrics, timelines, and distributions")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/kpi")
    @Operation(summary = "Retrieve top-level KPI metrics row backed by real database counts")
    public ResponseEntity<DashboardKPIResponse> getKPIs() {
        return ResponseEntity.ok(dashboardService.getDashboardKPIs());
    }

    @GetMapping("/timeline")
    @Operation(summary = "Retrieve real-time-looking Threat Activity Timeline stream")
    public ResponseEntity<List<TimelineEventResponse>> getTimeline(@RequestParam(defaultValue = "25") int limit) {
        return ResponseEntity.ok(dashboardService.getThreatActivityTimeline(limit));
    }
}
