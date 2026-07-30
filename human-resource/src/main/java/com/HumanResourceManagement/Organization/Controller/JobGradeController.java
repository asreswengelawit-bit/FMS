package com.HumanResourceManagement.Organization.Controller;

import com.HumanResourceManagement.Organization.DTO.JobGradeRequest;
import com.HumanResourceManagement.Organization.DTO.JobGradeResponse;
import com.HumanResourceManagement.Organization.Service.JobGradeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/job-grades")
@RequiredArgsConstructor
public class JobGradeController {

    private final JobGradeService jobGradeService;

    @PostMapping
    public ResponseEntity<JobGradeResponse> createJobGrade(@Valid @RequestBody JobGradeRequest requestDto) {
        JobGradeResponse createdJobGrade = jobGradeService.createJobGrade(requestDto);
        return new ResponseEntity<>(createdJobGrade, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobGradeResponse> getJobGradeById(@PathVariable Long id) {
        return ResponseEntity.ok(jobGradeService.getJobGradeById(id));
    }

    @GetMapping
    public ResponseEntity<List<JobGradeResponse>> getAllJobGrades() {
        return ResponseEntity.ok(jobGradeService.getAllJobGrades());
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobGradeResponse> updateJobGrade(
            @PathVariable Long id,
            @Valid @RequestBody JobGradeRequest requestDto) {
        return ResponseEntity.ok(jobGradeService.updateJobGrade(id, requestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJobGrade(@PathVariable Long id) {
        jobGradeService.deleteJobGrade(id);
        return ResponseEntity.noContent().build();
    }
}