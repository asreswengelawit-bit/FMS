package com.HumanResourceManagement.Employee.DTO;

import lombok.Data;

import java.time.LocalDate;

import com.HumanResourceManagement.Employee.Model.EmployeeStatus;

@Data
public class EmployeeRequest {
    private String employeeCode;
    private String middleName;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String email;
    private String phoneNumber;
    private LocalDate hireDate;
    private String JobTitle;
    private Double salary;
    private Long DepartmentId;
    private EmployeeStatus status;
    private String gender;
    private String nationalId;
    private String nationality;
    private String maritalStatus;
    private String address;
    private String photoUrl;

}
