package com.company.hrm.recruitment.controller;

import com.company.hrm.recruitment.dto.InterviewRequest;
import com.company.hrm.recruitment.dto.InterviewResponse;
import com.company.hrm.recruitment.service.InterviewService;
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

@Tag(name = "Interviews", description = "Interview scheduling and feedback")
@RestController
@RequestMapping("/api/v1/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping
    @PreAuthorize(HrmPermissions.INTERVIEW_CREATE)
    public ResponseEntity<ApiResponse<InterviewResponse>> createInterview(@Valid @RequestBody InterviewRequest requestDto) {
        InterviewResponse createdInterview = interviewService.createInterview(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(createdInterview, "Interview created"));
    }

    @GetMapping("/{id}")
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<InterviewResponse>> getInterviewById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(interviewService.getInterviewById(id)));
    }

    @GetMapping
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<List<InterviewResponse>>> getAllInterviews() {
        return ResponseEntity.ok(ApiResponse.ok(interviewService.getAllInterviews()));
    }

    @GetMapping("/job-application/{jobApplicationId}")
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<List<InterviewResponse>>> getInterviewsByJobApplication(@PathVariable Long jobApplicationId) {
        return ResponseEntity.ok(ApiResponse.ok(interviewService.getInterviewsByJobApplication(jobApplicationId)));
    }

    @GetMapping("/interviewer/{interviewerId}")
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<List<InterviewResponse>>> getInterviewsByInterviewer(@PathVariable Long interviewerId) {
        return ResponseEntity.ok(ApiResponse.ok(interviewService.getInterviewsByInterviewer(interviewerId)));
    }

    @PutMapping("/{id}")
    @PreAuthorize(HrmPermissions.INTERVIEW_UPDATE)
    public ResponseEntity<ApiResponse<InterviewResponse>> updateInterview(
            @PathVariable Long id,
            @Valid @RequestBody InterviewRequest requestDto) {
        return ResponseEntity.ok(ApiResponse.ok(interviewService.updateInterview(id, requestDto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(HrmPermissions.INTERVIEW_DELETE)
    public ResponseEntity<ApiResponse<Void>> deleteInterview(@PathVariable Long id) {
        interviewService.deleteInterview(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Interview deleted"));
    }
}
