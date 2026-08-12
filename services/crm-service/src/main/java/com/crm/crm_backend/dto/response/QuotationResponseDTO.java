package com.crm.crm_backend.dto.response;


import com.crm.crm_backend.model.enums.QuotationStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class QuotationResponseDTO {

    private Long id;

    private String quotationNumber;

    private Long customerId;

    private Long opportunityId;

    private LocalDate issueDate;

    private LocalDate expiryDate;

    private BigDecimal subtotal;

    private BigDecimal discount;

    private BigDecimal tax;

    private BigDecimal totalAmount;

    private QuotationStatus status;

    private String notes;

    private Boolean active;

    private Long salesOrderId;

    private List<QuotationItemResponseDTO> items;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}