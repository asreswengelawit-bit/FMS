package com.company.hrm.employee.service;

import com.company.hrm.employee.dto.EmployeeRequest;
import com.company.hrm.employee.dto.EmployeeResponse;

import java.util.List;
import java.util.Optional;

public interface EmployeeService {

    List<EmployeeResponse> fetchAllEmployees();

    Optional<EmployeeResponse> getEmployeeById(Long id);

    EmployeeResponse createEmployee(EmployeeRequest request);

    EmployeeResponse updateEmployee(Long id, EmployeeRequest request);

    void deleteEmployee(Long id);
}