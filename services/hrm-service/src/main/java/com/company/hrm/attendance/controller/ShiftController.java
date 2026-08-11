package com.company.hrm.attendance.controller;

import com.company.hrm.attendance.dto.ShiftRequest;
import com.company.hrm.attendance.dto.ShiftResponse;
import com.company.hrm.attendance.service.ShiftService;
import com.company.hrm.shared.api.ApiResponse;
import com.company.hrm.shared.security.HrmPermissions;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Shift", description = "Work shift schedule management")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/shifts")
public class ShiftController {

    private final ShiftService shiftService;

    @GetMapping
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<List<ShiftResponse>>> getAllShifts() {
        return ResponseEntity.ok(ApiResponse.ok(shiftService.getAllShifts()));
    }

    @GetMapping("/{id}")
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<ShiftResponse>> getShiftById(@PathVariable Long id) {
        ShiftResponse shift = shiftService.getShiftById(id)
                .orElseThrow(() -> new EntityNotFoundException("Shift record not found with id: " + id));
        return ResponseEntity.ok(ApiResponse.ok(shift));
    }

    @PostMapping
    @PreAuthorize(HrmPermissions.SHIFT_CREATE)
    public ResponseEntity<ApiResponse<ShiftResponse>> createShift(@Valid @RequestBody ShiftRequest request) {
        ShiftResponse created = shiftService.createShift(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(created, "Shift created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize(HrmPermissions.SHIFT_UPDATE)
    public ResponseEntity<ApiResponse<ShiftResponse>> updateShift(
            @PathVariable Long id,
            @Valid @RequestBody ShiftRequest request) {
        ShiftResponse updated = shiftService.updateShift(id, request);
        return ResponseEntity.ok(ApiResponse.ok(updated, "Shift updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(HrmPermissions.SHIFT_DELETE)
    public ResponseEntity<ApiResponse<Void>> deleteShift(@PathVariable Long id) {
        shiftService.deleteShift(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Shift deleted successfully"));
    }
}