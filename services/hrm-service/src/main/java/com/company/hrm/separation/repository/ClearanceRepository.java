package com.company.hrm.separation.repository;

import com.company.hrm.separation.entity.Clearance;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface ClearanceRepository extends JpaRepository<Clearance, Long> {

    List<Clearance> findByEmployeeId(Long employeeId);

    boolean existsByEmployeeIdAndDepartmentIdAndClearanceType(
            Long employeeId, Long departmentId, Clearance.ClearanceType clearanceType);

    boolean existsByEmployeeIdAndDepartmentIdAndClearanceTypeAndIdNot(
            Long employeeId, Long departmentId, Clearance.ClearanceType clearanceType, Long id);
}