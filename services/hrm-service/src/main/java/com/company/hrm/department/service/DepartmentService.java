package com.company.hrm.department.service;

import com.company.hrm.department.dto.DepartmentRequest;
import com.company.hrm.department.dto.DepartmentResponse;

import java.util.List;
import java.util.Optional;

public interface DepartmentService {

    List<DepartmentResponse> fetchAllDepartments();

    Optional<DepartmentResponse> getDepartment(Long id);

    DepartmentResponse createDepartment(DepartmentRequest request);

    DepartmentResponse updateDepartment(Long id, DepartmentRequest request);
}