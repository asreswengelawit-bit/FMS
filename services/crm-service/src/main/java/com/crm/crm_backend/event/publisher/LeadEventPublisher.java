package com.crm.crm_backend.event.publisher;

import com.crm.crm_backend.config.CrmRabbitMQConfig;
import com.crm.crm_backend.event.CrmRoutingKeys;
import com.crm.crm_backend.event.dto.DomainEventMessage;
import com.crm.crm_backend.model.entity.Lead;
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
public class LeadEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishLeadCreated(Lead lead) {
        publish(CrmRoutingKeys.LEAD_CREATED, lead);
    }

    public void publishLeadQualified(Lead lead) {
        publish(CrmRoutingKeys.LEAD_QUALIFIED, lead);
    }

    public void publishLeadConverted(Lead lead) {
        publish(CrmRoutingKeys.LEAD_CONVERTED, lead);
    }

    private void publish(String routingKey, Lead lead) {
        Map<String, Object> data = new HashMap<>();
        data.put("leadId", lead.getId());
        data.put("email", lead.getEmail());
        data.put("status", lead.getStatus() != null ? lead.getStatus().name() : null);
        data.put("assignedTo", lead.getAssignedTo());

        DomainEventMessage message = DomainEventMessage.builder()
                .eventName(routingKey)
                .source("crm-backend")
                .occurredAt(LocalDateTime.now())
                .data(data)
                .build();

        rabbitTemplate.convertAndSend(CrmRabbitMQConfig.ERP_EVENTS_EXCHANGE, routingKey, message);
        log.info("Published event {} for lead {}", routingKey, lead.getId());
    }
}
