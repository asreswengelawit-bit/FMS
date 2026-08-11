package com.crm.crm_backend.service.integration;

import com.crm.crm_backend.integration.client.FmsClient;
import com.crm.crm_backend.integration.dto.FmsInvoiceDTO;
import com.crm.crm_backend.integration.dto.FmsTransactionDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FmsIntegrationService {

    private final FmsClient fmsClient;

    public Optional<FmsInvoiceDTO> syncInvoice(String invoiceNumber, BigDecimal amount, String currency) {
        return fmsClient.postInvoice(invoiceNumber, amount, currency);
    }

    public Optional<FmsTransactionDTO> syncPayment(String reference, BigDecimal amount) {
        return fmsClient.recordPayment(reference, amount);
    }
}
