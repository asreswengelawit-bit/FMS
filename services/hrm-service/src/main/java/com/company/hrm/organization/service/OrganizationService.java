package com.company.hrm.organization.service;

import com.company.hrm.organization.entity.Organization;
import com.company.hrm.organization.dto.OrganizationRequest;
import com.company.hrm.organization.dto.OrganizationResponse;
import com.company.hrm.organization.repository.OrganizationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrganizationService {

    private final OrganizationRepository organizationRepository;

    public OrganizationResponse createOrganization(OrganizationRequest requestDto) {
        Organization organization = requestDto.toEntity();
        Organization savedOrganization = organizationRepository.save(organization);
        return OrganizationResponse.fromEntity(savedOrganization);
    }

    @Transactional(readOnly = true)
    public OrganizationResponse getOrganizationById(Long id) {
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Organization not found with ID: " + id));
        return OrganizationResponse.fromEntity(organization);
    }

    @Transactional(readOnly = true)
    public List<OrganizationResponse> getAllOrganizations() {
        return organizationRepository.findAll().stream()
                .map(OrganizationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public OrganizationResponse updateOrganization(Long id, OrganizationRequest requestDto) {
        Organization existingOrganization = organizationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Organization not found with ID: " + id));

        existingOrganization.setName(requestDto.getName());
        existingOrganization.setLegalName(requestDto.getLegalName());
        existingOrganization.setRegistrationNumber(requestDto.getRegistrationNumber());
        existingOrganization.setTaxId(requestDto.getTaxId());
        existingOrganization.setIndustry(requestDto.getIndustry());
        existingOrganization.setAddress(requestDto.getAddress());
        existingOrganization.setPhone(requestDto.getPhone());
        existingOrganization.setEmail(requestDto.getEmail());
        existingOrganization.setWebsite(requestDto.getWebsite());
        existingOrganization.setLogoUrl(requestDto.getLogoUrl());
        existingOrganization.setFoundedDate(requestDto.getFoundedDate());

        Organization updatedOrganization = organizationRepository.save(existingOrganization);
        return OrganizationResponse.fromEntity(updatedOrganization);
    }

    public void deleteOrganization(Long id) {
        if (!organizationRepository.existsById(id)) {
            throw new EntityNotFoundException("Organization not found with ID: " + id);
        }
        organizationRepository.deleteById(id);
    }
}
