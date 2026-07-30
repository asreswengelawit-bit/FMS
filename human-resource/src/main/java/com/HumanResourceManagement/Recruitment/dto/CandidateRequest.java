package com.HumanResourceManagement.Recruitment.dto;

import com.HumanResourceManagement.Recruitment.Model.Candidate;
import com.HumanResourceManagement.Recruitment.Model.Candidate.Source;
import com.HumanResourceManagement.Recruitment.Model.Candidate.Status;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CandidateRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String phone;
    private String resumeUrl;
    private String coverLetterUrl;
    private String linkedInUrl;

    private Source source;

    @NotNull(message = "Status is required")
    private Status status = Status.NEW;

    public Candidate toEntity() {
        Candidate candidate = new Candidate();
        candidate.setFirstName(this.firstName);
        candidate.setLastName(this.lastName);
        candidate.setEmail(this.email);
        candidate.setPhone(this.phone);
        candidate.setResumeUrl(this.resumeUrl);
        candidate.setCoverLetterUrl(this.coverLetterUrl);
        candidate.setLinkedInUrl(this.linkedInUrl);
        candidate.setSource(this.source);
        candidate.setStatus(this.status);
        return candidate;
    }
}