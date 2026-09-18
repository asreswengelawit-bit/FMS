package com.company.fms.payment.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

import com.company.fms.payment.Payment;

public record PaymentResponse(
        String id,
        String paymentNumber,
        String paymentType,
        String partyName,
        String periodId,
        String periodName,
        LocalDate paymentDate,
        BigDecimal amount,
        String status,
        String paymentMethod,
        String referenceNumber,
        String controlAccountId,
        String controlAccountCode,
        String controlAccountName,
        String invoiceId,
        String invoiceNumber,
        String journalEntryId,
        String relatedEntityId,
        String relatedEntityCode,
        String notes,
        String createdBy,
        String approvedBy,
        Instant createdAt,
        Instant updatedAt) {

    public static PaymentResponse from(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getPaymentNumber(),
                payment.getPaymentType(),
                payment.getPartyName(),
                payment.getPeriodId(),
                payment.getPeriodName(),
                payment.getPaymentDate(),
                payment.getAmount(),
                payment.getStatus(),
                payment.getPaymentMethod(),
                payment.getReferenceNumber(),
                payment.getControlAccountId(),
                payment.getControlAccountCode(),
                payment.getControlAccountName(),
                payment.getInvoiceId(),
                payment.getInvoiceNumber(),
                payment.getJournalEntryId(),
                payment.getRelatedEntityId(),
                payment.getRelatedEntityCode(),
                payment.getNotes(),
                payment.getCreatedBy(),
                payment.getApprovedBy(),
                payment.getCreatedAt(),
                payment.getUpdatedAt());
    }
}
