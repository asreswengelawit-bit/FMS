package com.company.hrm.organization.mapper;

import com.company.hrm.organization.dto.BranchRequest;
import com.company.hrm.organization.dto.BranchResponse;
import com.company.hrm.organization.dto.JobGradeRequest;
import com.company.hrm.organization.dto.JobGradeResponse;
import com.company.hrm.organization.dto.OrganizationRequest;
import com.company.hrm.organization.dto.OrganizationResponse;
import com.company.hrm.organization.dto.PositionRequest;
import com.company.hrm.organization.dto.PositionResponse;
import com.company.hrm.organization.entity.Branch;
import com.company.hrm.organization.entity.JobGrade;
import com.company.hrm.organization.entity.Organization;
import com.company.hrm.organization.entity.Position;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.Locale;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface OrganizationMapper {

    Organization toEntity(OrganizationRequest request);

    OrganizationResponse toResponse(Organization organization);

    void updateOrganization(OrganizationRequest request, @MappingTarget Organization organization);

    @Mapping(target = "organization", ignore = true)
    Branch toEntity(BranchRequest request);

    @Mapping(target = "organizationId", source = "organization.id")
    @Mapping(target = "organizationName", source = "organization.name")
    BranchResponse toResponse(Branch branch);

    @Mapping(target = "organization", ignore = true)
    @Mapping(target = "status", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateBranch(BranchRequest request, @MappingTarget Branch branch);

    JobGrade toEntity(JobGradeRequest request);

    JobGradeResponse toResponse(JobGrade jobGrade);

    void updateJobGrade(JobGradeRequest request, @MappingTarget JobGrade jobGrade);

    @Mapping(target = "department", ignore = true)
    @Mapping(target = "jobGrade", ignore = true)
    Position toEntity(PositionRequest request);

    @Mapping(target = "departmentId", source = "department.id")
    @Mapping(target = "departmentName", source = "department.name")
    @Mapping(target = "jobGradeId", source = "jobGrade.id")
    @Mapping(target = "jobGradeName", source = "jobGrade.name")
    PositionResponse toResponse(Position position);

    @Mapping(target = "department", ignore = true)
    @Mapping(target = "jobGrade", ignore = true)
    void updatePosition(PositionRequest request, @MappingTarget Position position);

    default Branch.Status mapBranchStatus(String status) {
        return status == null ? null : Branch.Status.valueOf(status.toUpperCase(Locale.ROOT));
    }

    @AfterMapping
    default void applyDefaultBranchStatus(@MappingTarget Branch branch) {
        if (branch.getStatus() == null) {
            branch.setStatus(Branch.Status.ACTIVE);
        }
    }
}
