package com.crm.crm_backend.validator;

import com.crm.crm_backend.model.entity.Quotation;
import com.crm.crm_backend.model.enums.QuotationStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

class QuotationValidatorTest {

    private QuotationValidator validator;

    @BeforeEach
    void setUp() {
        validator = new QuotationValidator();
    }

    @Test
    void acceptAllowedWhenNotExpired() {
        Quotation quotation = new Quotation();
        quotation.setStatus(QuotationStatus.SENT);
        quotation.setExpiryDate(LocalDate.now().plusDays(7));
        quotation.setTotalAmount(new BigDecimal("100"));

        assertDoesNotThrow(() -> validator.validateCanAccept(quotation));
    }

    @Test
    void rejectAcceptWhenExpiredByDate() {
        Quotation quotation = new Quotation();
        quotation.setStatus(QuotationStatus.SENT);
        quotation.setExpiryDate(LocalDate.now().minusDays(1));
        quotation.setTotalAmount(new BigDecimal("100"));

        assertThrows(IllegalStateException.class, () -> validator.validateCanAccept(quotation));
    }

    @Test
    void rejectAcceptWhenStatusExpired() {
        Quotation quotation = new Quotation();
        quotation.setStatus(QuotationStatus.EXPIRED);
        quotation.setExpiryDate(LocalDate.now().plusDays(1));

        assertThrows(IllegalStateException.class, () -> validator.validateCanAccept(quotation));
    }

    @Test
    void rejectInvalidDatesOnCreate() {
        var dto = new com.crm.crm_backend.dto.request.QuotationCreateDTO();
        dto.setCustomerId(1L);
        dto.setOpportunityId(1L);
        dto.setIssueDate(LocalDate.now());
        dto.setExpiryDate(LocalDate.now().minusDays(1));

        assertThrows(IllegalStateException.class, () -> validator.validateCreate(dto));
    }
}
