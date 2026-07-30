package com.HumanResourceManagement.Attendance.DTO;

import java.time.LocalDate;
// import java.time.LocalDateTime;
import java.time.LocalTime;

import com.HumanResourceManagement.Attendance.Model.AttendanceStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

// import com.HumanResourceManagement.application.model.Employee;
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
