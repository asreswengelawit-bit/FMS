package com.company.mms.event;

import java.time.Instant;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class MmsEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(MmsEventPublisher.class);

    public void publishStockReceived(StockReceivedEvent.Data data) {
        StockReceivedEvent event = new StockReceivedEvent(
                UUID.randomUUID().toString(),
                "StockReceived",
                Instant.now(),
                "mms-service",
                data
        );
        log.info("Published StockReceived event: {}", event);
    }
}
