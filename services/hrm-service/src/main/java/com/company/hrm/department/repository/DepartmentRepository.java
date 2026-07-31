package com.company.hrm.department.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.company.hrm.department.entity.Department;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

    boolean existsByName(String name);
}
