package com.HumanResourceManagement.Recruitment.dto;

import com.HumanResourceManagement.Recruitment.Model.Candidate;
import com.HumanResourceManagement.Recruitment.Model.Candidate.Source;
import com.HumanResourceManagement.Recruitment.Model.Candidate.Status;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CandidateResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String resumeUrl;
    private String coverLetterUrl;
    private String linkedInUrl;
    private Source source;
    private Status status;

    /**
     * Converts Candidate Entity -> Response DTO
     */
    public static CandidateResponse fromEntity(Candidate entity) {
        if (entity == null) {
            return null;
        }

        return CandidateResponse.builder()
                .id(entity.getId())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .email(entity.getEmail())
                .phone(entity.getPhone())
                .resumeUrl(entity.getResumeUrl())
                .coverLetterUrl(entity.getCoverLetterUrl())
                .linkedInUrl(entity.getLinkedInUrl())
                .source(entity.getSource())
                .status(entity.getStatus())
                .build();
    }
}