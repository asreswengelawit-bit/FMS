package com.crm.crm_backend.controller;

import com.crm.crm_backend.common.ApiResponse;
import com.crm.crm_backend.dto.response.AuditTrailResponseDTO;
import com.crm.crm_backend.model.enums.AuditAction;
import com.crm.crm_backend.model.enums.AuditModule;
import com.crm.crm_backend.service.core.AuditTrailService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/audit-trails")
@RequiredArgsConstructor
public class AuditTrailController {

    private final AuditTrailService auditTrailService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('admin', 'fms_user', 'crm_user')")
    public ResponseEntity<ApiResponse<List<AuditTrailResponseDTO>>> getAllAuditTrails() {
        return ResponseEntity.ok(ApiResponse.success(auditTrailService.getAllAuditTrails()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin', 'fms_user', 'crm_user')")
    public ResponseEntity<ApiResponse<AuditTrailResponseDTO>> getAuditTrailById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(auditTrailService.getAuditTrailById(id)));
    }

    @GetMapping("/module/{module}")
    @PreAuthorize("hasAnyAuthority('admin', 'fms_user', 'crm_user')")
    public ResponseEntity<ApiResponse<List<AuditTrailResponseDTO>>> getByModule(
            @PathVariable AuditModule module) {

        return ResponseEntity.ok(ApiResponse.success(auditTrailService.getByModule(module)));
    }

    @GetMapping("/action/{action}")
    @PreAuthorize("hasAnyAuthority('admin', 'fms_user', 'crm_user')")
    public ResponseEntity<ApiResponse<List<AuditTrailResponseDTO>>> getByAction(
            @PathVariable AuditAction action) {

        return ResponseEntity.ok(ApiResponse.success(auditTrailService.getByAction(action)));
    }

    @GetMapping("/user/{performedBy}")
    @PreAuthorize("hasAnyAuthority('admin', 'fms_user', 'crm_user')")
    public ResponseEntity<ApiResponse<List<AuditTrailResponseDTO>>> getByPerformedBy(
            @PathVariable String performedBy) {

        return ResponseEntity.ok(ApiResponse.success(auditTrailService.getByPerformedBy(performedBy)));
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasAnyAuthority('admin', 'fms_user', 'crm_user')")
    public ResponseEntity<ApiResponse<List<AuditTrailResponseDTO>>> getByDateRange(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime start,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime end) {

        return ResponseEntity.ok(ApiResponse.success(auditTrailService.getByDateRange(start, end)));
    }
}
