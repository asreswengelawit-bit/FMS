package com.company.hrm.employee.service.Impl;

import com.company.hrm.employee.dto.EmployeeRequest;
import com.company.hrm.employee.dto.EmployeeResponse;
import com.company.hrm.employee.entity.Employee;
import com.company.hrm.employee.entity.EmployeeStatus;
import com.company.hrm.employee.repository.EmployeeRepository;
import com.company.hrm.employee.service.EmployeeService;
import com.company.hrm.department.entity.Department;
import com.company.hrm.department.repository.DepartmentRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponse> fetchAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(EmployeeResponse::fromEmployee)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EmployeeResponse> getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .map(EmployeeResponse::fromEmployee);
    }

    @Override
    public EmployeeResponse createEmployee(EmployeeRequest request) {
        if (employeeRepository.existsByEmployeeCode(request.getEmployeeCode())) {
            throw new IllegalArgumentException(
                    "Employee already exists with this code: " + request.getEmployeeCode());
        }
        if (request.getEmail() != null && employeeRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Employee already exists with this email: " + request.getEmail());
        }

        Employee employee = new Employee();
        employee.setEmployeeCode(request.getEmployeeCode());
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

        employee.setStatus(request.getStatus() != null ? request.getStatus() : EmployeeStatus.ACTIVE);

        if (request.getDepartmentId() != null) {
            employee.setDepartment(findDepartment(request.getDepartmentId()));
        }

        Employee savedEmployee = employeeRepository.save(employee);
        return EmployeeResponse.fromEmployee(savedEmployee);
    }

    @Override
    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {
        Employee existing = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with id: " + id));
        
        existing.setFirstName(request.getFirstName());
        existing.setLastName(request.getLastName());
        existing.setPhoneNumber(request.getPhoneNumber());
        existing.setJobTitle(request.getJobTitle());
        existing.setSalary(request.getSalary());
        existing.setHireDate(request.getHireDate());
        
        if (request.getStatus() != null) {
            existing.setStatus(request.getStatus());
        }
        
        if (!Objects.equals(existing.getEmail(), request.getEmail())) {
            if (request.getEmail() != null && employeeRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Employee already exists with this email: " + request.getEmail());
            }
            existing.setEmail(request.getEmail());
        }
        
        if (request.getDepartmentId() != null) {
            existing.setDepartment(findDepartment(request.getDepartmentId()));
        }
        
        return EmployeeResponse.fromEmployee(employeeRepository.save(existing));
    }

    @Override
    public void deleteEmployee(Long id) {
        Employee result = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with id: " + id));
        employeeRepository.delete(result);
    }

    private Department findDepartment(Long departmentId) {
        return departmentRepository.findById(departmentId)
                .orElseThrow(() -> new EntityNotFoundException("Department not found with id: " + departmentId));
    }
}