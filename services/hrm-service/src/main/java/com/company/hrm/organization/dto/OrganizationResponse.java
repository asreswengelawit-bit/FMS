package com.company.hrm.organization.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class OrganizationResponse {

    private Long id;
    private String name;
    private String legalName;
    private String registrationNumber;
    private String taxId;
    private String industry;
    private String address;
    private String phone;
    private String email;
    private String website;
    private String logoUrl;
    private LocalDate foundedDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
