package com.crm.crm_backend.integration.client;

import com.crm.crm_backend.config.properties.IntegrationProperties;
import com.crm.crm_backend.exception.IntegrationException;
import com.crm.crm_backend.integration.dto.FmsInvoiceDTO;
import com.crm.crm_backend.integration.dto.FmsTransactionDTO;
import com.crm.crm_backend.integration.fallback.FmsClientFallback;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class FmsClient {

    private final WebClient.Builder webClientBuilder;
    private final IntegrationProperties integrationProperties;
    private final FmsClientFallback fmsClientFallback;

    public Optional<FmsInvoiceDTO> postInvoice(String invoiceNumber, BigDecimal amount, String currency) {
        if (!integrationProperties.getFms().isEnabled()) {
            return disabledOrFallbackInvoice(invoiceNumber, amount, currency);
        }
        try {
            FmsInvoiceDTO posted = webClientBuilder.build()
                    .post()
                    .uri(integrationProperties.getFms().getBaseUrl() + "/api/fms/invoices")
                    .bodyValue(Map.of(
                            "invoiceNumber", invoiceNumber,
                            "amount", amount,
                            "currency", currency == null ? "ETB" : currency
                    ))
                    .retrieve()
                    .bodyToMono(FmsInvoiceDTO.class)
                    .block();
            return Optional.ofNullable(posted);
        } catch (Exception ex) {
            log.warn("FMS postInvoice failed for {}: {}", invoiceNumber, ex.getMessage());
            return failClosedOrFallbackInvoice(invoiceNumber, amount, currency, ex);
        }
    }

    public Optional<FmsTransactionDTO> recordPayment(String reference, BigDecimal amount) {
        if (!integrationProperties.getFms().isEnabled()) {
            return disabledOrFallbackPayment(reference, amount);
        }
        try {
            FmsTransactionDTO tx = webClientBuilder.build()
                    .post()
                    .uri(integrationProperties.getFms().getBaseUrl() + "/api/fms/payments")
                    .bodyValue(Map.of(
                            "reference", reference,
                            "amount", amount,
                            "type", "PAYMENT"
                    ))
                    .retrieve()
                    .bodyToMono(FmsTransactionDTO.class)
                    .block();
            return Optional.ofNullable(tx);
        } catch (Exception ex) {
            log.warn("FMS recordPayment failed for {}: {}", reference, ex.getMessage());
            return failClosedOrFallbackPayment(reference, amount, ex);
        }
    }

    private Optional<FmsInvoiceDTO> disabledOrFallbackInvoice(
            String invoiceNumber, BigDecimal amount, String currency) {
        if (integrationProperties.getFms().isAllowFallback()) {
            return Optional.ofNullable(fmsClientFallback.fallbackInvoice(invoiceNumber, amount, currency));
        }
        return Optional.empty();
    }

    private Optional<FmsTransactionDTO> disabledOrFallbackPayment(String reference, BigDecimal amount) {
        if (integrationProperties.getFms().isAllowFallback()) {
            return Optional.ofNullable(fmsClientFallback.fallbackPayment(reference, amount));
        }
        return Optional.empty();
    }

    private Optional<FmsInvoiceDTO> failClosedOrFallbackInvoice(
            String invoiceNumber, BigDecimal amount, String currency, Exception ex) {
        if (integrationProperties.getFms().isAllowFallback()) {
            return Optional.ofNullable(fmsClientFallback.fallbackInvoice(invoiceNumber, amount, currency));
        }
        throw new IntegrationException(
                "FMS postInvoice failed and fallback is disabled: " + invoiceNumber, ex);
    }

    private Optional<FmsTransactionDTO> failClosedOrFallbackPayment(
            String reference, BigDecimal amount, Exception ex) {
        if (integrationProperties.getFms().isAllowFallback()) {
            return Optional.ofNullable(fmsClientFallback.fallbackPayment(reference, amount));
        }
        throw new IntegrationException(
                "FMS recordPayment failed and fallback is disabled: " + reference, ex);
    }
}
