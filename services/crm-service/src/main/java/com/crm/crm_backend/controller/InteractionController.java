package com.crm.crm_backend.controller;

import com.crm.crm_backend.common.ApiResponse;
import com.crm.crm_backend.dto.request.InteractionCreateDTO;
import com.crm.crm_backend.dto.request.InteractionUpdateDTO;
import com.crm.crm_backend.dto.response.InteractionResponseDTO;
import com.crm.crm_backend.service.core.InteractionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interactions")
@RequiredArgsConstructor
public class InteractionController {

    private final InteractionService interactionService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<InteractionResponseDTO>> createInteraction(
            @Valid @RequestBody InteractionCreateDTO dto) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Interaction created", interactionService.createInteraction(dto)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<InteractionResponseDTO>> getInteraction(
            @PathVariable Long id) {

        return ResponseEntity.ok(ApiResponse.success(interactionService.getInteraction(id)));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<Page<InteractionResponseDTO>>> getAllInteractions(
            Pageable pageable) {

        return ResponseEntity.ok(ApiResponse.success(interactionService.getAllInteractions(pageable)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<InteractionResponseDTO>> updateInteraction(
            @PathVariable Long id,
            @Valid @RequestBody InteractionUpdateDTO dto) {

        return ResponseEntity.ok(ApiResponse.success(interactionService.updateInteraction(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<ApiResponse<Void>> deleteInteraction(
            @PathVariable Long id) {

        interactionService.deleteInteraction(id);
        return ResponseEntity.ok(ApiResponse.success("Interaction deleted", null));
    }
}
