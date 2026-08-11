package com.crm.crm_backend.controller;

import com.crm.crm_backend.common.ApiResponse;
import com.crm.crm_backend.dto.request.OpportunityCreateDTO;
import com.crm.crm_backend.dto.request.OpportunityUpdateDTO;
import com.crm.crm_backend.dto.response.OpportunityResponseDTO;
import com.crm.crm_backend.model.enums.OpportunityStage;
import com.crm.crm_backend.service.core.OpportunityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/opportunities")
@RequiredArgsConstructor
public class OpportunityController {

    private final OpportunityService opportunityService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<OpportunityResponseDTO>> createOpportunity(
            @Valid @RequestBody OpportunityCreateDTO dto) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Opportunity created", opportunityService.createOpportunity(dto)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<OpportunityResponseDTO>> getOpportunityById(
            @PathVariable Long id) {

        return ResponseEntity.ok(ApiResponse.success(opportunityService.getOpportunityById(id)));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<Page<OpportunityResponseDTO>>> getAllOpportunities(
            Pageable pageable) {

        return ResponseEntity.ok(ApiResponse.success(opportunityService.getAllOpportunities(pageable)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<OpportunityResponseDTO>> updateOpportunity(
            @PathVariable Long id,
            @Valid @RequestBody OpportunityUpdateDTO dto) {

        return ResponseEntity.ok(ApiResponse.success(opportunityService.updateOpportunity(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<ApiResponse<Void>> deleteOpportunity(
            @PathVariable Long id) {

        opportunityService.deleteOpportunity(id);
        return ResponseEntity.ok(ApiResponse.success("Opportunity deleted", null));
    }

    @PatchMapping("/{id}/stage")
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<OpportunityResponseDTO>> updateStage(
            @PathVariable Long id,
            @RequestParam OpportunityStage stage) {

        return ResponseEntity.ok(ApiResponse.success(
                "Opportunity stage updated",
                opportunityService.updateStage(id, stage)));
    }
}
