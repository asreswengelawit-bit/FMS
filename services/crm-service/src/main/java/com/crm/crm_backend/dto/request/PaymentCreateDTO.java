package com.crm.crm_backend.dto.request;


import com.crm.crm_backend.model.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PaymentCreateDTO {

    @NotNull
    private Long invoiceId;

    @NotNull
    private Long customerId;

    @NotNull
    private PaymentMethod paymentMethod;

    @NotNull
    private BigDecimal amount;

    private LocalDate paymentDate;

    private String transactionReference;

    private String receivedBy;

    private String notes;
}