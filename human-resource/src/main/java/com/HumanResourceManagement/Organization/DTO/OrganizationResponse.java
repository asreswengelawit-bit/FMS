package com.HumanResourceManagement.Organization.DTO;

import com.HumanResourceManagement.Organization.Model.Organization;
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

    /**
     * Converts Organization Entity -> Response DTO
     */
    public static OrganizationResponse fromEntity(Organization entity) {
        if (entity == null) {
            return null;
        }

        return OrganizationResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .legalName(entity.getLegalName())
                .registrationNumber(entity.getRegistrationNumber())
                .taxId(entity.getTaxId())
                .industry(entity.getIndustry())
                .address(entity.getAddress())
                .phone(entity.getPhone())
                .email(entity.getEmail())
                .website(entity.getWebsite())
                .logoUrl(entity.getLogoUrl())
                .foundedDate(entity.getFoundedDate())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}