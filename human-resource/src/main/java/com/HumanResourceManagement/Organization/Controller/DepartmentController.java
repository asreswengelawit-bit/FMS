package com.HumanResourceManagement.Organization.Controller;

import com.HumanResourceManagement.Organization.DTO.DepartmentRequest;
import com.HumanResourceManagement.Organization.DTO.DepartmentResponse;
import com.HumanResourceManagement.Organization.Service.DepartmentService;

//import com.HumanResourceManagement.application.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/departments")
public class DepartmentController {
  private final DepartmentService departmentService;

  @GetMapping
  public ResponseEntity<List<DepartmentResponse>> getAllDepartments() {
    return ResponseEntity.ok(departmentService.fetchAllDepartments());
  }

  @GetMapping("/{id}")
  public ResponseEntity<DepartmentResponse> getDepartmentById(@PathVariable Long id) {
    Optional<DepartmentResponse> department = departmentService.getDepartment(id);
    boolean found = department.isPresent();
    if (found) {
      return ResponseEntity.ok(department.get());
    }
    return ResponseEntity.notFound().build();
  }

  @PostMapping
  public ResponseEntity<DepartmentResponse> createDepartment(@RequestBody DepartmentRequest request) {
    DepartmentResponse created = departmentService.createDepartment(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

  @PutMapping("/{id}")
  public ResponseEntity<DepartmentResponse> updateDepartment(@PathVariable Long id,
      @RequestBody DepartmentRequest request) {
    return ResponseEntity.ok(departmentService.updateDepartment(id, request));
  }
}
