package com.HumanResourceManagement.Employee.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.HumanResourceManagement.Employee.Model.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    boolean existsByEmail(String email);
}
