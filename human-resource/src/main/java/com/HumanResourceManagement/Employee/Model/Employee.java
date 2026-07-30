package com.HumanResourceManagement.Employee.Model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.HumanResourceManagement.Organization.Model.Department;

// import com.HumanResourceManagement.application.model.Organization.Department;

// import com.HumanResourceManagement.application.model.Organization.Department;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "employee_table")

public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "employee_code", nullable = false)
    private String employeeCode;
    @Column(name = "first_name", nullable = false)
    private String firstName;
    @Column(name = "middle_name", nullable = true)
    private String middleName;
    @Column(name = "last_name", nullable = false)
    private String lastName;
    @Column(name = "date_of_birth", nullable = true)
    private LocalDate dateOfBirth;
    @Column(name = "gender", nullable = false)
    private String gender;
    @Column(name = "national_id", nullable = true)
    private String nationalId;
    @Column(name = "nationality", nullable = true)
    private String nationality;
    @Column(name = "marital_status", nullable = true)
    private String maritalStatus;
    @Column(name = "email", nullable = true)
    private String email;
    @Column(name = "phone", nullable = true)
    private String phoneNumber;
    @Column(name = "address", nullable = true)
    private String address;
    @Column(name = "photo_url", nullable = true)
    private String photoUrl;
    private String JobTitle;

    // combining department entity to employee
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;
    private Double salary;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmployeeStatus status = EmployeeStatus.ACTIVE;
    @Column(updatable = false)
    private LocalDate hireDate;

    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;

}
