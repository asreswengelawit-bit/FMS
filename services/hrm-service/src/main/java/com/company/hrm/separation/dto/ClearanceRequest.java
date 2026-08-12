package com.company.hrm.separation.dto;

import com.company.hrm.separation.entity.Clearance;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClearanceRequest {

    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @NotNull(message = "Clearance type is required")
    private Clearance.ClearanceType clearanceType;

    private Long clearedById;

    private LocalDate clearedDate;

    @NotNull(message = "Clearance status is required")
    private Clearance.Status status;

    private String remarks;
}