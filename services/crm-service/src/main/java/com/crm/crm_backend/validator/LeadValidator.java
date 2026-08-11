package com.crm.crm_backend.validator;

import com.crm.crm_backend.dto.request.LeadCreateDTO;
import com.crm.crm_backend.dto.request.LeadUpdateDTO;
import com.crm.crm_backend.model.entity.Lead;
import com.crm.crm_backend.model.enums.LeadStatus;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class LeadValidator {

    public void validateCreate(LeadCreateDTO dto) {
        if (dto.getFirstName() == null || dto.getFirstName().isBlank()) {
            throw new IllegalStateException("Lead first name is required");
        }
        if (dto.getLastName() == null || dto.getLastName().isBlank()) {
            throw new IllegalStateException("Lead last name is required");
        }
        if (dto.getEmail() != null && dto.getEmail().isBlank()) {
            throw new IllegalStateException("Lead email cannot be blank");
        }
        assertNonNegativeBudget(dto.getBudget());
    }

    public void validateUpdate(Lead existing, LeadUpdateDTO dto) {
        if (existing == null) {
            throw new IllegalStateException("Lead is required");
        }
        if (existing.getStatus() == LeadStatus.CONVERTED) {
            throw new IllegalStateException("Cannot update a converted lead");
        }
        if (dto.getBudget() != null) {
            assertNonNegativeBudget(dto.getBudget());
        }
    }

    public void validateCanConvert(Lead lead) {
        if (lead == null) {
            throw new IllegalStateException("Lead is required");
        }
        if (lead.getStatus() == LeadStatus.CONVERTED) {
            throw new IllegalStateException("Lead is already converted");
        }
        if (lead.getStatus() != LeadStatus.QUALIFIED) {
            throw new IllegalStateException("Lead must be QUALIFIED before conversion");
        }
    }

    private void assertNonNegativeBudget(BigDecimal budget) {
        if (budget != null && budget.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalStateException("Lead budget cannot be negative");
        }
    }
}
