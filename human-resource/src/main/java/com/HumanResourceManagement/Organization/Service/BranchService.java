package com.HumanResourceManagement.Organization.Service;

import com.HumanResourceManagement.Organization.Model.Branch;
import com.HumanResourceManagement.Organization.Model.Organization;
import com.HumanResourceManagement.Organization.DTO.BranchRequest;
import com.HumanResourceManagement.Organization.DTO.BranchResponse;
import com.HumanResourceManagement.Organization.Repository.BranchRepository;
import com.HumanResourceManagement.Organization.Repository.OrganizationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BranchService {

    private final BranchRepository branchRepository;
    private final OrganizationRepository organizationRepository;

    public BranchResponse createBranch(BranchRequest requestDto) {
        Organization organization = organizationRepository.findById(requestDto.getOrganizationId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Organization not found with ID: " + requestDto.getOrganizationId()));

        Branch branch = requestDto.toEntity(organization);
        Branch savedBranch = branchRepository.save(branch);

        return BranchResponse.fromEntity(savedBranch);
    }

    @Transactional(readOnly = true)
    public BranchResponse getBranchById(Long id) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Branch not found with ID: " + id));
        return BranchResponse.fromEntity(branch);
    }

    @Transactional(readOnly = true)
    public List<BranchResponse> getAllBranches() {
        return branchRepository.findAll().stream()
                .map(BranchResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BranchResponse> getBranchesByOrganization(Long organizationId) {
        return branchRepository.findByOrganizationId(organizationId).stream()
                .map(BranchResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public BranchResponse updateBranch(Long id, BranchRequest requestDto) {
        Branch existingBranch = branchRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Branch not found with ID: " + id));

        Organization organization = organizationRepository.findById(requestDto.getOrganizationId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Organization not found with ID: " + requestDto.getOrganizationId()));

        existingBranch.setOrganization(organization);
        existingBranch.setName(requestDto.getName());
        existingBranch.setCode(requestDto.getCode());
        existingBranch.setAddress(requestDto.getAddress());
        existingBranch.setCity(requestDto.getCity());
        existingBranch.setRegion(requestDto.getRegion());
        existingBranch.setCountry(requestDto.getCountry());
        existingBranch.setPhone(requestDto.getPhone());
        existingBranch.setEmail(requestDto.getEmail());
        // FIX 1: Set headquarters using getter from DTO
        existingBranch.setHeadquarters(Boolean.TRUE.equals(requestDto.getHeadquarters()));

        // FIX 2: Convert String status to Branch.Status Enum
        if (requestDto.getStatus() != null) {
            existingBranch.setStatus(Branch.Status.valueOf(requestDto.getStatus().toUpperCase()));
        }

        Branch updatedBranch = branchRepository.save(existingBranch);
        return BranchResponse.fromEntity(updatedBranch);
    }

    public void deleteBranch(Long id) {
        if (!branchRepository.existsById(id)) {
            throw new EntityNotFoundException("Branch not found with ID: " + id);
        }
        branchRepository.deleteById(id);
    }
}