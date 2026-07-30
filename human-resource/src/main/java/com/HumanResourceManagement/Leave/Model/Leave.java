package com.HumanResourceManagement.Leave.Model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

import com.HumanResourceManagement.Employee.Model.Employee;

@Data
@Entity
public class Leave {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private LeaveType leaveType;
    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;
    private String reason;
    @Enumerated(EnumType.STRING)
    private LeaveStatus status = LeaveStatus.PENDING;
    @Column(nullable = false)
    private LocalDate startDate;
    @Column(nullable = false)
    private LocalDate endDate;
}
