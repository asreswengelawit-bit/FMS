package com.company.hrm.recruitment.service;

import com.company.hrm.recruitment.dto.JobApplicationRequest;
import com.company.hrm.recruitment.dto.JobApplicationResponse;
import com.company.hrm.recruitment.entity.JobApplication.Status;

import java.util.List;

public interface JobApplicationService {

    JobApplicationResponse createJobApplication(JobApplicationRequest requestDto);

    JobApplicationResponse getJobApplicationById(Long id);

    List<JobApplicationResponse> getAllJobApplications();

    List<JobApplicationResponse> getApplicationsByCandidate(Long candidateId);

    List<JobApplicationResponse> getApplicationsByJobPosting(Long jobPostingId);

    JobApplicationResponse updateApplicationStatus(Long id, Status status);

    JobApplicationResponse updateJobApplication(Long id, JobApplicationRequest requestDto);

    void deleteJobApplication(Long id);
}