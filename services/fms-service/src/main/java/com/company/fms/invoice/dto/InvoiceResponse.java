package com.company.fms.invoice.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import com.company.fms.invoice.Invoice;
import com.company.fms.invoice.InvoiceLine;

public record InvoiceResponse(
        String id,
        String invoiceNumber,
        String invoiceType,
        String partyName,
        String periodId,
        String periodName,
        LocalDate issueDate,
        LocalDate dueDate,
        String status,
        BigDecimal totalAmount,
        BigDecimal paidAmount,
        BigDecimal remainingBalance,
        String controlAccountId,
        String controlAccountCode,
        String controlAccountName,
        String vendorId,
        String vendorCode,
        String customerId,
        String customerCode,
        String journalEntryId,
        String createdBy,
        String approvedBy,
        Instant createdAt,
        Instant updatedAt,
        List<InvoiceLineResponse> lines) {

    public record InvoiceLineResponse(
            String id,
            String accountId,
            String accountCode,
            String accountName,
            String description,
            BigDecimal quantity,
            BigDecimal unitPrice,
            BigDecimal totalPrice) {

        public static InvoiceLineResponse from(InvoiceLine line) {
            return new InvoiceLineResponse(
                    line.getId(),
                    line.getAccountId(),
                    line.getAccountCode(),
                    line.getAccountName(),
                    line.getDescription(),
                    line.getQuantity(),
                    line.getUnitPrice(),
                    line.getTotalPrice());
        }
    }

    public static InvoiceResponse from(Invoice invoice) {
        return new InvoiceResponse(
                invoice.getId(),
                invoice.getInvoiceNumber(),
                invoice.getInvoiceType(),
                invoice.getPartyName(),
                invoice.getPeriodId(),
                invoice.getPeriodName(),
                invoice.getIssueDate(),
                invoice.getDueDate(),
                invoice.getStatus(),
                invoice.getTotalAmount(),
                invoice.getPaidAmount(),
                invoice.getRemainingBalance(),
                invoice.getControlAccountId(),
                invoice.getControlAccountCode(),
                invoice.getControlAccountName(),
                invoice.getVendorId(),
                invoice.getVendorCode(),
                invoice.getCustomerId(),
                invoice.getCustomerCode(),
                invoice.getJournalEntryId(),
                invoice.getCreatedBy(),
                invoice.getApprovedBy(),
                invoice.getCreatedAt(),
                invoice.getUpdatedAt(),
                invoice.getLines().stream().map(InvoiceLineResponse::from).toList());
    }
}
