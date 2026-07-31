package com.company.hrm.recruitment.entity;

import com.company.hrm.shared.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import com.company.hrm.employee.entity.Employee;

@Getter
@Setter

@Entity
@Table(name = "interview")
@NoArgsConstructor
@AllArgsConstructor
public class Interview extends Auditable {

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
