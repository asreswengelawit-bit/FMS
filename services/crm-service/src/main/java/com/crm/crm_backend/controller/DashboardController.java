package com.crm.crm_backend.controller;

import com.crm.crm_backend.common.ApiResponse;
import com.crm.crm_backend.dto.response.DashboardKpiResponseDTO;
import com.crm.crm_backend.service.analytics.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user', 'fms_user')")
    public ResponseEntity<ApiResponse<DashboardKpiResponseDTO>> getDashboard() {

        return ResponseEntity.ok(ApiResponse.success(dashboardService.getDashboardKpis()));
    }
}
