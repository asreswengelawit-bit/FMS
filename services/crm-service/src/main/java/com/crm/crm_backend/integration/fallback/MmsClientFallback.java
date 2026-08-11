package com.crm.crm_backend.integration.fallback;

import com.crm.crm_backend.integration.dto.MmsItemDTO;
import com.crm.crm_backend.integration.dto.MmsStockDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@Slf4j
public class MmsClientFallback {

    public MmsItemDTO fallbackItem(String sku) {
        log.warn("Using MMS fallback item for sku={}", sku);
        return MmsItemDTO.builder()
                .sku(sku)
                .name("FALLBACK-" + sku)
                .unit("EA")
                .active(true)
                .build();
    }

    public MmsStockDTO fallbackStock(String sku) {
        log.warn("Using MMS fallback stock for sku={}", sku);
        return MmsStockDTO.builder()
                .sku(sku)
                .availableQuantity(BigDecimal.ZERO)
                .warehouseCode("FALLBACK")
                .build();
    }

    public boolean fallbackReserve(String sku, BigDecimal quantity, String orderReference) {
        log.warn("MMS unavailable — queued reserve sku={} qty={} order={}", sku, quantity, orderReference);
        return false;
    }
}
