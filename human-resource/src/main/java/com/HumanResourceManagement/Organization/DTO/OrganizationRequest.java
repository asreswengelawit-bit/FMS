package com.HumanResourceManagement.Organization.DTO;

import com.HumanResourceManagement.Organization.Model.Organization;
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

    /**
     * Converts incoming request DTO -> Organization Entity
     */
    public Organization toEntity() {
        return Organization.builder()
                .name(this.name)
                .legalName(this.legalName)
                .registrationNumber(this.registrationNumber)
                .taxId(this.taxId)
                .industry(this.industry)
                .address(this.address)
                .phone(this.phone)
                .email(this.email)
                .website(this.website)
                .logoUrl(this.logoUrl)
                .foundedDate(this.foundedDate)
                .build();
    }
}