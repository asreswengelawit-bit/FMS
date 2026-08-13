package com.company.hrm.employee.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.company.hrm.employee.entity.EmployeeStatus;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

@Data
public class EmployeeRequest {

    @NotBlank(message = "Employee code is required")
    private String employeeCode;

    private String middleName;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    private LocalDate dateOfBirth;

    @Email(message = "Invalid email format")
    private String email;

    private String phoneNumber;
    private LocalDate hireDate;
    private String jobTitle;

    @PositiveOrZero(message = "Salary must be non-negative")
    private BigDecimal salary;

    private Long departmentId;
    private EmployeeStatus status;

    @NotBlank(message = "Gender is required")
    private String gender;

    private String nationalId;
    private String nationality;
    private String maritalStatus;
    private String address;
    private String photoUrl;
}
