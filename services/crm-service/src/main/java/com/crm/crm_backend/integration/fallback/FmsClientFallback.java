package com.crm.crm_backend.integration.fallback;

import com.crm.crm_backend.integration.dto.FmsInvoiceDTO;
import com.crm.crm_backend.integration.dto.FmsTransactionDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@Slf4j
public class FmsClientFallback {

    public FmsInvoiceDTO fallbackInvoice(String invoiceNumber, BigDecimal amount, String currency) {
        log.warn("Using FMS fallback invoice for {}", invoiceNumber);
        return FmsInvoiceDTO.builder()
                .invoiceNumber(invoiceNumber)
                .amount(amount)
                .currency(currency == null ? "ETB" : currency)
                .status("PENDING_SYNC")
                .postedAt(LocalDateTime.now())
                .build();
    }

    public FmsTransactionDTO fallbackPayment(String reference, BigDecimal amount) {
        log.warn("Using FMS fallback payment for {}", reference);
        return FmsTransactionDTO.builder()
                .reference(reference)
                .amount(amount)
                .type("PAYMENT")
                .status("PENDING_SYNC")
                .recordedAt(LocalDateTime.now())
                .build();
    }
}
