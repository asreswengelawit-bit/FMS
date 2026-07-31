package com.company.hrm.organization.dto;

import com.company.hrm.department.entity.Department;
import com.company.hrm.organization.entity.JobGrade;
import com.company.hrm.organization.entity.Position;
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

    /**
     * Converts incoming request DTO + Relationships -> Position Entity
     */
    public Position toEntity(Department department, JobGrade jobGrade) {
        Position position = new Position();
        position.setDepartment(department);
        position.setJobGrade(jobGrade);
        position.setTitle(this.title);
        position.setCode(this.code);
        position.setDescription(this.description);
        position.setMinSalary(this.minSalary);
        position.setMaxSalary(this.maxSalary);
        position.setStatus(this.status);
        return position;
    }
}
