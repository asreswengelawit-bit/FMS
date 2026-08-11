package com.company.hrm.organization.service;

import com.company.hrm.organization.dto.OrganizationRequest;
import com.company.hrm.organization.dto.OrganizationResponse;

import java.util.List;

public interface OrganizationService {

    OrganizationResponse createOrganization(OrganizationRequest requestDto);

    OrganizationResponse getOrganizationById(Long id);

    List<OrganizationResponse> getAllOrganizations();

    OrganizationResponse updateOrganization(Long id, OrganizationRequest requestDto);

    void deleteOrganization(Long id);
}