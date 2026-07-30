package com.HumanResourceManagement.Training.Model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.HumanResourceManagement.Employee.Model.Employee;

@Data
@Entity
@Table(name = "training_enrollments", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "employee_id", "training_program_id" })
})

public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "training_program_id", nullable = false)
    private TrainingProgram trainingProgram;

    @Column(name = "enrolled_date", nullable = false)
    private LocalDate enrolledDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(name = "completion_date")
    private LocalDate completionDate;

    @Column(precision = 5, scale = 2)
    private BigDecimal score;

    public enum Status {
        ENROLLED, COMPLETED, DROPPED
    }
}