package com.company.hrm.recruitment.service;

import com.company.hrm.recruitment.dto.InterviewRequest;
import com.company.hrm.recruitment.dto.InterviewResponse;

import java.util.List;

public interface InterviewService {

    InterviewResponse createInterview(InterviewRequest requestDto);

    InterviewResponse getInterviewById(Long id);

    List<InterviewResponse> getAllInterviews();

    List<InterviewResponse> getInterviewsByJobApplication(Long jobApplicationId);

    List<InterviewResponse> getInterviewsByInterviewer(Long interviewerId);

    InterviewResponse updateInterview(Long id, InterviewRequest requestDto);

    void deleteInterview(Long id);
}