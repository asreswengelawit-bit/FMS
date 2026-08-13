package com.company.hrm.recruitment.dto;

import com.company.hrm.employee.entity.Employee;
import com.company.hrm.department.entity.Department;
import com.company.hrm.organization.entity.Position;
import com.company.hrm.recruitment.entity.JobPosting;
import com.company.hrm.recruitment.entity.JobPosting.EmploymentType;
import com.company.hrm.recruitment.entity.JobPosting.Status;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class JobPostingRequest {

    @NotNull(message = "Position ID is required")
    private Long positionId;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    @Size(max = 2000, message = "Requirements cannot exceed 2000 characters")
    private String requirements;

    @NotNull(message = "Employment type is required")
    private EmploymentType employmentType;

    @Min(value = 1, message = "Number of openings must be at least 1")
    private int numberOfOpenings = 1;

    private LocalDate postedDate = LocalDate.now();

    @NotNull(message = "Closing date is required")
    private LocalDate closingDate;

    @NotNull(message = "Status is required")
    private Status status = Status.DRAFT;

    @NotNull(message = "Created by (Employee ID) is required")
    private Long createdById;

    /**
     * Converts incoming request DTO + Relationships -> JobPosting Entity
     */
    public JobPosting toEntity(Position position, Department department, Employee createdBy) {
        JobPosting jobPosting = new JobPosting();
        jobPosting.setPosition(position);
        jobPosting.setDepartment(department);
        jobPosting.setTitle(this.title);
        jobPosting.setDescription(this.description);
        jobPosting.setRequirements(this.requirements);
        jobPosting.setEmploymentType(this.employmentType);
        jobPosting.setNumberOfOpenings(this.numberOfOpenings);
        jobPosting.setPostedDate(this.postedDate != null ? this.postedDate : LocalDate.now());
        jobPosting.setClosingDate(this.closingDate);
        jobPosting.setStatus(this.status);
        jobPosting.setCreatedByEmployee(createdBy);
        return jobPosting;
    }
}
