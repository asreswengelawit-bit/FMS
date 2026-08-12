package com.crm.crm_backend.validator;

import com.crm.crm_backend.model.entity.Invoice;
import com.crm.crm_backend.model.enums.InvoiceStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

class PaymentValidatorTest {

    private PaymentValidator validator;
    private Invoice invoice;

    @BeforeEach
    void setUp() {
        validator = new PaymentValidator();
        invoice = new Invoice();
        invoice.setStatus(InvoiceStatus.PENDING);
        invoice.setTotalAmount(new BigDecimal("1000"));
        invoice.setBalanceAmount(new BigDecimal("1000"));
    }

    @Test
    void acceptsPaymentLessOrEqualToBalance() {
        assertDoesNotThrow(() ->
                validator.validatePaymentAmount(invoice, new BigDecimal("500")));
        assertDoesNotThrow(() ->
                validator.validatePaymentAmount(invoice, new BigDecimal("1000")));
    }

    @Test
    void rejectsPaymentGreaterThanBalance() {
        assertThrows(IllegalStateException.class, () ->
                validator.validatePaymentAmount(invoice, new BigDecimal("1000.01")));
    }

    @Test
    void rejectsZeroOrNegative() {
        assertThrows(IllegalStateException.class, () ->
                validator.validatePaymentAmount(invoice, BigDecimal.ZERO));
        assertThrows(IllegalStateException.class, () ->
                validator.validatePaymentAmount(invoice, new BigDecimal("-1")));
    }

    @Test
    void rejectsFullyPaidInvoice() {
        invoice.setStatus(InvoiceStatus.PAID);
        invoice.setBalanceAmount(BigDecimal.ZERO);
        assertThrows(IllegalStateException.class, () ->
                validator.validatePaymentAmount(invoice, new BigDecimal("10")));
    }
}
