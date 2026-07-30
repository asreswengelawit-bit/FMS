package com.HumanResourceManagement.Recruitment.Controller;

import com.HumanResourceManagement.Recruitment.dto.InterviewRequest;
import com.HumanResourceManagement.Recruitment.dto.InterviewResponse;
import com.HumanResourceManagement.Recruitment.service.InterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping
    public ResponseEntity<InterviewResponse> createInterview(@Valid @RequestBody InterviewRequest requestDto) {
        InterviewResponse createdInterview = interviewService.createInterview(requestDto);
        return new ResponseEntity<>(createdInterview, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InterviewResponse> getInterviewById(@PathVariable Long id) {
        return ResponseEntity.ok(interviewService.getInterviewById(id));
    }

    @GetMapping
    public ResponseEntity<List<InterviewResponse>> getAllInterviews() {
        return ResponseEntity.ok(interviewService.getAllInterviews());
    }

    @GetMapping("/job-application/{jobApplicationId}")
    public ResponseEntity<List<InterviewResponse>> getInterviewsByJobApplication(@PathVariable Long jobApplicationId) {
        return ResponseEntity.ok(interviewService.getInterviewsByJobApplication(jobApplicationId));
    }

    @GetMapping("/interviewer/{interviewerId}")
    public ResponseEntity<List<InterviewResponse>> getInterviewsByInterviewer(@PathVariable Long interviewerId) {
        return ResponseEntity.ok(interviewService.getInterviewsByInterviewer(interviewerId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InterviewResponse> updateInterview(
            @PathVariable Long id,
            @Valid @RequestBody InterviewRequest requestDto) {
        return ResponseEntity.ok(interviewService.updateInterview(id, requestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInterview(@PathVariable Long id) {
        interviewService.deleteInterview(id);
        return ResponseEntity.noContent().build();
    }
}