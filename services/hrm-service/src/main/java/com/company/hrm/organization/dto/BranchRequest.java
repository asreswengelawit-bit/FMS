package com.company.hrm.organization.dto;

import lombok.*;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BranchRequest {

    @NotNull(message = "organizationId is required")
    private Long organizationId;
    @NotBlank(message = "name is required")
    private String name;
    private String code;
    private String address;
    private String city;
    private String region;
    private String country;
    private String phone;
    private String email;
    @NotNull(message = "headquarters is required")
    private Boolean headquarters;
    @NotBlank(message = "status is required")
    private String status;

}
