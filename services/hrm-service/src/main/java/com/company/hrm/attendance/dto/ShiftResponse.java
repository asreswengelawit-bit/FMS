package com.company.hrm.attendance.dto;

import com.company.hrm.attendance.entity.Shift;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShiftResponse {

    private Long id;
    private String name;
    private LocalTime startTime;
    private LocalTime endTime;
    private int breakDuration;
    private int gracePeriodMinutes;
    private Shift.Status status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}