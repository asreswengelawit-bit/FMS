package com.crm.crm_backend.event.publisher;

import com.crm.crm_backend.config.CrmRabbitMQConfig;
import com.crm.crm_backend.event.CrmRoutingKeys;
import com.crm.crm_backend.event.dto.DomainEventMessage;
import com.crm.crm_backend.model.entity.OrderItem;
import com.crm.crm_backend.model.entity.SalesOrder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishSalesOrderConfirmed(SalesOrder order) {
        Map<String, Object> data = new HashMap<>();
        data.put("orderId", order.getId());
        data.put("orderNumber", order.getOrderNumber());
        data.put("customerId", order.getCustomer() != null ? order.getCustomer().getId() : null);
        data.put("quotationId", order.getQuotation() != null ? order.getQuotation().getId() : null);
        data.put("totalAmount", order.getTotalAmount());
        data.put("status", order.getStatus() != null ? order.getStatus().name() : null);

        List<Map<String, Object>> items = new ArrayList<>();
        if (order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                Map<String, Object> line = new HashMap<>();
                String sku = item.getSku() != null && !item.getSku().isBlank()
                        ? item.getSku()
                        : ("ITEM-" + (item.getId() != null ? item.getId() : item.getItemName()));
                line.put("sku", sku);
                line.put("itemName", item.getItemName());
                line.put("quantity", item.getQuantity());
                line.put("unitPrice", item.getUnitPrice());
                line.put("totalPrice", item.getTotalPrice());
                items.add(line);
            }
        }
        data.put("items", items);

        if (!items.isEmpty()) {
            Map<String, Object> first = items.getFirst();
            data.put("sku", first.get("sku"));
            data.put("quantity", first.get("quantity"));
            data.put("productSku", first.get("sku"));
        }

        publish(CrmRoutingKeys.SALES_ORDER_CONFIRMED, data);
    }

    private void publish(String routingKey, Map<String, Object> data) {
        DomainEventMessage message = DomainEventMessage.builder()
                .eventName(routingKey)
                .source("crm-backend")
                .occurredAt(LocalDateTime.now())
                .data(data)
                .build();

        rabbitTemplate.convertAndSend(CrmRabbitMQConfig.ERP_EVENTS_EXCHANGE, routingKey, message);
        log.info("Published event {} for order {}", routingKey, data.get("orderNumber"));
    }
}
