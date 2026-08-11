package com.company.hrm.department.controller;

import com.company.hrm.department.dto.DepartmentRequest;
import com.company.hrm.department.dto.DepartmentResponse;
// import com.company.hrm.department.service.DepartmentService;
import com.company.hrm.department.service.Impl.DepartmentServiceImpl;
import com.company.hrm.shared.api.ApiResponse;
import com.company.hrm.shared.security.HrmPermissions;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Departments", description = "Departments — the reference sub-domain of the repo")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/departments")
public class DepartmentController {
  private final DepartmentServiceImpl departmentService;

  @GetMapping
  @PreAuthorize(HrmPermissions.READ)
  public ResponseEntity<ApiResponse<List<DepartmentResponse>>> getAllDepartments() {
    return ResponseEntity.ok(ApiResponse.ok(departmentService.fetchAllDepartments()));
  }

  @GetMapping("/{id}")
  @PreAuthorize(HrmPermissions.READ)
  public ResponseEntity<ApiResponse<DepartmentResponse>> getDepartmentById(@PathVariable Long id) {
    DepartmentResponse department = departmentService.getDepartment(id)
        .orElseThrow(() -> new EntityNotFoundException("Department not found with id: " + id));
    return ResponseEntity.ok(ApiResponse.ok(department));
  }

  @PostMapping
  @PreAuthorize(HrmPermissions.DEPARTMENT_CREATE)
  public ResponseEntity<ApiResponse<DepartmentResponse>> createDepartment(
      @Valid @RequestBody DepartmentRequest request) {
    DepartmentResponse created = departmentService.createDepartment(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(created, "Department created"));
  }

  @PutMapping("/{id}")
  @PreAuthorize(HrmPermissions.DEPARTMENT_UPDATE)
  public ResponseEntity<ApiResponse<DepartmentResponse>> updateDepartment(@PathVariable Long id,
      @Valid @RequestBody DepartmentRequest request) {
    return ResponseEntity.ok(ApiResponse.ok(departmentService.updateDepartment(id, request), "Department updated"));
  }
}
