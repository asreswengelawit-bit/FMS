package com.company.mms.requisition;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.company.mms.requisition.dto.CreateRequisitionRequest;
import com.company.mms.requisition.dto.RequisitionResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/requisitions")
public class RequisitionController {

    private static final String READ_ROLES =
            "hasAnyRole('admin', 'mms_user', 'inventory_manager', 'store_keeper', 'viewer')";
    private static final String WRITE_ROLES =
            "hasAnyRole('admin', 'inventory_manager', 'store_keeper', 'mms_user')";

    private final RequisitionService service;

    public RequisitionController(RequisitionService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize(READ_ROLES)
    public List<RequisitionResponse> findAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String department) {
        return service.findAll(status, department);
    }

    @GetMapping("/{id}")
    @PreAuthorize(READ_ROLES)
    public RequisitionResponse findById(@PathVariable String id) {
        return service.findById(id);
    }

    @PostMapping
    @PreAuthorize(WRITE_ROLES)
    public ResponseEntity<RequisitionResponse> create(@Valid @RequestBody CreateRequisitionRequest request) {
        RequisitionResponse created = service.create(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.id())
                .toUri();
        return ResponseEntity.created(location).body(created);
    }

    @PostMapping("/{id}/issue")
    @PreAuthorize("hasAnyRole('admin', 'inventory_manager', 'store_keeper')")
    public RequisitionResponse issue(
            @PathVariable String id,
            @AuthenticationPrincipal Jwt jwt) {
        return service.issue(id, actor(jwt));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('admin', 'inventory_manager')")
    public RequisitionResponse reject(@PathVariable String id) {
        return service.reject(id);
    }

    private String actor(Jwt jwt) {
        if (jwt == null) return "system";
        String username = jwt.getClaimAsString("preferred_username");
        return username == null || username.isBlank() ? jwt.getSubject() : username;
    }
}
