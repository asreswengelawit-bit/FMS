package com.crm.crm_backend.event.listener;

import com.crm.crm_backend.config.CrmRabbitMQConfig;
import com.crm.crm_backend.event.CrmRoutingKeys;
import com.crm.crm_backend.event.dto.DomainEventMessage;
import com.crm.crm_backend.service.integration.FmsIntegrationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class FinanceEventListener {

    private final FmsIntegrationService fmsIntegrationService;

    @RabbitListener(queues = CrmRabbitMQConfig.FINANCE_QUEUE)
    public void handleFinanceEvent(DomainEventMessage event) {
        log.info("Finance consumer received event={}", event.getEventName());
        Map<String, Object> data = event.getData();
        if (data == null) {
            return;
        }

        if (CrmRoutingKeys.INVOICE_CREATED.equals(event.getEventName())) {
            String invoiceNumber = stringVal(data.get("invoiceNumber"));
            BigDecimal amount = decimalVal(data.getOrDefault("amount", data.get("totalAmount")));
            String currency = stringVal(data.getOrDefault("currency", "ETB"));
            if (invoiceNumber != null && amount != null) {
                fmsIntegrationService.syncInvoice(invoiceNumber, amount, currency)
                        .ifPresent(dto -> log.info("FMS invoice sync status={} number={}",
                                dto.getStatus(), dto.getInvoiceNumber()));
            }
        } else if (CrmRoutingKeys.PAYMENT_RECEIVED.equals(event.getEventName())) {
            String reference = stringVal(data.getOrDefault("reference",
                    data.getOrDefault("paymentNumber", data.get("paymentId"))));
            BigDecimal amount = decimalVal(data.get("amount"));
            if (reference != null && amount != null) {
                fmsIntegrationService.syncPayment(reference, amount)
                        .ifPresent(dto -> log.info("FMS payment sync status={} ref={}",
                                dto.getStatus(), dto.getReference()));
            }
        }
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
