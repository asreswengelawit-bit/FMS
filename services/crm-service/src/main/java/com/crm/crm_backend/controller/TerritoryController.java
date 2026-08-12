package com.crm.crm_backend.controller;

import com.crm.crm_backend.common.ApiResponse;
import com.crm.crm_backend.dto.request.TerritoryRequestDTO;
import com.crm.crm_backend.dto.response.TerritoryResponseDTO;
import com.crm.crm_backend.service.core.TerritoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/territories")
@RequiredArgsConstructor
public class TerritoryController {

    private final TerritoryService territoryService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<TerritoryResponseDTO>> createTerritory(
            @Valid @RequestBody TerritoryRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Territory created", territoryService.createTerritory(dto)));
    }

    @GetMapping("/active")
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<List<TerritoryResponseDTO>>> getActiveTerritories() {
        return ResponseEntity.ok(ApiResponse.success(territoryService.getActiveTerritories()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<TerritoryResponseDTO>> getTerritory(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(territoryService.getTerritory(id)));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<Page<TerritoryResponseDTO>>> getAllTerritories(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(territoryService.getAllTerritories(pageable)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<TerritoryResponseDTO>> updateTerritory(
            @PathVariable Long id,
            @Valid @RequestBody TerritoryRequestDTO dto) {
        return ResponseEntity.ok(ApiResponse.success(
                "Territory updated",
                territoryService.updateTerritory(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<ApiResponse<Void>> deleteTerritory(@PathVariable Long id) {
        territoryService.deleteTerritory(id);
        return ResponseEntity.ok(ApiResponse.success("Territory deleted", null));
    }
}
