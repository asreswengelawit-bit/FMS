package com.company.hrm.recruitment.service;

import com.company.hrm.recruitment.dto.JobPostingRequest;
import com.company.hrm.recruitment.dto.JobPostingResponse;
import com.company.hrm.recruitment.entity.JobPosting.Status;

import java.util.List;

public interface JobPostingService {

    JobPostingResponse createJobPosting(JobPostingRequest requestDto);

    JobPostingResponse getJobPostingById(Long id);

    List<JobPostingResponse> getAllJobPostings();

    List<JobPostingResponse> getJobPostingsByDepartment(Long departmentId);

    List<JobPostingResponse> getJobPostingsByStatus(Status status);

    JobPostingResponse updateJobPostingStatus(Long id, Status status);

    JobPostingResponse updateJobPosting(Long id, JobPostingRequest requestDto);

    void deleteJobPosting(Long id);
}