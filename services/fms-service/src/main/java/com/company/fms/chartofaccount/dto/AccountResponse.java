package com.company.fms.chartofaccount.dto;

import java.math.BigDecimal;
import java.time.Instant;

import com.company.fms.chartofaccount.Account;

public record AccountResponse(
        String id,
        String code,
        String name,
        String type,
        String normalBalance,
        String parentAccountId,
        boolean postingAllowed,
        String description,
        String status,
        Instant createdAt,
        String createdBy,
        Instant updatedAt,
        String updatedBy,
        BigDecimal balance) {

    public static AccountResponse from(Account account) {
        return new AccountResponse(
                account.getId(),
                account.getCode(),
                account.getName(),
                account.getType(),
                account.getNormalBalance(),
                account.getParentAccountId(),
                account.isPostingAllowed(),
                account.getDescription(),
                account.getStatus(),
                account.getCreatedAt(),
                account.getCreatedBy(),
                account.getUpdatedAt(),
                account.getUpdatedBy(),
                account.getBalance());
    }
}
