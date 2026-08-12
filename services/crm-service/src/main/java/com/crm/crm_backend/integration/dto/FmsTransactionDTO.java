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
public class FmsTransactionDTO {

    private Long transactionId;
    private String reference;
    private BigDecimal amount;
    private String type;
    private String status;
    private LocalDateTime recordedAt;
}
