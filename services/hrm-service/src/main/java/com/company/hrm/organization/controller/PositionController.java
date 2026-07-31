package com.company.hrm.organization.controller;

import com.company.hrm.organization.dto.PositionRequest;
import com.company.hrm.organization.dto.PositionResponse;
import com.company.hrm.organization.service.PositionService;
import com.company.hrm.shared.api.ApiResponse;
import com.company.hrm.shared.security.HrmPermissions;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Positions", description = "Job positions and titles per department")
@RestController
@RequestMapping("/api/v1/positions")
@RequiredArgsConstructor
public class PositionController {

    private final PositionService positionService;

    @PostMapping
    @PreAuthorize(HrmPermissions.POSITION_CREATE)
    public ResponseEntity<ApiResponse<PositionResponse>> createPosition(
            @Valid @RequestBody PositionRequest requestDto) {
        PositionResponse createdPosition = positionService.createPosition(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(createdPosition, "Position created"));
    }

    @GetMapping("/{id}")
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<PositionResponse>> getPositionById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(positionService.getPositionById(id)));
    }

    @GetMapping
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<List<PositionResponse>>> getAllPositions() {
        return ResponseEntity.ok(ApiResponse.ok(positionService.getAllPositions()));
    }

    @GetMapping("/department/{departmentId}")
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<List<PositionResponse>>> getPositionsByDepartment(
            @PathVariable Long departmentId) {
        return ResponseEntity.ok(ApiResponse.ok(positionService.getPositionsByDepartment(departmentId)));
    }

    @PutMapping("/{id}")
    @PreAuthorize(HrmPermissions.POSITION_UPDATE)
    public ResponseEntity<ApiResponse<PositionResponse>> updatePosition(
            @PathVariable Long id,
            @Valid @RequestBody PositionRequest requestDto) {
        return ResponseEntity.ok(ApiResponse.ok(positionService.updatePosition(id, requestDto), "Position updated"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(HrmPermissions.POSITION_DELETE)
    public ResponseEntity<ApiResponse<Void>> deletePosition(@PathVariable Long id) {
        positionService.deletePosition(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Position deleted"));
    }
}
