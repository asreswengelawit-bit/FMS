package com.crm.crm_backend.event.publisher;

import com.crm.crm_backend.config.CrmRabbitMQConfig;
import com.crm.crm_backend.event.CrmRoutingKeys;
import com.crm.crm_backend.event.dto.DomainEventMessage;
import com.crm.crm_backend.model.entity.OrderItem;
import com.crm.crm_backend.model.entity.SalesOrder;
import com.crm.crm_backend.model.enums.OrderStatus;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class OrderEventPublisherTest {

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private OrderEventPublisher orderEventPublisher;

    @Test
    void publishSalesOrderConfirmedIncludesSkuAndQuantity() {
        SalesOrder order = SalesOrder.builder()
                .id(5L)
                .orderNumber("SO-100")
                .status(OrderStatus.APPROVED)
                .totalAmount(new BigDecimal("200"))
                .orderItems(new ArrayList<>())
                .build();

        order.getOrderItems().add(OrderItem.builder()
                .id(1L)
                .sku("SKU-ABC")
                .itemName("Widget")
                .quantity(3)
                .unitPrice(new BigDecimal("50"))
                .totalPrice(new BigDecimal("150"))
                .salesOrder(order)
                .build());

        orderEventPublisher.publishSalesOrderConfirmed(order);

        ArgumentCaptor<Object> payloadCaptor = ArgumentCaptor.forClass(Object.class);
        verify(rabbitTemplate).convertAndSend(
                eq(CrmRabbitMQConfig.ERP_EVENTS_EXCHANGE),
                eq(CrmRoutingKeys.SALES_ORDER_CONFIRMED),
                payloadCaptor.capture());

        DomainEventMessage message = assertInstanceOf(DomainEventMessage.class, payloadCaptor.getValue());
        Map<String, Object> data = message.getData();
        assertEquals("SKU-ABC", data.get("sku"));
        assertEquals(3, data.get("quantity"));
        assertEquals("SKU-ABC", data.get("productSku"));

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> items = (List<Map<String, Object>>) data.get("items");
        assertEquals(1, items.size());
        assertEquals("SKU-ABC", items.getFirst().get("sku"));
        assertEquals(3, items.getFirst().get("quantity"));
    }
}
