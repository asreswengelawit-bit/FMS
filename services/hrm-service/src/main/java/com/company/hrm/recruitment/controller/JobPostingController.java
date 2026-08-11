package com.company.hrm.recruitment.controller;

import com.company.hrm.recruitment.entity.JobPosting.Status;
import com.company.hrm.recruitment.dto.JobPostingRequest;
import com.company.hrm.recruitment.dto.JobPostingResponse;
// import com.company.hrm.recruitment.service.JobPostingService;
import com.company.hrm.recruitment.service.Impl.JobPostingServiceImpl;

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

@Tag(name = "Job postings", description = "Open vacancies")
@RestController
@RequestMapping("/api/v1/job-postings")
@RequiredArgsConstructor
public class JobPostingController {

    private final JobPostingServiceImpl jobPostingService;

    @PostMapping
    @PreAuthorize(HrmPermissions.JOB_POSTING_CREATE)
    public ResponseEntity<ApiResponse<JobPostingResponse>> createJobPosting(@Valid @RequestBody JobPostingRequest requestDto) {
        JobPostingResponse createdJobPosting = jobPostingService.createJobPosting(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(createdJobPosting, "Job posting created"));
    }

    @GetMapping("/{id}")
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<JobPostingResponse>> getJobPostingById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(jobPostingService.getJobPostingById(id)));
    }

    @GetMapping
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<List<JobPostingResponse>>> getAllJobPostings() {
        return ResponseEntity.ok(ApiResponse.ok(jobPostingService.getAllJobPostings()));
    }

    @GetMapping("/department/{departmentId}")
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<List<JobPostingResponse>>> getJobPostingsByDepartment(@PathVariable Long departmentId) {
        return ResponseEntity.ok(ApiResponse.ok(jobPostingService.getJobPostingsByDepartment(departmentId)));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<List<JobPostingResponse>>> getJobPostingsByStatus(@PathVariable Status status) {
        return ResponseEntity.ok(ApiResponse.ok(jobPostingService.getJobPostingsByStatus(status)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize(HrmPermissions.JOB_POSTING_UPDATE)
    public ResponseEntity<ApiResponse<JobPostingResponse>> updateJobPostingStatus(
            @PathVariable Long id,
            @RequestParam Status status) {
        return ResponseEntity.ok(ApiResponse.ok(jobPostingService.updateJobPostingStatus(id, status)));
    }

    @PutMapping("/{id}")
    @PreAuthorize(HrmPermissions.JOB_POSTING_UPDATE)
    public ResponseEntity<ApiResponse<JobPostingResponse>> updateJobPosting(
            @PathVariable Long id,
            @Valid @RequestBody JobPostingRequest requestDto) {
        return ResponseEntity.ok(ApiResponse.ok(jobPostingService.updateJobPosting(id, requestDto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(HrmPermissions.JOB_POSTING_DELETE)
    public ResponseEntity<ApiResponse<Void>> deleteJobPosting(@PathVariable Long id) {
        jobPostingService.deleteJobPosting(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Job posting deleted"));
    }
}
