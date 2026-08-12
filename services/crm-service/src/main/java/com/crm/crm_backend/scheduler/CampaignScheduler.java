package com.crm.crm_backend.scheduler;

import com.crm.crm_backend.service.core.CampaignService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Daily campaign lifecycle: activate reached start dates, complete past end dates.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CampaignScheduler {

    private final CampaignService campaignService;

    @Scheduled(cron = "${crm.scheduler.campaign.cron:0 0 1 * * *}")
    public void processCampaignLifecycle() {
        log.debug("Running campaign lifecycle scheduler");
        campaignService.processScheduledTransitions();
    }
}
