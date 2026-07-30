package com.HumanResourceManagement.Recruitment.service;

import com.HumanResourceManagement.Employee.Model.Employee;
import com.HumanResourceManagement.Employee.Repository.EmployeeRepository;
// import com.HumanResourceManagement.Employee.repository.EmployeeRepository;
import com.HumanResourceManagement.Recruitment.Model.Interview;
import com.HumanResourceManagement.Recruitment.Model.JobApplication;
import com.HumanResourceManagement.Recruitment.dto.InterviewRequest;
import com.HumanResourceManagement.Recruitment.dto.InterviewResponse;
import com.HumanResourceManagement.Recruitment.repository.InterviewRepository;
import com.HumanResourceManagement.Recruitment.repository.JobApplicationRepository;

// import com.HumanResourceManagement.Recruitment.repository.JobApplicationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final EmployeeRepository employeeRepository;

    public InterviewResponse createInterview(InterviewRequest requestDto) {
        JobApplication jobApplication = jobApplicationRepository.findById(requestDto.getJobApplicationId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "JobApplication not found with ID: " + requestDto.getJobApplicationId()));

        Employee interviewer = employeeRepository.findById(requestDto.getInterviewerId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Employee (Interviewer) not found with ID: " + requestDto.getInterviewerId()));

        Interview interview = requestDto.toEntity(jobApplication, interviewer);
        Interview savedInterview = interviewRepository.save(interview);

        return InterviewResponse.fromEntity(savedInterview);
    }

    @Transactional(readOnly = true)
    public InterviewResponse getInterviewById(Long id) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Interview not found with ID: " + id));
        return InterviewResponse.fromEntity(interview);
    }

    @Transactional(readOnly = true)
    public List<InterviewResponse> getAllInterviews() {
        return interviewRepository.findAll().stream()
                .map(InterviewResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InterviewResponse> getInterviewsByJobApplication(Long jobApplicationId) {
        return interviewRepository.findByJobApplicationId(jobApplicationId).stream()
                .map(InterviewResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InterviewResponse> getInterviewsByInterviewer(Long interviewerId) {
        return interviewRepository.findByInterviewerId(interviewerId).stream()
                .map(InterviewResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public InterviewResponse updateInterview(Long id, InterviewRequest requestDto) {
        Interview existingInterview = interviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Interview not found with ID: " + id));

        JobApplication jobApplication = jobApplicationRepository.findById(requestDto.getJobApplicationId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "JobApplication not found with ID: " + requestDto.getJobApplicationId()));

        Employee interviewer = employeeRepository.findById(requestDto.getInterviewerId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Employee (Interviewer) not found with ID: " + requestDto.getInterviewerId()));

        existingInterview.setJobApplication(jobApplication);
        existingInterview.setInterviewer(interviewer);
        existingInterview.setScheduledDate(requestDto.getScheduledDate());
        existingInterview.setMode(requestDto.getMode());
        existingInterview.setLocation(requestDto.getLocation());
        existingInterview.setStatus(requestDto.getStatus());
        existingInterview.setFeedback(requestDto.getFeedback());
        existingInterview.setRating(requestDto.getRating());

        Interview updatedInterview = interviewRepository.save(existingInterview);
        return InterviewResponse.fromEntity(updatedInterview);
    }

    public void deleteInterview(Long id) {
        if (!interviewRepository.existsById(id)) {
            throw new EntityNotFoundException("Interview not found with ID: " + id);
        }
        interviewRepository.deleteById(id);
    }
}