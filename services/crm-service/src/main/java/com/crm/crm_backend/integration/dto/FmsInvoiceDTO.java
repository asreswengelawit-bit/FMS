package com.crm.crm_backend.integration.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FmsInvoiceDTO {

    private Long invoiceId;
    private String invoiceNumber;
    private BigDecimal amount;
    private String currency;
    private String status;
    private LocalDateTime postedAt;
}
