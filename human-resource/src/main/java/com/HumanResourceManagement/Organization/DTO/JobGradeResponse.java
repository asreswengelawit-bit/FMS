package com.HumanResourceManagement.Organization.DTO;

import com.HumanResourceManagement.Organization.Model.JobGrade;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class JobGradeResponse {

    private Long id;
    private String name;
    private int level;
    private String description;
    private BigDecimal minSalary;
    private BigDecimal maxSalary;

    /**
     * Converts JobGrade Entity -> Response DTO
     */
    public static JobGradeResponse fromEntity(JobGrade entity) {
        if (entity == null) {
            return null;
        }

        return JobGradeResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .level(entity.getLevel())
                .description(entity.getDescription())
                .minSalary(entity.getMinSalary())
                .maxSalary(entity.getMaxSalary())
                .build();
    }
}