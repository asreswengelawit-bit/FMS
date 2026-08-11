package com.company.hrm.leave.service;

import com.company.hrm.leave.dto.LeaveRequest;
import com.company.hrm.leave.dto.LeaveResponse;
import com.company.hrm.leave.entity.LeaveStatus;

import java.util.List;

public interface LeaveService {

    LeaveResponse createLeaveRequest(LeaveRequest request);

    List<LeaveResponse> getAllLeaveRequests(LeaveStatus status);

    LeaveResponse getLeaveById(Long id);

    List<LeaveResponse> getLeavesByEmployee(Long employeeId);
}