package com.crm.crm_backend.service.integration;

import com.crm.crm_backend.integration.client.MmsClient;
import com.crm.crm_backend.integration.dto.MmsItemDTO;
import com.crm.crm_backend.integration.dto.MmsStockDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MmsIntegrationService {

    private final MmsClient mmsClient;

    public Optional<MmsItemDTO> getItem(String sku) {
        return mmsClient.getItemBySku(sku);
    }

    public Optional<MmsStockDTO> getStock(String sku) {
        return mmsClient.getStock(sku);
    }

    public boolean reserveForOrder(String sku, BigDecimal quantity, String orderReference) {
        return mmsClient.reserveStock(sku, quantity, orderReference);
    }
}
