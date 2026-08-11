package com.crm.crm_backend.dto.request;


import com.crm.crm_backend.model.enums.PaymentStatus;
import lombok.Data;

@Data
public class PaymentUpdateDTO {

    private PaymentStatus status;

    private String transactionReference;

    private String receivedBy;

    private String notes;
}
