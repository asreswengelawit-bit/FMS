package com.company.hrm.organization.controller;

import com.company.hrm.organization.dto.JobGradeRequest;
import com.company.hrm.organization.dto.JobGradeResponse;
import com.company.hrm.organization.service.JobGradeService;
import com.company.hrm.organization.service.Impl.JobGradeServiceImpl;

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

@Tag(name = "Job grades", description = "Salary grades / levels")
@RestController
@RequestMapping("/api/v1/job-grades")
@RequiredArgsConstructor
public class JobGradeController {

    private final JobGradeServiceImpl jobGradeService;

    @PostMapping
    @PreAuthorize(HrmPermissions.JOB_GRADE_CREATE)
    public ResponseEntity<ApiResponse<JobGradeResponse>> createJobGrade(@Valid @RequestBody JobGradeRequest requestDto) {
        JobGradeResponse createdJobGrade = jobGradeService.createJobGrade(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(createdJobGrade, "Job grade created"));
    }

    @GetMapping("/{id}")
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<JobGradeResponse>> getJobGradeById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(jobGradeService.getJobGradeById(id)));
    }

    @GetMapping
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<List<JobGradeResponse>>> getAllJobGrades() {
        return ResponseEntity.ok(ApiResponse.ok(jobGradeService.getAllJobGrades()));
    }

    @PutMapping("/{id}")
    @PreAuthorize(HrmPermissions.JOB_GRADE_UPDATE)
    public ResponseEntity<ApiResponse<JobGradeResponse>> updateJobGrade(
            @PathVariable Long id,
            @Valid @RequestBody JobGradeRequest requestDto) {
        return ResponseEntity.ok(ApiResponse.ok(jobGradeService.updateJobGrade(id, requestDto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(HrmPermissions.JOB_GRADE_DELETE)
    public ResponseEntity<ApiResponse<Void>> deleteJobGrade(@PathVariable Long id) {
        jobGradeService.deleteJobGrade(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Job grade deleted"));
    }
}
