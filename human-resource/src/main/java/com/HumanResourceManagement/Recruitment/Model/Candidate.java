package com.HumanResourceManagement.Recruitment.Model;

// import com.HumanResourceManagement.shared.audit.Auditable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "candidates")
@NoArgsConstructor
@AllArgsConstructor
public class Candidate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;

    @Column(name = "resume_url")
    private String resumeUrl;

    @Column(name = "cover_letter_url")
    private String coverLetterUrl;

    @Column(name = "linkedin_url")
    private String linkedInUrl;

    @Enumerated(EnumType.STRING)
    private Source source;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    public enum Source {
        REFERRAL, JOB_BOARD, WEBSITE, AGENCY
    }

    public enum Status {
        NEW, IN_PROCESS, HIRED, REJECTED
    }
}
