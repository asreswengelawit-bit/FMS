package com.HumanResourceManagement.Organization.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.HumanResourceManagement.Organization.Model.Department;

// import com.HumanResourceManagement.application.model.Organization.Department;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

    boolean existsByName(String name);
}
