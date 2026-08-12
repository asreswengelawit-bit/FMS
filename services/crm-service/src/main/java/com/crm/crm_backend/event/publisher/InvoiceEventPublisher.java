package com.crm.crm_backend.event.publisher;

import com.crm.crm_backend.config.CrmRabbitMQConfig;
import com.crm.crm_backend.event.CrmRoutingKeys;
import com.crm.crm_backend.event.dto.DomainEventMessage;
import com.crm.crm_backend.model.entity.Invoice;
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
public class InvoiceEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishInvoiceCreated(Invoice invoice) {
        Map<String, Object> data = new HashMap<>();
        data.put("invoiceId", invoice.getId());
        data.put("invoiceNumber", invoice.getInvoiceNumber());
        data.put("customerId", invoice.getCustomer() != null ? invoice.getCustomer().getId() : null);
        data.put("salesOrderId", invoice.getSalesOrder() != null ? invoice.getSalesOrder().getId() : null);
        data.put("totalAmount", invoice.getTotalAmount());
        data.put("status", invoice.getStatus() != null ? invoice.getStatus().name() : null);

        DomainEventMessage message = DomainEventMessage.builder()
                .eventName(CrmRoutingKeys.INVOICE_CREATED)
                .source("crm-backend")
                .occurredAt(LocalDateTime.now())
                .data(data)
                .build();

        rabbitTemplate.convertAndSend(
                CrmRabbitMQConfig.ERP_EVENTS_EXCHANGE,
                CrmRoutingKeys.INVOICE_CREATED,
                message);

        log.info("Published event {} for invoice {}", CrmRoutingKeys.INVOICE_CREATED, invoice.getInvoiceNumber());
    }

    public void publishInvoiceOverdueReminder(Invoice invoice) {
        Map<String, Object> data = new HashMap<>();
        data.put("invoiceId", invoice.getId());
        data.put("invoiceNumber", invoice.getInvoiceNumber());
        data.put("customerId", invoice.getCustomer() != null ? invoice.getCustomer().getId() : null);
        data.put("customerEmail", invoice.getCustomer() != null ? invoice.getCustomer().getEmail() : null);
        data.put("dueDate", invoice.getDueDate() != null ? invoice.getDueDate().toString() : null);
        data.put("balanceAmount", invoice.getBalanceAmount());
        data.put("totalAmount", invoice.getTotalAmount());
        data.put("status", invoice.getStatus() != null ? invoice.getStatus().name() : null);

        DomainEventMessage message = DomainEventMessage.builder()
                .eventName(CrmRoutingKeys.INVOICE_OVERDUE_REMINDER)
                .source("crm-backend")
                .occurredAt(LocalDateTime.now())
                .data(data)
                .build();

        rabbitTemplate.convertAndSend(
                CrmRabbitMQConfig.ERP_EVENTS_EXCHANGE,
                CrmRoutingKeys.INVOICE_OVERDUE_REMINDER,
                message);

        log.info("Published event {} for invoice {}",
                CrmRoutingKeys.INVOICE_OVERDUE_REMINDER, invoice.getInvoiceNumber());
    }
}
