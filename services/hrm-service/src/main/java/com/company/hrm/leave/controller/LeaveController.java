package com.company.hrm.leave.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import com.company.hrm.leave.dto.LeaveRequest;
import com.company.hrm.leave.dto.LeaveResponse;
import com.company.hrm.leave.entity.LeaveStatus;
import com.company.hrm.leave.service.LeaveService;
import com.company.hrm.shared.api.ApiResponse;
import com.company.hrm.shared.security.HrmPermissions;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Tag(name = "Leave requests", description = "Leave requests and their approval state")
@RestController
@RequestMapping("/api/v1/leave-requests")
@RequiredArgsConstructor
public class LeaveController {
    final private LeaveService leaveService;

    @PostMapping
    @PreAuthorize(HrmPermissions.LEAVE_CREATE)
    public ResponseEntity<ApiResponse<LeaveResponse>> createLeaveRequest(@Valid @RequestBody LeaveRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(leaveService.createLeaveRequest(request), "Leave request submitted"));
    }

    @GetMapping
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<List<LeaveResponse>>> getAllLeaveRequests(
            @RequestParam(required = false) LeaveStatus status) {
        return ResponseEntity.ok(ApiResponse.ok(leaveService.getAllLeaveRequests(status)));
    }

    @GetMapping("/{id}")
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<LeaveResponse>> getLeaveRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(leaveService.getLeaveById(id)));
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<List<LeaveResponse>>> getLeaveRequestsByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.ok(leaveService.getLeavesByEmployee(employeeId)));
    }
}
