package com.crm.crm_backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SegmentMemberRequestDTO {

    @NotNull(message = "Customer ID is required")
    private Long customerId;
}
