package com.company.hrm.organization.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class JobGradeRequest {

    @NotBlank(message = "Job grade name is required")
    private String name;

    @NotNull(message = "Level is required")
    @Min(value = 1, message = "Level must be at least 1")
    private Integer level;

    private String description;

    private BigDecimal minSalary;

    private BigDecimal maxSalary;

}
