package com.HumanResourceManagement.Organization.DTO;

import lombok.*;

import com.HumanResourceManagement.Organization.Model.Branch;
import com.HumanResourceManagement.Organization.Model.Organization;

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

    public Branch toEntity(Organization organization) {
        Branch branch = new Branch();
        branch.setOrganization(organization);
        branch.setName(this.name);
        branch.setCode(this.code);
        branch.setAddress(this.address);
        branch.setCity(this.city);
        branch.setRegion(this.region);
        branch.setCountry(this.country);
        branch.setPhone(this.phone);
        branch.setEmail(this.email);
        branch.setHeadquarters(Boolean.TRUE.equals(this.headquarters));

        // status Enum mapping (null-safe)
        if (this.status != null) {
            branch.setStatus(Branch.Status.valueOf(this.status.toUpperCase()));
        } else {
            branch.setStatus(Branch.Status.ACTIVE);
        }
        return branch;
    }
}
