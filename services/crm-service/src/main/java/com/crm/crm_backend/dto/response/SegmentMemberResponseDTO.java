package com.crm.crm_backend.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SegmentMemberResponseDTO {

    private Long id;

    private Long segmentId;

    private Long customerId;

    private String customerNumber;

    private String customerName;

    private String email;

    private LocalDateTime joinedAt;
}
