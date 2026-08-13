package com.company.hrm.organization.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class OrganizationRequest {

    @NotBlank(message = "Organization name is required")
    private String name;

    private String legalName;
    private String registrationNumber;
    private String taxId;
    private String industry;
    private String address;
    private String phone;

    @Email(message = "Invalid email format")
    private String email;

    private String website;
    private String logoUrl;
    private LocalDate foundedDate;

}
