package com.HumanResourceManagement.Training.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "training_sessions")

public class TrainingSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "training_program_id", nullable = false)
    private TrainingProgram trainingProgram;

    @Column(name = "session_date", nullable = false)
    private LocalDateTime sessionDate;

    private String location;
    private String trainer;
    private int capacity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    public enum Status {
        SCHEDULED, COMPLETED, CANCELLED
    }
}