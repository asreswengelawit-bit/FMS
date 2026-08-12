package com.company.hrm.attendance.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.company.hrm.attendance.entity.AttendanceStatus;

import lombok.Data;

@Data
public class AttendanceResponse {
    private Long id;
    private String employee;
    private LocalDate date;
    private LocalTime checkInTime;
    private LocalTime checkOutTime;
    private AttendanceStatus status;
    private LocalDateTime createdAt;
}
