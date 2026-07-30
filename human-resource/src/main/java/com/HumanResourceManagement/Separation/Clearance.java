package com.HumanResourceManagement.Separation;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

import com.HumanResourceManagement.Employee.Model.Employee;
import com.HumanResourceManagement.Organization.Model.Department;

@Data
@Entity
@Table(name = "clearances", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "employee_id", "department_id", "clearance_type" })
})

public class Clearance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Enumerated(EnumType.STRING)
    @Column(name = "clearance_type", nullable = false)
    private ClearanceType clearanceType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cleared_by_id")
    private Employee clearedBy;

    @Column(name = "cleared_date")
    private LocalDate clearedDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    private String remarks;

    public enum ClearanceType {
        IT, FINANCE, ADMIN, FACILITIES
    }

    public enum Status {
        PENDING, CLEARED
    }
}