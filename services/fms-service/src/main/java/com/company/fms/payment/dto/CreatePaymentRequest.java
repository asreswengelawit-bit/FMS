package com.company.fms.payment.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreatePaymentRequest(
        @NotBlank String paymentType,
        String partyName,
        @NotBlank String periodId,
        @NotNull LocalDate paymentDate,
        @NotNull BigDecimal amount,
        String paymentMethod,
        String referenceNumber,
        String controlAccountId,
        String invoiceId,
        String invoiceNumber,
        String notes) {
}
