package com.HumanResourceManagement.Recruitment.Controller;

import com.HumanResourceManagement.Recruitment.Model.JobApplication.Status;
import com.HumanResourceManagement.Recruitment.dto.JobApplicationRequest;
import com.HumanResourceManagement.Recruitment.dto.JobApplicationResponse;
import com.HumanResourceManagement.Recruitment.service.JobApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/job-applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    @PostMapping
    public ResponseEntity<JobApplicationResponse> createJobApplication(
            @Valid @RequestBody JobApplicationRequest requestDto) {
        JobApplicationResponse createdApplication = jobApplicationService.createJobApplication(requestDto);
        return new ResponseEntity<>(createdApplication, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobApplicationResponse> getJobApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(jobApplicationService.getJobApplicationById(id));
    }

    @GetMapping
    public ResponseEntity<List<JobApplicationResponse>> getAllJobApplications() {
        return ResponseEntity.ok(jobApplicationService.getAllJobApplications());
    }

    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<JobApplicationResponse>> getApplicationsByCandidate(@PathVariable Long candidateId) {
        return ResponseEntity.ok(jobApplicationService.getApplicationsByCandidate(candidateId));
    }

    @GetMapping("/job-posting/{jobPostingId}")
    public ResponseEntity<List<JobApplicationResponse>> getApplicationsByJobPosting(@PathVariable Long jobPostingId) {
        return ResponseEntity.ok(jobApplicationService.getApplicationsByJobPosting(jobPostingId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<JobApplicationResponse> updateApplicationStatus(
            @PathVariable Long id,
            @RequestParam Status status) {
        return ResponseEntity.ok(jobApplicationService.updateApplicationStatus(id, status));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobApplicationResponse> updateJobApplication(
            @PathVariable Long id,
            @Valid @RequestBody JobApplicationRequest requestDto) {
        return ResponseEntity.ok(jobApplicationService.updateJobApplication(id, requestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJobApplication(@PathVariable Long id) {
        jobApplicationService.deleteJobApplication(id);
        return ResponseEntity.noContent().build();
    }
}