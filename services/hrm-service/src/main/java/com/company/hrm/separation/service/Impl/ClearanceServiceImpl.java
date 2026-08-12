package com.company.hrm.separation.service.Impl;

import com.company.hrm.department.entity.Department;
import com.company.hrm.department.repository.DepartmentRepository;
import com.company.hrm.employee.entity.Employee;
import com.company.hrm.employee.repository.EmployeeRepository;
import com.company.hrm.separation.dto.ClearanceRequest;
import com.company.hrm.separation.dto.ClearanceResponse;
import com.company.hrm.separation.entity.Clearance;
import com.company.hrm.separation.mapper.ClearanceMapper;
import com.company.hrm.separation.repository.ClearanceRepository;
import com.company.hrm.separation.service.ClearanceService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ClearanceServiceImpl implements ClearanceService {

    private final ClearanceRepository clearanceRepository;
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final ClearanceMapper clearanceMapper;

    @Override
    @Transactional(readOnly = true)
    public List<ClearanceResponse> getAllClearances() {
        return clearanceRepository.findAll().stream()
                .map(clearanceMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ClearanceResponse getClearanceById(Long id) {
        return clearanceRepository.findById(id)
                .map(clearanceMapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Clearance record not found with id: " + id)); // Triggers 404
    }

    @Override
    public ClearanceResponse createClearance(ClearanceRequest request) {
        Employee employee = fetchEmployee(request.getEmployeeId());
        Department department = fetchDepartment(request.getDepartmentId());
        Employee clearedBy = request.getClearedById() != null ? fetchEmployee(request.getClearedById()) : null;

        if (clearanceRepository.existsByEmployeeIdAndDepartmentIdAndClearanceType(
                request.getEmployeeId(), request.getDepartmentId(), request.getClearanceType())) {
            throw new IllegalStateException("A clearance record already exists for this employee, department, and clearance type."); // Triggers 409
        }

        Clearance clearance = clearanceMapper.toEntity(request);
        clearance.setEmployee(employee);
        clearance.setDepartment(department);
        clearance.setClearedBy(clearedBy);

        return clearanceMapper.toResponse(clearanceRepository.save(clearance));
    }

    @Override
    public ClearanceResponse updateClearance(Long id, ClearanceRequest request) {
        Clearance existingClearance = clearanceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Clearance record not found with id: " + id)); // Triggers 404

        Employee employee = fetchEmployee(request.getEmployeeId());
        Department department = fetchDepartment(request.getDepartmentId());
        Employee clearedBy = request.getClearedById() != null ? fetchEmployee(request.getClearedById()) : null;

        if (clearanceRepository.existsByEmployeeIdAndDepartmentIdAndClearanceTypeAndIdNot(
                request.getEmployeeId(), request.getDepartmentId(), request.getClearanceType(), id)) {
            throw new IllegalStateException("A clearance record already exists for this employee, department, and clearance type."); // Triggers 409
        }

        clearanceMapper.updateEntityFromDto(request, existingClearance);
        existingClearance.setEmployee(employee);
        existingClearance.setDepartment(department);
        existingClearance.setClearedBy(clearedBy);

        return clearanceMapper.toResponse(clearanceRepository.save(existingClearance));
    }

    @Override
    public void deleteClearance(Long id) {
        if (!clearanceRepository.existsById(id)) {
            throw new EntityNotFoundException("Clearance record not found with id: " + id); // Triggers 404
        }
        clearanceRepository.deleteById(id);
    }

    private Employee fetchEmployee(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with id: " + id)); // Triggers 404
    }

    private Department fetchDepartment(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Department not found with id: " + id)); // Triggers 404
    }
}