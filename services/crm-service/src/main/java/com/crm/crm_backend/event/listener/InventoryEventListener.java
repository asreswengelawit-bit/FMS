package com.crm.crm_backend.event.listener;

import com.crm.crm_backend.config.CrmRabbitMQConfig;
import com.crm.crm_backend.event.dto.DomainEventMessage;
import com.crm.crm_backend.service.integration.MmsIntegrationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class InventoryEventListener {

    private final MmsIntegrationService mmsIntegrationService;

    @RabbitListener(queues = CrmRabbitMQConfig.INVENTORY_QUEUE)
    public void handleInventoryEvent(DomainEventMessage event) {
        log.info("Inventory/MMS consumer received event={}", event.getEventName());
        Map<String, Object> data = event.getData();
        if (data == null) {
            return;
        }

        String orderReference = stringVal(data.getOrDefault("orderNumber", data.get("salesOrderId")));

        Object itemsObj = data.get("items");
        if (itemsObj instanceof List<?> items && !items.isEmpty()) {
            for (Object raw : items) {
                if (raw instanceof Map<?, ?> line) {
                    reserveLine(line, orderReference);
                }
            }
            return;
        }

        String sku = stringVal(data.getOrDefault("sku", data.get("productSku")));
        BigDecimal quantity = decimalVal(data.getOrDefault("quantity", BigDecimal.ONE));
        reserveSku(sku, quantity, orderReference);
    }

    private void reserveLine(Map<?, ?> line, String orderReference) {
        String sku = stringVal(line.get("sku"));
        BigDecimal quantity = decimalVal(line.get("quantity"));
        reserveSku(sku, quantity, orderReference);
    }

    private void reserveSku(String sku, BigDecimal quantity, String orderReference) {
        if (sku == null) {
            return;
        }

        mmsIntegrationService.getStock(sku)
                .ifPresent(stock -> log.info("MMS stock sku={} available={}",
                        stock.getSku(), stock.getAvailableQuantity()));

        boolean reserved = mmsIntegrationService.reserveForOrder(
                sku,
                quantity == null ? BigDecimal.ONE : quantity,
                orderReference == null ? "UNKNOWN" : orderReference);
        log.info("MMS reserve result sku={} reserved={}", sku, reserved);
    }

    private String stringVal(Object value) {
        return value == null ? null : String.valueOf(value);
    }

    private BigDecimal decimalVal(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof BigDecimal bd) {
            return bd;
        }
        if (value instanceof Number number) {
            return BigDecimal.valueOf(number.doubleValue());
        }
        try {
            return new BigDecimal(String.valueOf(value));
        } catch (NumberFormatException ex) {
            return null;
        }
    }
}
