package com.company.hrm.employee.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import com.company.hrm.department.entity.Department;
import com.company.hrm.shared.audit.Auditable;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "employee")
public class Employee extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "employee_code", nullable = false, unique = true)
    private String employeeCode;
    @Column(name = "first_name", nullable = false)
    private String firstName;
    @Column(name = "middle_name")
    private String middleName;
    @Column(name = "last_name", nullable = false)
    private String lastName;
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
    @Column(name = "gender", nullable = false)
    private String gender;
    @Column(name = "national_id")
    private String nationalId;
    @Column(name = "nationality")
    private String nationality;
    @Column(name = "marital_status")
    private String maritalStatus;
    @Column(name = "email", unique = true)
    private String email;
    @Column(name = "phone")
    private String phoneNumber;
    @Column(name = "address")
    private String address;
    @Column(name = "photo_url")
    private String photoUrl;
    @Column(name = "job_title")
    private String jobTitle;

    // combining department entity to employee
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;
    @Column(name = "salary", precision = 19, scale = 4)
    private BigDecimal salary;
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private EmployeeStatus status = EmployeeStatus.ACTIVE;
    @Column(name = "hire_date", updatable = false)
    private LocalDate hireDate;
}
