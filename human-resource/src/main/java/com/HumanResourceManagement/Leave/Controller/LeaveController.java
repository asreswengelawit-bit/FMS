package com.HumanResourceManagement.Leave.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import com.HumanResourceManagement.Leave.DTO.LeaveRequest;
import com.HumanResourceManagement.Leave.DTO.LeaveResponse;
import com.HumanResourceManagement.Leave.Model.LeaveStatus;
import com.HumanResourceManagement.Leave.Services.LeaveService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/leave-requests")
@RequiredArgsConstructor
public class LeaveController {
    final private LeaveService leaveService;

    @PostMapping
    public ResponseEntity<LeaveResponse> createLeaveRequest(@Valid @RequestBody LeaveRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(leaveService.createLeaveRequest(request));
    }

    @GetMapping
    public ResponseEntity<List<LeaveResponse>> getAllLeaveRequests(
            @RequestParam(required = false) LeaveStatus status) {
        return ResponseEntity.ok(leaveService.getAllLeaveRequests(status));
    }
}
