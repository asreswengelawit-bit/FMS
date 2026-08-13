package com.company.hrm.separation.controller;

import com.company.hrm.separation.dto.ClearanceRequest;
import com.company.hrm.separation.dto.ClearanceResponse;
import com.company.hrm.separation.service.ClearanceService;
import com.company.hrm.separation.service.Impl.ClearanceServiceImpl;
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

@Tag(name = "Clearance", description = "Employee separation clearance management")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/clearances")
public class ClearanceController {

    private final ClearanceServiceImpl clearanceService;

    @GetMapping
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<List<ClearanceResponse>>> getAllClearances() {
        return ResponseEntity.ok(ApiResponse.ok(clearanceService.getAllClearances()));
    }

    @GetMapping("/{id}")
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<ClearanceResponse>> getClearanceById(@PathVariable Long id) {
        // Exception caught & converted to 404 by GlobalExceptionHandler
        return ResponseEntity.ok(ApiResponse.ok(clearanceService.getClearanceById(id)));
    }

    @PostMapping
    @PreAuthorize(HrmPermissions.CLEARANCE_CREATE)
    public ResponseEntity<ApiResponse<ClearanceResponse>> createClearance(@Valid @RequestBody ClearanceRequest request) {
        // Validation errors (@Valid) caught & converted to 400 with field map by GlobalExceptionHandler
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(clearanceService.createClearance(request), "Clearance record created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize(HrmPermissions.CLEARANCE_UPDATE)
    public ResponseEntity<ApiResponse<ClearanceResponse>> updateClearance(
            @PathVariable Long id,
            @Valid @RequestBody ClearanceRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(clearanceService.updateClearance(id, request), "Clearance record updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(HrmPermissions.CLEARANCE_DELETE)
    public ResponseEntity<ApiResponse<Void>> deleteClearance(@PathVariable Long id) {
        clearanceService.deleteClearance(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Clearance record deleted successfully"));
    }
}