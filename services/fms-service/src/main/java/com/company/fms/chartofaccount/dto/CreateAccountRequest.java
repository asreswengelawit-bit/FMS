package com.company.fms.chartofaccount.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateAccountRequest(
        @NotBlank @Size(max = 50) String code,
        @NotBlank @Size(max = 255) String name,
        @NotBlank @Pattern(regexp = "ASSET|LIABILITY|EQUITY|REVENUE|EXPENSE",
                message = "type must be one of ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE") String type,
        Boolean postingAllowed,
        String parentAccountId,
        @Size(max = 1000) String description) {
}
