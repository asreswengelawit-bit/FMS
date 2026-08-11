package com.crm.crm_backend.validator;

import com.crm.crm_backend.model.entity.Invoice;
import com.crm.crm_backend.model.enums.InvoiceStatus;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class PaymentValidator {

    public void validatePaymentAmount(Invoice invoice, BigDecimal paymentAmount) {
        if (paymentAmount == null || paymentAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalStateException("Payment amount must be greater than zero");
        }
        if (invoice.getStatus() == InvoiceStatus.CANCELLED) {
            throw new IllegalStateException("Cannot pay a cancelled invoice");
        }
        if (invoice.getStatus() == InvoiceStatus.PAID
                || (invoice.getBalanceAmount() != null
                && invoice.getBalanceAmount().compareTo(BigDecimal.ZERO) <= 0)) {
            throw new IllegalStateException("Invoice is already fully paid");
        }

        BigDecimal balance = invoice.getBalanceAmount() != null
                ? invoice.getBalanceAmount()
                : invoice.getTotalAmount();

        if (paymentAmount.compareTo(balance) > 0) {
            throw new IllegalStateException(
                    "Payment amount " + paymentAmount + " exceeds invoice balance " + balance);
        }
    }
}
