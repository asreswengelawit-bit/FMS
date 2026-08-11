package com.crm.crm_backend.integration.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MmsItemDTO {

    private Long itemId;
    private String sku;
    private String name;
    private String unit;
    private boolean active;
}
