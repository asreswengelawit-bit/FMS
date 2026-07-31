package com.company.hrm.recruitment.controller;

import com.company.hrm.recruitment.dto.CandidateRequest;
import com.company.hrm.recruitment.dto.CandidateResponse;
import com.company.hrm.recruitment.service.CandidateService;
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

@Tag(name = "Candidates", description = "Applicant pool")
@RestController
@RequestMapping("/api/v1/candidates")
@RequiredArgsConstructor
public class CandidateController {

    private final CandidateService candidateService;

    @PostMapping
    @PreAuthorize(HrmPermissions.CANDIDATE_CREATE)
    public ResponseEntity<ApiResponse<CandidateResponse>> createCandidate(@Valid @RequestBody CandidateRequest requestDto) {
        CandidateResponse createdCandidate = candidateService.createCandidate(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(createdCandidate, "Candidate created"));
    }

    @GetMapping("/{id}")
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<CandidateResponse>> getCandidateById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(candidateService.getCandidateById(id)));
    }

    @GetMapping
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<List<CandidateResponse>>> getAllCandidates() {
        return ResponseEntity.ok(ApiResponse.ok(candidateService.getAllCandidates()));
    }

    @PutMapping("/{id}")
    @PreAuthorize(HrmPermissions.CANDIDATE_UPDATE)
    public ResponseEntity<ApiResponse<CandidateResponse>> updateCandidate(
            @PathVariable Long id,
            @Valid @RequestBody CandidateRequest requestDto) {
        return ResponseEntity.ok(ApiResponse.ok(candidateService.updateCandidate(id, requestDto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(HrmPermissions.CANDIDATE_DELETE)
    public ResponseEntity<ApiResponse<Void>> deleteCandidate(@PathVariable Long id) {
        candidateService.deleteCandidate(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Candidate deleted"));
    }
}
