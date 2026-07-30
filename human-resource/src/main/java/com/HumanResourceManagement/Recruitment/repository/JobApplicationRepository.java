package com.HumanResourceManagement.Recruitment.repository;

import com.HumanResourceManagement.Recruitment.Model.JobApplication;
import com.HumanResourceManagement.Recruitment.Model.JobApplication.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    // Find all applications submitted by a specific Candidate
    List<JobApplication> findByCandidateId(Long candidateId);

    // Find all applications for a specific Job Posting
    List<JobApplication> findByJobPostingId(Long jobPostingId);

    // Find applications by status (APPLIED, SHORTLISTED, INTERVIEW, OFFERED,
    // REJECTED, HIRED)
    List<JobApplication> findByStatus(Status status);

    // Prevent duplicate applications by the same candidate for the same job posting
    boolean existsByCandidateIdAndJobPostingId(Long candidateId, Long jobPostingId);
}