package com.crm.crm_backend.notification.SmsService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * SMS is disabled by default. Kept as a stub for a future provider integration.
 */
@Service
@Slf4j
public class SmsService {

    @Value("${crm.notification.sms.enabled:false}")
    private boolean enabled;

    @Value("${crm.notification.sms.provider:log}")
    private String provider;

    public boolean send(String phoneNumber, String message) {
        if (!enabled) {
            log.debug("SMS disabled — skipped to={}", phoneNumber);
            return false;
        }

        log.info("SMS SENT via provider={} to={} message={}", provider, phoneNumber, message);
        return true;
    }
}
