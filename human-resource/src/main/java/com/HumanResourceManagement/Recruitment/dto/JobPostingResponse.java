package com.HumanResourceManagement.Recruitment.dto;

import com.HumanResourceManagement.Recruitment.Model.JobPosting;
import com.HumanResourceManagement.Recruitment.Model.JobPosting.EmploymentType;
import com.HumanResourceManagement.Recruitment.Model.JobPosting.Status;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class JobPostingResponse {

    private Long id;
    private Long positionId;
    private String positionTitle;
    private Long departmentId;
    private String departmentName;
    private String title;
    private String description;
    private String requirements;
    private EmploymentType employmentType;
    private int numberOfOpenings;
    private LocalDate postedDate;
    private LocalDate closingDate;
    private Status status;
    private Long createdById;
    private String createdByName;

    /**
     * Converts JobPosting Entity -> Response DTO
     */
    public static JobPostingResponse fromEntity(JobPosting entity) {
        if (entity == null) {
            return null;
        }

        String positionTitle = entity.getPosition() != null ? entity.getPosition().getTitle() : null;
        String departmentName = entity.getDepartment() != null ? entity.getDepartment().getName() : null;

        String createdByName = null;
        if (entity.getCreatedBy() != null) {
            createdByName = entity.getCreatedBy().getFirstName() + " " + entity.getCreatedBy().getLastName();
        }

        return JobPostingResponse.builder()
                .id(entity.getId())
                .positionId(entity.getPosition() != null ? entity.getPosition().getId() : null)
                .positionTitle(positionTitle)
                .departmentId(entity.getDepartment() != null ? entity.getDepartment().getId() : null)
                .departmentName(departmentName)
                .title(entity.getTitle())
                .description(entity.getDescription())
                .requirements(entity.getRequirements())
                .employmentType(entity.getEmploymentType())
                .numberOfOpenings(entity.getNumberOfOpenings())
                .postedDate(entity.getPostedDate())
                .closingDate(entity.getClosingDate())
                .status(entity.getStatus())
                .createdById(entity.getCreatedBy() != null ? entity.getCreatedBy().getId() : null)
                .createdByName(createdByName)
                .build();
    }
}