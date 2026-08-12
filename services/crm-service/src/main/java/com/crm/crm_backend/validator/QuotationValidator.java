package com.crm.crm_backend.validator;

import com.crm.crm_backend.dto.request.QuotationCreateDTO;
import com.crm.crm_backend.dto.request.QuotationItemRequestDTO;
import com.crm.crm_backend.model.entity.Quotation;
import com.crm.crm_backend.model.enums.QuotationStatus;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
public class QuotationValidator {

    public void validateCreate(QuotationCreateDTO dto) {
        validateDates(dto.getIssueDate(), dto.getExpiryDate());
        assertNonNegative("subtotal", dto.getSubtotal());
        assertNonNegative("discount", dto.getDiscount());
        assertNonNegative("tax", dto.getTax());
        assertNonNegative("totalAmount", dto.getTotalAmount());
        validateItems(dto.getItems());
    }

    public void validateCanAccept(Quotation quotation) {
        if (quotation == null) {
            throw new IllegalStateException("Quotation is required");
        }
        if (quotation.getStatus() == QuotationStatus.EXPIRED
                || (quotation.getExpiryDate() != null
                && quotation.getExpiryDate().isBefore(LocalDate.now()))) {
            throw new IllegalStateException("Cannot accept an expired quotation");
        }
        if (quotation.getStatus() == QuotationStatus.REJECTED
                || quotation.getStatus() == QuotationStatus.CANCELLED) {
            throw new IllegalStateException(
                    "Cannot accept a quotation in status " + quotation.getStatus());
        }
        if (quotation.getTotalAmount() != null
                && quotation.getTotalAmount().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalStateException("Quotation total cannot be negative");
        }
    }

    public void validateDates(LocalDate issueDate, LocalDate expiryDate) {
        if (issueDate != null && expiryDate != null && expiryDate.isBefore(issueDate)) {
            throw new IllegalStateException("Quotation expiry date cannot be before issue date");
        }
    }

    public void validateItems(List<QuotationItemRequestDTO> items) {
        if (items == null) {
            return;
        }
        for (QuotationItemRequestDTO item : items) {
            if (item.getQuantity() != null && item.getQuantity() <= 0) {
                throw new IllegalStateException("Quotation item quantity must be greater than zero");
            }
            if (item.getUnitPrice() != null && item.getUnitPrice().compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalStateException("Quotation item unit price cannot be negative");
            }
        }
    }

    private void assertNonNegative(String field, BigDecimal value) {
        if (value != null && value.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalStateException(field + " cannot be negative");
        }
    }
}
