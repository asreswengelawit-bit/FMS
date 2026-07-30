package com.HumanResourceManagement.Recruitment.Controller;

import com.HumanResourceManagement.Recruitment.Model.JobPosting.Status;
import com.HumanResourceManagement.Recruitment.dto.JobPostingRequest;
import com.HumanResourceManagement.Recruitment.dto.JobPostingResponse;
import com.HumanResourceManagement.Recruitment.service.JobPostingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/job-postings")
@RequiredArgsConstructor
public class JobPostingController {

    private final JobPostingService jobPostingService;

    @PostMapping
    public ResponseEntity<JobPostingResponse> createJobPosting(@Valid @RequestBody JobPostingRequest requestDto) {
        JobPostingResponse createdJobPosting = jobPostingService.createJobPosting(requestDto);
        return new ResponseEntity<>(createdJobPosting, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobPostingResponse> getJobPostingById(@PathVariable Long id) {
        return ResponseEntity.ok(jobPostingService.getJobPostingById(id));
    }

    @GetMapping
    public ResponseEntity<List<JobPostingResponse>> getAllJobPostings() {
        return ResponseEntity.ok(jobPostingService.getAllJobPostings());
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<JobPostingResponse>> getJobPostingsByDepartment(@PathVariable Long departmentId) {
        return ResponseEntity.ok(jobPostingService.getJobPostingsByDepartment(departmentId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<JobPostingResponse>> getJobPostingsByStatus(@PathVariable Status status) {
        return ResponseEntity.ok(jobPostingService.getJobPostingsByStatus(status));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<JobPostingResponse> updateJobPostingStatus(
            @PathVariable Long id,
            @RequestParam Status status) {
        return ResponseEntity.ok(jobPostingService.updateJobPostingStatus(id, status));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobPostingResponse> updateJobPosting(
            @PathVariable Long id,
            @Valid @RequestBody JobPostingRequest requestDto) {
        return ResponseEntity.ok(jobPostingService.updateJobPosting(id, requestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJobPosting(@PathVariable Long id) {
        jobPostingService.deleteJobPosting(id);
        return ResponseEntity.noContent().build();
    }
}