package com.company.hrm.organization.service.Impl;

import com.company.hrm.organization.dto.BranchRequest;
import com.company.hrm.organization.dto.BranchResponse;
import com.company.hrm.organization.entity.Branch;
import com.company.hrm.organization.entity.Organization;
import com.company.hrm.organization.mapper.OrganizationMapper;
import com.company.hrm.organization.repository.BranchRepository;
import com.company.hrm.organization.repository.OrganizationRepository;
import com.company.hrm.organization.service.BranchService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BranchServiceImpl implements BranchService {

    private final BranchRepository branchRepository;
    private final OrganizationRepository organizationRepository;
    private final OrganizationMapper organizationMapper;

    @Override
    public BranchResponse createBranch(BranchRequest requestDto) {
        Organization organization = organizationRepository.findById(requestDto.getOrganizationId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Organization not found with ID: " + requestDto.getOrganizationId()));

        Branch branch = organizationMapper.toEntity(requestDto);
        branch.setOrganization(organization);
        Branch savedBranch = branchRepository.save(branch);

        return organizationMapper.toResponse(savedBranch);
    }

    @Override
    @Transactional(readOnly = true)
    public BranchResponse getBranchById(Long id) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Branch not found with ID: " + id));
        return organizationMapper.toResponse(branch);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BranchResponse> getAllBranches() {
        return branchRepository.findAll().stream()
                .map(organizationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BranchResponse> getBranchesByOrganization(Long organizationId) {
        return branchRepository.findByOrganizationId(organizationId).stream()
                .map(organizationMapper::toResponse)
                .toList();
    }

    @Override
    public BranchResponse updateBranch(Long id, BranchRequest requestDto) {
        Branch existingBranch = branchRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Branch not found with ID: " + id));

        Organization organization = organizationRepository.findById(requestDto.getOrganizationId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Organization not found with ID: " + requestDto.getOrganizationId()));

        organizationMapper.updateBranch(requestDto, existingBranch);
        existingBranch.setOrganization(organization);

        Branch updatedBranch = branchRepository.save(existingBranch);
        return organizationMapper.toResponse(updatedBranch);
    }

    @Override
    public void deleteBranch(Long id) {
        if (!branchRepository.existsById(id)) {
            throw new EntityNotFoundException("Branch not found with ID: " + id);
        }
        branchRepository.deleteById(id);
    }
}