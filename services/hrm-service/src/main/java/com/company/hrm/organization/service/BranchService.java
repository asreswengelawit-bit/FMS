package com.company.hrm.organization.service;

import com.company.hrm.organization.dto.BranchRequest;
import com.company.hrm.organization.dto.BranchResponse;

import java.util.List;

public interface BranchService {

    BranchResponse createBranch(BranchRequest requestDto);

    BranchResponse getBranchById(Long id);

    List<BranchResponse> getAllBranches();

    List<BranchResponse> getBranchesByOrganization(Long organizationId);

    BranchResponse updateBranch(Long id, BranchRequest requestDto);

    void deleteBranch(Long id);
}