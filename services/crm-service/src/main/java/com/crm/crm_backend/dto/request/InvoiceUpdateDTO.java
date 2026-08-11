package com.crm.crm_backend.dto.request;


import com.crm.crm_backend.model.enums.InvoiceStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class InvoiceUpdateDTO {

    private InvoiceStatus status;

    private LocalDate dueDate;

    private BigDecimal paidAmount;

    private String notes;
}