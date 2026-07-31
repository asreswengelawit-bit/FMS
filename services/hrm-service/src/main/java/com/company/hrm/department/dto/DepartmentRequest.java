package com.company.hrm.department.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DepartmentRequest {

    @NotBlank(message = "Department name is required")
    private String name;

    private String description;

    /** Not wired up yet — the manager link is set through the employee record. */
    private String managerName;
}
