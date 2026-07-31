package com.company.hrm.organization.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.company.hrm.organization.dto.BranchRequest;
import com.company.hrm.organization.dto.BranchResponse;
import com.company.hrm.organization.service.BranchService;

import org.springframework.security.access.prepost.PreAuthorize;
import com.company.hrm.shared.api.ApiResponse;
import com.company.hrm.shared.security.HrmPermissions;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;

@Tag(name = "Branches", description = "Office / site locations of an organization")
@RestController
@RequestMapping("/api/v1/branches")
@RequiredArgsConstructor
public class BranchController {

    private final BranchService branchService;

    @PostMapping
    @PreAuthorize(HrmPermissions.BRANCH_CREATE)
    public ResponseEntity<ApiResponse<BranchResponse>> create(@Valid @RequestBody BranchRequest dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(branchService.createBranch(dto), "Branch created"));
    }

    @GetMapping("/{id}")
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<BranchResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(branchService.getBranchById(id)));
    }

    @GetMapping
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<List<BranchResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(branchService.getAllBranches()));
    }

    @PutMapping("/{id}")
    @PreAuthorize(HrmPermissions.BRANCH_UPDATE)
    public ResponseEntity<ApiResponse<BranchResponse>> update(@PathVariable Long id, @Valid @RequestBody BranchRequest dto) {
        return ResponseEntity.ok(ApiResponse.ok(branchService.updateBranch(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(HrmPermissions.BRANCH_DELETE)
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        branchService.deleteBranch(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Branch deleted"));
    }
}
