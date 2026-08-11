package com.crm.crm_backend.integration.client;

import com.crm.crm_backend.config.properties.IntegrationProperties;
import com.crm.crm_backend.integration.fallback.FmsClientFallback;
import com.crm.crm_backend.integration.fallback.MmsClientFallback;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class IntegrationFailClosedTest {

    @Mock
    private WebClient.Builder webClientBuilder;
    @Mock
    private MmsClientFallback mmsClientFallback;
    @Mock
    private FmsClientFallback fmsClientFallback;

    private IntegrationProperties properties;
    private MmsClient mmsClient;
    private FmsClient fmsClient;

    @BeforeEach
    void setUp() {
        properties = new IntegrationProperties();
        properties.getMms().setEnabled(false);
        properties.getMms().setAllowFallback(false);
        properties.getFms().setEnabled(false);
        properties.getFms().setAllowFallback(false);

        mmsClient = new MmsClient(webClientBuilder, properties, mmsClientFallback);
        fmsClient = new FmsClient(webClientBuilder, properties, fmsClientFallback);
    }

    @Test
    void mmsReserveRefusesWhenDisabledAndFallbackOff() {
        boolean reserved = mmsClient.reserveStock("SKU-1", BigDecimal.ONE, "SO-1");
        assertFalse(reserved);
    }

    @Test
    void mmsReserveUsesFallbackWhenAllowed() {
        properties.getMms().setAllowFallback(true);
        when(mmsClientFallback.fallbackReserve(anyString(), any(), anyString())).thenReturn(true);

        boolean reserved = mmsClient.reserveStock("SKU-1", BigDecimal.ONE, "SO-1");
        assertTrue(reserved);
    }

    @Test
    void fmsPostInvoiceEmptyWhenDisabledAndFallbackOff() {
        assertTrue(fmsClient.postInvoice("INV-1", new BigDecimal("10"), "ETB").isEmpty());
    }

    @Test
    void fmsRecordPaymentEmptyWhenDisabledAndFallbackOff() {
        assertTrue(fmsClient.recordPayment("PAY-1", new BigDecimal("10")).isEmpty());
    }

    @Test
    void mmsGetStockEmptyWhenDisabledAndFallbackOff() {
        assertTrue(mmsClient.getStock("SKU-1").isEmpty());
    }
}
