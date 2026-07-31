package com.company.hrm.recruitment.dto;

import com.company.hrm.recruitment.entity.Interview;
import com.company.hrm.recruitment.entity.Interview.Mode;
import com.company.hrm.recruitment.entity.Interview.Status;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class InterviewResponse {

    private Long id;
    private Long jobApplicationId;
    private Long interviewerId;
    private String interviewerName;
    private LocalDateTime scheduledDate;
    private Mode mode;
    private String location;
    private Status status;
    private String feedback;
    private int rating;

    /**
     * Converts Interview Entity -> Response DTO
     */
    public static InterviewResponse fromEntity(Interview entity) {
        if (entity == null) {
            return null;
        }

        String fullName = null;
        if (entity.getInterviewer() != null) {
            fullName = entity.getInterviewer().getFirstName() + " " + entity.getInterviewer().getLastName();
        }

        return InterviewResponse.builder()
                .id(entity.getId())
                .jobApplicationId(entity.getJobApplication() != null ? entity.getJobApplication().getId() : null)
                .interviewerId(entity.getInterviewer() != null ? entity.getInterviewer().getId() : null)
                .interviewerName(fullName)
                .scheduledDate(entity.getScheduledDate())
                .mode(entity.getMode())
                .location(entity.getLocation())
                .status(entity.getStatus())
                .feedback(entity.getFeedback())
                .rating(entity.getRating())
                .build();
    }
}
