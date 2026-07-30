package com.HumanResourceManagement.Organization.DTO;

import com.HumanResourceManagement.Organization.Model.Branch;
import com.HumanResourceManagement.Organization.Model.Branch.Status;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BranchResponse {

    private Long id;
    private Long organizationId;
    private String organizationName;
    private String name;
    private String code;
    private String address;
    private String city;
    private String region;
    private String country;
    private String phone;
    private String email;
    private boolean isHeadquarters;
    private Status status;

    public static BranchResponse fromEntity(Branch entity) {
        if (entity == null) {
            return null;
        }

        return BranchResponse.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganization() != null ? entity.getOrganization().getId() : null)
                .organizationName(entity.getOrganization() != null ? entity.getOrganization().getName() : null)
                .name(entity.getName())
                .code(entity.getCode())
                .address(entity.getAddress())
                .city(entity.getCity())
                .region(entity.getRegion())
                .country(entity.getCountry())
                .phone(entity.getPhone())
                .email(entity.getEmail())
                .isHeadquarters(entity.isHeadquarters())
                .status(entity.getStatus())
                .build();
    }
}