package com.HumanResourceManagement.Recruitment.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import com.HumanResourceManagement.Employee.Model.Employee;

@Getter
@Setter

@Entity
@Table(name = "interviews")
@NoArgsConstructor
@AllArgsConstructor
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_application_id", nullable = false)
    private JobApplication jobApplication;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interviewer_id", nullable = false)
    private Employee interviewer;

    @Column(name = "scheduled_date", nullable = false)
    private LocalDateTime scheduledDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Mode mode;

    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    private String feedback;
    private int rating;

    public enum Mode {
        ONSITE, VIRTUAL, PHONE
    }

    public enum Status {
        SCHEDULED, COMPLETED, CANCELLED
    }
}
