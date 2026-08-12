package com.crm.crm_backend.controller;

import com.crm.crm_backend.common.ApiResponse;
import com.crm.crm_backend.dto.request.CampaignCreateDTO;
import com.crm.crm_backend.dto.request.CampaignUpdateDTO;
import com.crm.crm_backend.dto.response.CampaignMetricsResponseDTO;
import com.crm.crm_backend.dto.response.CampaignMetricsSnapshotDTO;
import com.crm.crm_backend.dto.response.CampaignResponseDTO;
import com.crm.crm_backend.service.core.CampaignService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/campaigns")
@RequiredArgsConstructor
public class CampaignController {

    private final CampaignService campaignService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<CampaignResponseDTO>> createCampaign(
            @Valid @RequestBody CampaignCreateDTO dto) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Campaign created", campaignService.createCampaign(dto)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<CampaignResponseDTO>> getCampaign(
            @PathVariable Long id) {

        return ResponseEntity.ok(ApiResponse.success(campaignService.getCampaign(id)));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<Page<CampaignResponseDTO>>> getAllCampaigns(
            Pageable pageable) {

        return ResponseEntity.ok(ApiResponse.success(campaignService.getAllCampaigns(pageable)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<CampaignResponseDTO>> updateCampaign(
            @PathVariable Long id,
            @Valid @RequestBody CampaignUpdateDTO dto) {

        return ResponseEntity.ok(ApiResponse.success(campaignService.updateCampaign(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<ApiResponse<Void>> deleteCampaign(
            @PathVariable Long id) {

        campaignService.deleteCampaign(id);
        return ResponseEntity.ok(ApiResponse.success("Campaign deleted", null));
    }

    @PatchMapping("/{id}/activate")
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<CampaignResponseDTO>> activateCampaign(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
                "Campaign activated",
                campaignService.activateCampaign(id)));
    }

    @PatchMapping("/{id}/complete")
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<CampaignResponseDTO>> completeCampaign(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
                "Campaign completed",
                campaignService.completeCampaign(id)));
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<CampaignResponseDTO>> cancelCampaign(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
                "Campaign cancelled",
                campaignService.cancelCampaign(id)));
    }

    @GetMapping("/{id}/metrics")
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<CampaignMetricsResponseDTO>> getCampaignMetrics(
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(campaignService.getCampaignMetrics(id)));
    }

    @PostMapping("/{id}/metrics/snapshot")
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<CampaignMetricsSnapshotDTO>> snapshotCampaignMetrics(
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
                "Campaign metrics snapshot saved",
                campaignService.snapshotMetrics(id, "Manual snapshot")));
    }
}
