package com.company.fms.invoice.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record CreateInvoiceRequest(
        @NotBlank String invoiceNumber,
        @NotBlank String invoiceType,
        String partyName,
        @NotBlank String periodId,
        @NotNull LocalDate issueDate,
        LocalDate dueDate,
        String controlAccountId,
        String vendorId,
        String customerId,
        String supplierInvoiceNumber,
        @NotEmpty @Valid List<InvoiceLineRequest> lines) {

    public record InvoiceLineRequest(
            @NotBlank String accountId,
            String description,
            @NotNull BigDecimal quantity,
            @NotNull BigDecimal unitPrice) {
    }
}
