package com.HumanResourceManagement.Recruitment.Model;

// package com.HumanResourceManagement.Recruitment.entity;

// import com.HumanResourceManagement.shared.audit.Auditable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "job_applications")
@NoArgsConstructor
@AllArgsConstructor
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_posting_id", nullable = false)
    private JobPosting jobPosting;

    @Column(name = "applied_date", nullable = false)
    private LocalDate appliedDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(name = "cover_letter", length = 3000)
    private String coverLetter;

    @Column(name = "resume_url")
    private String resumeUrl;

    private String notes;

    public enum Status {
        APPLIED, SHORTLISTED, INTERVIEW, OFFERED, REJECTED, HIRED
    }
}