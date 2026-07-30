package com.HumanResourceManagement.Organization.DTO;

import com.HumanResourceManagement.Organization.Model.Position;
import com.HumanResourceManagement.Organization.Model.Position.Status;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PositionResponse {

    private Long id;
    private Long departmentId;
    private String departmentName;
    private Long jobGradeId;
    private String jobGradeName;
    private String title;
    private String code;
    private String description;
    private BigDecimal minSalary;
    private BigDecimal maxSalary;
    private Status status;

    /**
     * Converts Position Entity -> Response DTO
     */
    public static PositionResponse fromEntity(Position entity) {
        if (entity == null) {
            return null;
        }

        return PositionResponse.builder()
                .id(entity.getId())
                .departmentId(entity.getDepartment() != null ? entity.getDepartment().getId() : null)
                .departmentName(entity.getDepartment() != null ? entity.getDepartment().getName() : null)
                .jobGradeId(entity.getJobGrade() != null ? entity.getJobGrade().getId() : null)
                .jobGradeName(entity.getJobGrade() != null ? entity.getJobGrade().getName() : null)
                .title(entity.getTitle())
                .code(entity.getCode())
                .description(entity.getDescription())
                .minSalary(entity.getMinSalary())
                .maxSalary(entity.getMaxSalary())
                .status(entity.getStatus())
                .build();
    }
}