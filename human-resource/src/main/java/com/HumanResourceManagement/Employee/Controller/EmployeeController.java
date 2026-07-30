package com.HumanResourceManagement.Employee.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.HumanResourceManagement.Employee.DTO.EmployeeRequest;
import com.HumanResourceManagement.Employee.DTO.EmployeeResponse;
import com.HumanResourceManagement.Employee.Service.EmployeeService;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/employees")
public class EmployeeController {
    private final EmployeeService employeeService;

    // to get all the employees
    @GetMapping
    public ResponseEntity<List<EmployeeResponse>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.fetchAllEmployees());
    }

    // to get a single employee using id
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> getEmployeeById(@PathVariable Long id) {
        Optional<EmployeeResponse> result = employeeService.getEmployeeById(id);
        boolean found = result.isPresent();
        if (found) {

            return ResponseEntity.ok(result.get());
        }
        return ResponseEntity.notFound().build();
    }

    // to create new employee
    @PostMapping
    public ResponseEntity<EmployeeResponse> addEmployee(@RequestBody EmployeeRequest request) {
        EmployeeResponse created = employeeService.createEmployee(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);

    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeResponse> updateEmployee(@PathVariable Long id,
            @RequestBody EmployeeRequest request) {
        return ResponseEntity.ok(employeeService.UpdateEmployee(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();

    }
}