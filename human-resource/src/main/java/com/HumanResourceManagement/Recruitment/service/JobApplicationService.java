package com.HumanResourceManagement.Recruitment.service;

import com.HumanResourceManagement.Recruitment.Model.Candidate;
import com.HumanResourceManagement.Recruitment.Model.JobApplication;
import com.HumanResourceManagement.Recruitment.Model.JobApplication.Status;
import com.HumanResourceManagement.Recruitment.Model.JobPosting;
import com.HumanResourceManagement.Recruitment.dto.JobApplicationRequest;
import com.HumanResourceManagement.Recruitment.dto.JobApplicationResponse;
import com.HumanResourceManagement.Recruitment.repository.CandidateRepository;
import com.HumanResourceManagement.Recruitment.repository.JobApplicationRepository;
import com.HumanResourceManagement.Recruitment.repository.JobPostingRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final CandidateRepository candidateRepository;
    private final JobPostingRepository jobPostingRepository;

    public JobApplicationResponse createJobApplication(JobApplicationRequest requestDto) {
        if (jobApplicationRepository.existsByCandidateIdAndJobPostingId(
                requestDto.getCandidateId(), requestDto.getJobPostingId())) {
            throw new IllegalArgumentException("Candidate has already applied for this job posting.");
        }

        Candidate candidate = candidateRepository.findById(requestDto.getCandidateId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Candidate not found with ID: " + requestDto.getCandidateId()));

        JobPosting jobPosting = jobPostingRepository.findById(requestDto.getJobPostingId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "JobPosting not found with ID: " + requestDto.getJobPostingId()));

        JobApplication jobApplication = requestDto.toEntity(candidate, jobPosting);
        JobApplication savedApplication = jobApplicationRepository.save(jobApplication);

        return JobApplicationResponse.fromEntity(savedApplication);
    }

    @Transactional(readOnly = true)
    public JobApplicationResponse getJobApplicationById(Long id) {
        JobApplication jobApplication = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("JobApplication not found with ID: " + id));
        return JobApplicationResponse.fromEntity(jobApplication);
    }

    @Transactional(readOnly = true)
    public List<JobApplicationResponse> getAllJobApplications() {
        return jobApplicationRepository.findAll().stream()
                .map(JobApplicationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<JobApplicationResponse> getApplicationsByCandidate(Long candidateId) {
        return jobApplicationRepository.findByCandidateId(candidateId).stream()
                .map(JobApplicationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<JobApplicationResponse> getApplicationsByJobPosting(Long jobPostingId) {
        return jobApplicationRepository.findByJobPostingId(jobPostingId).stream()
                .map(JobApplicationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public JobApplicationResponse updateApplicationStatus(Long id, Status status) {
        JobApplication existingApplication = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("JobApplication not found with ID: " + id));

        existingApplication.setStatus(status);
        JobApplication updatedApplication = jobApplicationRepository.save(existingApplication);
        return JobApplicationResponse.fromEntity(updatedApplication);
    }

    public JobApplicationResponse updateJobApplication(Long id, JobApplicationRequest requestDto) {
        JobApplication existingApplication = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("JobApplication not found with ID: " + id));

        Candidate candidate = candidateRepository.findById(requestDto.getCandidateId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Candidate not found with ID: " + requestDto.getCandidateId()));

        JobPosting jobPosting = jobPostingRepository.findById(requestDto.getJobPostingId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "JobPosting not found with ID: " + requestDto.getJobPostingId()));

        existingApplication.setCandidate(candidate);
        existingApplication.setJobPosting(jobPosting);
        if (requestDto.getAppliedDate() != null) {
            existingApplication.setAppliedDate(requestDto.getAppliedDate());
        }
        existingApplication.setStatus(requestDto.getStatus());
        existingApplication.setCoverLetter(requestDto.getCoverLetter());
        existingApplication.setResumeUrl(requestDto.getResumeUrl());
        existingApplication.setNotes(requestDto.getNotes());

        JobApplication updatedApplication = jobApplicationRepository.save(existingApplication);
        return JobApplicationResponse.fromEntity(updatedApplication);
    }

    public void deleteJobApplication(Long id) {
        if (!jobApplicationRepository.existsById(id)) {
            throw new EntityNotFoundException("JobApplication not found with ID: " + id);
        }
        jobApplicationRepository.deleteById(id);
    }
}