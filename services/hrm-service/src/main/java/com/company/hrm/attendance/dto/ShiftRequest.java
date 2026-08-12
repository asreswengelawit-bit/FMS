package com.company.hrm.attendance.dto;

import com.company.hrm.attendance.entity.Shift;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShiftRequest {

    @NotBlank(message = "Shift name is required")
    private String name;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @Min(value = 0, message = "Break duration cannot be negative")
    private int breakDuration;

    @Min(value = 0, message = "Grace period cannot be negative")
    private int gracePeriodMinutes;

    @NotNull(message = "Shift status is required")
    private Shift.Status status;
}