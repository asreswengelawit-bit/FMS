package com.HumanResourceManagement.Employee.Service;

import com.HumanResourceManagement.Employee.DTO.EmployeeRequest;
import com.HumanResourceManagement.Employee.DTO.EmployeeResponse;
import com.HumanResourceManagement.Employee.Model.Employee;
import com.HumanResourceManagement.Employee.Model.EmployeeStatus;
import com.HumanResourceManagement.Employee.Repository.EmployeeRepository;
import com.HumanResourceManagement.Organization.Model.Department;
import com.HumanResourceManagement.Organization.Repository.DepartmentRepository;
// import com.HumanResourceManagement.application.model.Organization.Department;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

// import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
// import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    public List<EmployeeResponse> fetchAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(EmployeeResponse::fromEmployee)
                .collect(Collectors.toList());
    }

    public Optional<EmployeeResponse> getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .map(EmployeeResponse::fromEmployee);
    }

    public EmployeeResponse createEmployee(EmployeeRequest request) {
        // Check if employee already exists with email
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Employee already exists with this email: " + request.getEmail());
        }

        Employee employee = new Employee();

        // CRITICAL FIX: Add this line to transfer the code from the request to the
        // database entity
        employee.setEmployeeCode(request.getEmployeeCode());

        // Set all remaining mandatory properties
        employee.setFirstName(request.getFirstName());
        employee.setMiddleName(request.getMiddleName());
        employee.setLastName(request.getLastName());
        employee.setGender(request.getGender());
        employee.setDateOfBirth(request.getDateOfBirth());
        employee.setNationalId(request.getNationalId());
        employee.setNationality(request.getNationality());
        employee.setMaritalStatus(request.getMaritalStatus());
        employee.setEmail(request.getEmail());
        employee.setPhoneNumber(request.getPhoneNumber());
        employee.setAddress(request.getAddress());
        employee.setPhotoUrl(request.getPhotoUrl());
        employee.setJobTitle(request.getJobTitle());
        employee.setSalary(request.getSalary());
        employee.setHireDate(request.getHireDate());

        // Set default status if missing
        employee.setStatus(request.getStatus() != null ? request.getStatus() : EmployeeStatus.ACTIVE);

        // Set Department relationship
        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Department not found with id: " + request.getDepartmentId()));
            employee.setDepartment(department);
        }

        // Line 57: Save operation will no longer throw an exception
        Employee savedEmployee = employeeRepository.save(employee);
        return EmployeeResponse.fromEmployee(savedEmployee);
    }

    public EmployeeResponse UpdateEmployee(Long id, EmployeeRequest request) {
        Employee existing = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not Found with id: " + id));
        existing.setFirstName(request.getFirstName());
        existing.setLastName(request.getLastName());
        existing.setPhoneNumber(request.getPhoneNumber());
        existing.setJobTitle(request.getJobTitle());
        existing.setSalary(request.getSalary());
        existing.setHireDate(request.getHireDate());
        existing.setStatus(request.getStatus());
        if (!existing.getEmail().equals(request.getEmail())) {
            if (employeeRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("employee already exists with this email :" + request.getEmail());
            }
            existing.setEmail(request.getEmail());
        }
        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "department is not found with id: " + request.getDepartmentId()));
            existing.setDepartment(department);
        }
        return EmployeeResponse.fromEmployee(employeeRepository.save(existing));

    }

    public void deleteEmployee(Long id) {
        Employee result = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("there is no employee with id: " + id));
        employeeRepository.delete(result);

    }

}
