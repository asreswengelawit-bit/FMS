package com.company.hrm.organization.dto;

import com.company.hrm.organization.entity.Position.Status;
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

}
