package com.company.hrm.organization.service;

import com.company.hrm.organization.entity.Organization;
import com.company.hrm.organization.dto.OrganizationRequest;
import com.company.hrm.organization.dto.OrganizationResponse;
import com.company.hrm.organization.mapper.OrganizationMapper;
import com.company.hrm.organization.repository.OrganizationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final OrganizationMapper organizationMapper;

    public OrganizationResponse createOrganization(OrganizationRequest requestDto) {
        Organization organization = organizationMapper.toEntity(requestDto);
        Organization savedOrganization = organizationRepository.save(organization);
        return organizationMapper.toResponse(savedOrganization);
    }

    @Transactional(readOnly = true)
    public OrganizationResponse getOrganizationById(Long id) {
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Organization not found with ID: " + id));
        return organizationMapper.toResponse(organization);
    }

    @Transactional(readOnly = true)
    public List<OrganizationResponse> getAllOrganizations() {
        return organizationRepository.findAll().stream()
                .map(organizationMapper::toResponse)
                .toList();
    }

    public OrganizationResponse updateOrganization(Long id, OrganizationRequest requestDto) {
        Organization existingOrganization = organizationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Organization not found with ID: " + id));

        organizationMapper.updateOrganization(requestDto, existingOrganization);

        Organization updatedOrganization = organizationRepository.save(existingOrganization);
        return organizationMapper.toResponse(updatedOrganization);
    }

    public void deleteOrganization(Long id) {
        if (!organizationRepository.existsById(id)) {
            throw new EntityNotFoundException("Organization not found with ID: " + id);
        }
        organizationRepository.deleteById(id);
    }
}
