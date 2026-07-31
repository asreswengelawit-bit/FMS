package com.company.hrm.department.service;

import com.company.hrm.department.dto.DepartmentRequest;
import com.company.hrm.department.dto.DepartmentResponse;
import com.company.hrm.department.entity.Department;
import com.company.hrm.department.repository.DepartmentRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DepartmentService {
    private final DepartmentRepository departmentRepository;

    @Transactional(readOnly = true)
    public List<DepartmentResponse> fetchAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(DepartmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<DepartmentResponse> getDepartment(Long id) {
        return departmentRepository.findById(id)
                .map(DepartmentResponse::fromEntity);
    }

    public DepartmentResponse createDepartment(DepartmentRequest request) {
        if (departmentRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("Department already exists with name: " + request.getName());
        }
        Department department = new Department();
        department.setName(request.getName());
        department.setDescription(request.getDescription());
        // TODO(hrm): resolve managerName -> Employee and set department.manager
        return DepartmentResponse.fromEntity(departmentRepository.save(department));
    }

    public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {
        Department existing = departmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Department not found with id: " + id));
        existing.setName(request.getName());
        existing.setDescription(request.getDescription());

        return DepartmentResponse.fromEntity(departmentRepository.save(existing));
    }
}
