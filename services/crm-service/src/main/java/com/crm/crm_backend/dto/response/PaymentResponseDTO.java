package com.crm.crm_backend.dto.response;


import com.crm.crm_backend.model.enums.PaymentMethod;
import com.crm.crm_backend.model.enums.PaymentStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class PaymentResponseDTO {

    private Long id;

    private String paymentNumber;

    private Long invoiceId;

    private Long customerId;

    private PaymentMethod paymentMethod;

    private PaymentStatus status;

    private BigDecimal amount;

    private LocalDate paymentDate;

    private String transactionReference;

    private String receivedBy;

    private String notes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}