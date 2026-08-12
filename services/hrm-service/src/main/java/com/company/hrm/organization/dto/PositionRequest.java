package com.company.hrm.organization.dto;

import com.company.hrm.organization.entity.Position.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PositionRequest {

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    private Long jobGradeId;

    @NotBlank(message = "Position title is required")
    private String title;

    @NotBlank(message = "Position code is required")
    private String code;

    private String description;
    private BigDecimal minSalary;
    private BigDecimal maxSalary;

    @NotNull(message = "Status is required")
    private Status status = Status.ACTIVE;

}
