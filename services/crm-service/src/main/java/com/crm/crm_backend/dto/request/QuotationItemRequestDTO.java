package com.crm.crm_backend.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class QuotationItemRequestDTO {

    private String itemName;

    private String sku;

    private String description;

    private Integer quantity;

    private BigDecimal unitPrice;
}
