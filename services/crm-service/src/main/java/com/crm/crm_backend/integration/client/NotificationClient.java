package com.crm.crm_backend.integration.client;

import com.crm.crm_backend.integration.dto.NotificationDTO;
import com.crm.crm_backend.integration.fallback.NotificationClientFallback;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationClient {

    private final NotificationClientFallback notificationClientFallback;

    public NotificationDTO sendEmail(String recipient, String subject, String body) {
        log.info("NotificationClient dispatching email to {}", recipient);
        return notificationClientFallback.dispatchEmail(recipient, subject, body);
    }

    public NotificationDTO sendSms(String recipient, String body) {
        log.info("NotificationClient dispatching SMS to {}", recipient);
        return notificationClientFallback.dispatchSms(recipient, body);
    }
}
