package com.company.hrm.leave.dto;

import lombok.Data;

import java.time.LocalDate;

import com.company.hrm.leave.entity.Leave;
import com.company.hrm.leave.entity.LeaveStatus;
import com.company.hrm.leave.entity.LeaveType;

@Data
public class LeaveResponse {
    private Long id;
    private LeaveType leaveType;
    private Long employeeId;
    private String employeeName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    private LeaveStatus status;
    private Long numberOfDays;

    public static LeaveResponse fromEntity(Leave leave) {
        LeaveResponse response = new LeaveResponse();
        response.setId(leave.getId());
        response.setLeaveType(leave.getLeaveType());
        response.setStatus(leave.getStatus());
        response.setStartDate(leave.getStartDate());
        response.setEndDate(leave.getEndDate());
        if (leave.getEmployee() != null) {
            response.setEmployeeName(leave.getEmployee().getFirstName() + " " + leave.getEmployee().getLastName());
            response.setEmployeeId(leave.getEmployee().getId());
        }
        return response;
    }
}
