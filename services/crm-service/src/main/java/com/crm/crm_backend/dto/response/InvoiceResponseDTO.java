package com.crm.crm_backend.dto.response;


import com.crm.crm_backend.model.enums.InvoiceStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class InvoiceResponseDTO {

    private Long id;

    private String invoiceNumber;

    private Long salesOrderId;

    private Long customerId;

    private InvoiceStatus status;

    private LocalDate invoiceDate;

    private LocalDate dueDate;

    private BigDecimal subtotal;

    private BigDecimal taxAmount;

    private BigDecimal discountAmount;

    private BigDecimal totalAmount;

    private BigDecimal paidAmount;

    private BigDecimal balanceAmount;

    private String currency;

    private String notes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
