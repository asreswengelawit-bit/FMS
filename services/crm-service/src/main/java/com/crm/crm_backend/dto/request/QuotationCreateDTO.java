package com.crm.crm_backend.dto.request;


import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class QuotationCreateDTO {

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotNull(message = "Opportunity ID is required")
    private Long opportunityId;

    @NotNull(message = "Issue date is required")
    private LocalDate issueDate;

    @NotNull(message = "Expiry date is required")
    private LocalDate expiryDate;

    private BigDecimal subtotal;

    private BigDecimal discount;

    private BigDecimal tax;

    private BigDecimal totalAmount;

    private String notes;

    private List<QuotationItemRequestDTO> items;

    /**
     * When null/true, active pricing rules are applied to line (or header) amounts.
     * Set false to keep submitted unit prices as-is.
     */
    private Boolean applyPricingRules;
}