package com.crm.crm_backend.dto.request;


import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class InvoiceCreateDTO {

    @NotNull
    private Long salesOrderId;

    @NotNull
    private Long customerId;

    private LocalDate invoiceDate;

    private LocalDate dueDate;

    private BigDecimal taxAmount;

    private BigDecimal discountAmount;

    private String currency;

    private String notes;
}