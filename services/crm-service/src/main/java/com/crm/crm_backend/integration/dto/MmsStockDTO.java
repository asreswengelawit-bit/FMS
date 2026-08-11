package com.crm.crm_backend.integration.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MmsStockDTO {

    private Long itemId;
    private String sku;
    private BigDecimal availableQuantity;
    private String warehouseCode;
}
