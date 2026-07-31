package com.company.hrm.organization.controller;

import com.company.hrm.organization.dto.OrganizationRequest;
import com.company.hrm.organization.dto.OrganizationResponse;
import com.company.hrm.organization.service.OrganizationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.access.prepost.PreAuthorize;
import com.company.hrm.shared.api.ApiResponse;
import com.company.hrm.shared.security.HrmPermissions;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;

@Tag(name = "Organizations", description = "Legal entities that own the branches")
@RestController
@RequestMapping("/api/v1/organizations")
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationService organizationService;

    @PostMapping
    @PreAuthorize(HrmPermissions.ORGANIZATION_CREATE)
    public ResponseEntity<ApiResponse<OrganizationResponse>> createOrganization(@Valid @RequestBody OrganizationRequest requestDto) {
        OrganizationResponse createdOrganization = organizationService.createOrganization(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(createdOrganization, "Organization created"));
    }

    @GetMapping("/{id}")
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<OrganizationResponse>> getOrganizationById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(organizationService.getOrganizationById(id)));
    }

    @GetMapping
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<List<OrganizationResponse>>> getAllOrganizations() {
        return ResponseEntity.ok(ApiResponse.ok(organizationService.getAllOrganizations()));
    }

    @PutMapping("/{id}")
    @PreAuthorize(HrmPermissions.ORGANIZATION_UPDATE)
    public ResponseEntity<ApiResponse<OrganizationResponse>> updateOrganization(
            @PathVariable Long id,
            @Valid @RequestBody OrganizationRequest requestDto) {
        return ResponseEntity.ok(ApiResponse.ok(organizationService.updateOrganization(id, requestDto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(HrmPermissions.ORGANIZATION_DELETE)
    public ResponseEntity<ApiResponse<Void>> deleteOrganization(@PathVariable Long id) {
        organizationService.deleteOrganization(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Organization deleted"));
    }
}
