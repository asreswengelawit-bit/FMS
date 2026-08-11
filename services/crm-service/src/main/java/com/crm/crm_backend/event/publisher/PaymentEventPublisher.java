package com.crm.crm_backend.event.publisher;

import com.crm.crm_backend.config.CrmRabbitMQConfig;
import com.crm.crm_backend.event.CrmRoutingKeys;
import com.crm.crm_backend.event.dto.DomainEventMessage;
import com.crm.crm_backend.model.entity.Payment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishPaymentReceived(Payment payment) {
        Map<String, Object> data = new HashMap<>();
        data.put("paymentId", payment.getId());
        data.put("paymentNumber", payment.getPaymentNumber());
        data.put("invoiceId", payment.getInvoice() != null ? payment.getInvoice().getId() : null);
        data.put("customerId", payment.getCustomer() != null ? payment.getCustomer().getId() : null);
        data.put("amount", payment.getAmount());
        data.put("status", payment.getStatus() != null ? payment.getStatus().name() : null);

        DomainEventMessage message = DomainEventMessage.builder()
                .eventName(CrmRoutingKeys.PAYMENT_RECEIVED)
                .source("crm-backend")
                .occurredAt(LocalDateTime.now())
                .data(data)
                .build();

        rabbitTemplate.convertAndSend(
                CrmRabbitMQConfig.ERP_EVENTS_EXCHANGE,
                CrmRoutingKeys.PAYMENT_RECEIVED,
                message);

        log.info("Published event {} for payment {}", CrmRoutingKeys.PAYMENT_RECEIVED, payment.getPaymentNumber());
    }
}
