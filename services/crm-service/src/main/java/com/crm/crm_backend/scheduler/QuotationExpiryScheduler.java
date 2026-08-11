package com.crm.crm_backend.scheduler;

import com.crm.crm_backend.service.core.QuotationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class QuotationExpiryScheduler {

    private final QuotationService quotationService;

    @Scheduled(cron = "${crm.scheduler.quotation-expiry.cron:0 15 1 * * *}")
    public void expirePastDueQuotations() {
        log.debug("Running quotation expiry scheduler");
        quotationService.expirePastDueQuotations();
    }
}
