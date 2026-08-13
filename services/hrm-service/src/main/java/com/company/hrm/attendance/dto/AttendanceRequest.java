package com.company.hrm.attendance.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.company.hrm.attendance.entity.AttendanceStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AttendanceRequest {
    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    private LocalTime checkInTime;
    private LocalTime checkOutTime;

    @NotNull(message = "Attendance status is required")
    private AttendanceStatus status;
}
