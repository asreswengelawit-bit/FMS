package com.company.hrm.employee.controller;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.company.hrm.employee.dto.EmployeeRequest;
import com.company.hrm.employee.dto.EmployeeResponse;
import com.company.hrm.employee.service.EmployeeService;
import com.company.hrm.shared.api.ApiResponse;
import com.company.hrm.shared.security.HrmPermissions;

import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/employees")
@Tag(name = "Employees", description = "Employee master data")
public class EmployeeController {
    private final EmployeeService employeeService;

    // to get all the employees
    @GetMapping
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<List<EmployeeResponse>>> getAllEmployees() {
        return ResponseEntity.ok(ApiResponse.ok(employeeService.fetchAllEmployees()));
    }

    // to get a single employee using id
    @GetMapping("/{id}")
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<EmployeeResponse>> getEmployeeById(@PathVariable Long id) {
        EmployeeResponse employee = employeeService.getEmployeeById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with id: " + id));
        return ResponseEntity.ok(ApiResponse.ok(employee));
    }

    // to create new employee
    @PostMapping
    @PreAuthorize(HrmPermissions.EMPLOYEE_CREATE)
    public ResponseEntity<ApiResponse<EmployeeResponse>> addEmployee(@Valid @RequestBody EmployeeRequest request) {
        EmployeeResponse created = employeeService.createEmployee(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(created, "Employee created"));
    }

    @PutMapping("/{id}")
    @PreAuthorize(HrmPermissions.EMPLOYEE_UPDATE)
    public ResponseEntity<ApiResponse<EmployeeResponse>> updateEmployee(@PathVariable Long id,
            @Valid @RequestBody EmployeeRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(employeeService.updateEmployee(id, request), "Employee updated"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(HrmPermissions.EMPLOYEE_DELETE)
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Employee deleted"));
    }
}
