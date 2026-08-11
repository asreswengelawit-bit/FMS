package com.crm.crm_backend.event.listener;

import com.crm.crm_backend.config.CrmRabbitMQConfig;
import com.crm.crm_backend.event.dto.DomainEventMessage;
import com.crm.crm_backend.notification.NotificationService.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationEventListener {

    private final NotificationService notificationService;

    @RabbitListener(queues = CrmRabbitMQConfig.NOTIFICATION_QUEUE)
    public void handleDomainEvent(DomainEventMessage event) {
        log.info("Notification consumer received event={}", event.getEventName());
        notificationService.handleDomainEvent(event);
    }
}
