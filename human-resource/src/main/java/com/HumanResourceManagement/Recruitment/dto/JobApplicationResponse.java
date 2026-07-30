package com.HumanResourceManagement.Recruitment.dto;

import com.HumanResourceManagement.Recruitment.Model.JobApplication;
import com.HumanResourceManagement.Recruitment.Model.JobApplication.Status;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class JobApplicationResponse {

    private Long id;
    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private Long jobPostingId;
    private String jobTitle;
    private LocalDate appliedDate;
    private Status status;
    private String coverLetter;
    private String resumeUrl;
    private String notes;

    /**
     * Converts JobApplication Entity -> Response DTO
     */
    public static JobApplicationResponse fromEntity(JobApplication entity) {
        if (entity == null) {
            return null;
        }

        String candidateName = null;
        String candidateEmail = null;
        if (entity.getCandidate() != null) {
            candidateName = entity.getCandidate().getFirstName() + " " + entity.getCandidate().getLastName();
            candidateEmail = entity.getCandidate().getEmail();
        }

        String jobTitle = null;
        if (entity.getJobPosting() != null) {
            jobTitle = entity.getJobPosting().getTitle();
        }

        return JobApplicationResponse.builder()
                .id(entity.getId())
                .candidateId(entity.getCandidate() != null ? entity.getCandidate().getId() : null)
                .candidateName(candidateName)
                .candidateEmail(candidateEmail)
                .jobPostingId(entity.getJobPosting() != null ? entity.getJobPosting().getId() : null)
                .jobTitle(jobTitle)
                .appliedDate(entity.getAppliedDate())
                .status(entity.getStatus())
                .coverLetter(entity.getCoverLetter())
                .resumeUrl(entity.getResumeUrl())
                .notes(entity.getNotes())
                .build();
    }
}