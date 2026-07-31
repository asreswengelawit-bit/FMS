package com.company.hrm.employee.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.company.hrm.employee.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    boolean existsByEmail(String email);

    boolean existsByEmployeeCode(String employeeCode);
}
