package com.company.hrm.separation.dto;

import com.company.hrm.separation.entity.Clearance;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClearanceResponse {

    private Long id;
    private Long employeeId;
    private String employeeName;
    private Long departmentId;
    private String departmentName;
    private Clearance.ClearanceType clearanceType;
    private Long clearedById;
    private String clearedByName;
    private LocalDate clearedDate;
    private Clearance.Status status;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}