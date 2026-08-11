package com.company.hrm.organization.dto;

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

}
