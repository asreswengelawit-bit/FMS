package com.HumanResourceManagement.Recruitment.dto;

import com.HumanResourceManagement.Recruitment.Model.Candidate;
import com.HumanResourceManagement.Recruitment.Model.JobApplication;
import com.HumanResourceManagement.Recruitment.Model.JobApplication.Status;
import com.HumanResourceManagement.Recruitment.Model.JobPosting;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class JobApplicationRequest {

    @NotNull(message = "Candidate ID is required")
    private Long candidateId;

    @NotNull(message = "Job Posting ID is required")
    private Long jobPostingId;

    private LocalDate appliedDate = LocalDate.now();

    @NotNull(message = "Status is required")
    private Status status = Status.APPLIED;

    @Size(max = 3000, message = "Cover letter cannot exceed 3000 characters")
    private String coverLetter;

    private String resumeUrl;
    private String notes;

    /**
     * Converts incoming request DTO + Relationships -> JobApplication Entity
     */
    public JobApplication toEntity(Candidate candidate, JobPosting jobPosting) {
        JobApplication jobApplication = new JobApplication();
        jobApplication.setCandidate(candidate);
        jobApplication.setJobPosting(jobPosting);
        jobApplication.setAppliedDate(this.appliedDate != null ? this.appliedDate : LocalDate.now());
        jobApplication.setStatus(this.status);
        jobApplication.setCoverLetter(this.coverLetter);
        jobApplication.setResumeUrl(this.resumeUrl);
        jobApplication.setNotes(this.notes);
        return jobApplication;
    }
}