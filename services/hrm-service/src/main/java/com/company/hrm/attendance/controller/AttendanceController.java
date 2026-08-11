package com.company.hrm.attendance.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company.hrm.attendance.dto.AttendanceRequest;
import com.company.hrm.attendance.dto.AttendanceResponse;
// import com.company.hrm.attendance.service.AttendanceService;
import com.company.hrm.attendance.service.Impl.AttendanceServiceImpl;
import com.company.hrm.shared.api.ApiResponse;
import com.company.hrm.shared.security.HrmPermissions;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Attendance", description = "Daily attendance records")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/attendance")
public class AttendanceController {
    private final AttendanceServiceImpl attendanceService;

    @GetMapping
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> getAllAttendance() {
        return ResponseEntity.ok(ApiResponse.ok(attendanceService.getAllAttendance()));
    }

    @GetMapping("/{id}")
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<AttendanceResponse>> getAttendanceById(@PathVariable Long id) {
        AttendanceResponse attendance = attendanceService.getAttendanceById(id)
                .orElseThrow(() -> new EntityNotFoundException("Attendance record not found with id: " + id));
        return ResponseEntity.ok(ApiResponse.ok(attendance));
    }

    @PostMapping
    @PreAuthorize(HrmPermissions.ATTENDANCE_CREATE)
    public ResponseEntity<ApiResponse<AttendanceResponse>> newAttendance(
            @Valid @RequestBody AttendanceRequest request) {
        AttendanceResponse created = attendanceService.addNewAttendance(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(created, "Attendance recorded"));
    }
}
