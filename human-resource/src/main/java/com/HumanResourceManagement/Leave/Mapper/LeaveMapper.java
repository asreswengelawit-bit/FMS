package com.HumanResourceManagement.Leave.Mapper;

import com.HumanResourceManagement.Leave.DTO.LeaveRequest;
// import com.HumanResourceManagement.Leave.DTO.LeaveRequestDto;
import com.HumanResourceManagement.Leave.DTO.LeaveResponse;
// import com.HumanResourceManagement.Leave.DTO.LeaveResponseDto;
import com.HumanResourceManagement.Leave.Model.Leave;
import com.HumanResourceManagement.Employee.Model.Employee;
import org.springframework.stereotype.Component;

import java.time.temporal.ChronoUnit;

@Component
public class LeaveMapper {

    public LeaveResponse toResponseDto(Leave leave) {
        LeaveResponse dto = new LeaveResponse();
        dto.setId(leave.getId());
        dto.setEmployeeId(leave.getEmployee().getId());
        // TODO: confirm Employee's actual name field(s) once shared
        dto.setEmployeeName(leave.getEmployee().getFirstName() + " " + leave.getEmployee().getLastName());
        dto.setLeaveType(leave.getLeaveType());
        dto.setStatus(leave.getStatus());
        dto.setReason(leave.getReason());
        dto.setStartDate(leave.getStartDate());
        dto.setEndDate(leave.getEndDate());
        dto.setNumberOfDays(ChronoUnit.DAYS.between(leave.getStartDate(), leave.getEndDate()) + 1);
        return dto;
    }

    public Leave toEntity(LeaveRequest dto, Employee employee) {
        Leave leave = new Leave();
        leave.setEmployee(employee);
        leave.setLeaveType(dto.getLeaveType());
        leave.setReason(dto.getReason());
        leave.setStartDate(dto.getStartDate());
        leave.setEndDate(dto.getEndDate());
        // status defaults to PENDING via the field initializer on Leave, so we don't
        // set it here
        return leave;
    }
}