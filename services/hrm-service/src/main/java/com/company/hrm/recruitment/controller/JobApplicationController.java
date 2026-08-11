package com.company.hrm.recruitment.controller;

import com.company.hrm.recruitment.entity.JobApplication.Status;
import com.company.hrm.recruitment.dto.JobApplicationRequest;
import com.company.hrm.recruitment.dto.JobApplicationResponse;
import com.company.hrm.recruitment.service.JobApplicationService;
import com.company.hrm.recruitment.service.Impl.JobApplicationServiceImpl;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.access.prepost.PreAuthorize;
import com.company.hrm.shared.api.ApiResponse;
import com.company.hrm.shared.security.HrmPermissions;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;

@Tag(name = "Job applications", description = "Applications against a posting")
@RestController
@RequestMapping("/api/v1/job-applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationServiceImpl jobApplicationService;

    @PostMapping
    @PreAuthorize(HrmPermissions.JOB_APPLICATION_CREATE)
    public ResponseEntity<ApiResponse<JobApplicationResponse>> createJobApplication(
            @Valid @RequestBody JobApplicationRequest requestDto) {
        JobApplicationResponse createdApplication = jobApplicationService.createJobApplication(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(createdApplication, "Job application created"));
    }

    @GetMapping("/{id}")
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<JobApplicationResponse>> getJobApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(jobApplicationService.getJobApplicationById(id)));
    }

    @GetMapping
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<List<JobApplicationResponse>>> getAllJobApplications() {
        return ResponseEntity.ok(ApiResponse.ok(jobApplicationService.getAllJobApplications()));
    }

    @GetMapping("/candidate/{candidateId}")
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<List<JobApplicationResponse>>> getApplicationsByCandidate(@PathVariable Long candidateId) {
        return ResponseEntity.ok(ApiResponse.ok(jobApplicationService.getApplicationsByCandidate(candidateId)));
    }

    @GetMapping("/job-posting/{jobPostingId}")
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<List<JobApplicationResponse>>> getApplicationsByJobPosting(@PathVariable Long jobPostingId) {
        return ResponseEntity.ok(ApiResponse.ok(jobApplicationService.getApplicationsByJobPosting(jobPostingId)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize(HrmPermissions.JOB_APPLICATION_UPDATE)
    public ResponseEntity<ApiResponse<JobApplicationResponse>> updateApplicationStatus(
            @PathVariable Long id,
            @RequestParam Status status) {
        return ResponseEntity.ok(ApiResponse.ok(jobApplicationService.updateApplicationStatus(id, status)));
    }

    @PutMapping("/{id}")
    @PreAuthorize(HrmPermissions.JOB_APPLICATION_UPDATE)
    public ResponseEntity<ApiResponse<JobApplicationResponse>> updateJobApplication(
            @PathVariable Long id,
            @Valid @RequestBody JobApplicationRequest requestDto) {
        return ResponseEntity.ok(ApiResponse.ok(jobApplicationService.updateJobApplication(id, requestDto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(HrmPermissions.JOB_APPLICATION_DELETE)
    public ResponseEntity<ApiResponse<Void>> deleteJobApplication(@PathVariable Long id) {
        jobApplicationService.deleteJobApplication(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Job application deleted"));
    }
}
