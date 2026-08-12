package com.crm.crm_backend.controller;

import com.crm.crm_backend.common.ApiResponse;
import com.crm.crm_backend.dto.request.SegmentCreateDTO;
import com.crm.crm_backend.dto.request.SegmentMemberRequestDTO;
import com.crm.crm_backend.dto.request.SegmentUpdateDTO;
import com.crm.crm_backend.dto.response.SegmentMemberResponseDTO;
import com.crm.crm_backend.dto.response.SegmentResponseDTO;
import com.crm.crm_backend.service.core.SegmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/segments")
@RequiredArgsConstructor
public class SegmentController {

    private final SegmentService segmentService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<SegmentResponseDTO>> createSegment(
            @Valid @RequestBody SegmentCreateDTO dto) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Segment created", segmentService.createSegment(dto)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<SegmentResponseDTO>> getSegment(@PathVariable Long id) {

        return ResponseEntity.ok(ApiResponse.success(segmentService.getSegment(id)));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<Page<SegmentResponseDTO>>> getAllSegments(Pageable pageable) {

        return ResponseEntity.ok(ApiResponse.success(segmentService.getAllSegments(pageable)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<SegmentResponseDTO>> updateSegment(
            @PathVariable Long id,
            @Valid @RequestBody SegmentUpdateDTO dto) {

        return ResponseEntity.ok(ApiResponse.success(segmentService.updateSegment(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<ApiResponse<Void>> deleteSegment(@PathVariable Long id) {

        segmentService.deleteSegment(id);
        return ResponseEntity.ok(ApiResponse.success("Segment deleted", null));
    }

    @GetMapping("/{id}/members")
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<List<SegmentMemberResponseDTO>>> listMembers(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(segmentService.listMembers(id)));
    }

    @PostMapping("/{id}/members")
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<SegmentMemberResponseDTO>> addMember(
            @PathVariable Long id,
            @Valid @RequestBody SegmentMemberRequestDTO dto) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Segment member added", segmentService.addMember(id, dto.getCustomerId())));
    }

    @DeleteMapping("/{id}/members/{customerId}")
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<Void>> removeMember(
            @PathVariable Long id,
            @PathVariable Long customerId) {

        segmentService.removeMember(id, customerId);
        return ResponseEntity.ok(ApiResponse.success("Segment member deleted", null));
    }

    @PostMapping("/{id}/evaluate")
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> evaluateSegment(@PathVariable Long id) {
        int memberCount = segmentService.evaluateAndPopulate(id);
        return ResponseEntity.ok(ApiResponse.success(
                "Segment evaluated",
                Map.of(
                        "segmentId", id,
                        "memberCount", memberCount
                )));
    }
}
