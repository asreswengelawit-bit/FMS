package com.crm.crm_backend.integration.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HrmEmployeeDTO {

    private Long employeeId;
    private String employeeCode;
    private String fullName;
    private String email;
    private String department;
    private boolean active;
}
