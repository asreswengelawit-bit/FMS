package com.HumanResourceManagement.Organization.Service;

import com.HumanResourceManagement.Organization.DTO.DepartmentRequest;
import com.HumanResourceManagement.Organization.DTO.DepartmentResponse;
import com.HumanResourceManagement.Organization.Model.Department;
import com.HumanResourceManagement.Organization.Repository.DepartmentRepository;
// import com.HumanResourceManagement.application.model.Organization.Department;

import lombok.RequiredArgsConstructor;
// import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentService {
    private final DepartmentRepository departmentRepository;

    public List<DepartmentResponse> fetchAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(DepartmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public Optional<DepartmentResponse> getDepartment(Long id) {
        return departmentRepository.findById(id)
                .map(DepartmentResponse::fromEntity);

    }

    public DepartmentResponse createDepartment(DepartmentRequest request) {
        if (departmentRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("department already exists with name : " + request.getName());
        }
        Department department = new Department();
        department.setName(request.getName());
        department.setDescription(request.getDescription());
        // i will continue this
        // if(request.getManagerName()!=null){
        // Employee manager=
        // }
        return DepartmentResponse.fromEntity(departmentRepository.save(department));

    }

    public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {
        Department existing = departmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("department does not exist with id: " + id));
        existing.setName(request.getName());
        existing.setDescription(request.getDescription());

        return DepartmentResponse.fromEntity(departmentRepository.save(existing));

    }
}
