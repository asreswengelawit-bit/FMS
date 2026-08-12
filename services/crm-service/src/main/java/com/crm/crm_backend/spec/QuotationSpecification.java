package com.crm.crm_backend.spec;

import com.crm.crm_backend.model.entity.Quotation;
import com.crm.crm_backend.model.enums.QuotationStatus;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public final class QuotationSpecification {

    private QuotationSpecification() {
    }

    public static Specification<Quotation> withFilters(
            String q,
            QuotationStatus status,
            Long customerId,
            Long opportunityId,
            LocalDate issueFrom,
            LocalDate issueTo,
            LocalDate expiryFrom,
            LocalDate expiryTo) {

        return Specification.where(textSearch(q))
                .and(hasStatus(status))
                .and(hasCustomer(customerId))
                .and(hasOpportunity(opportunityId))
                .and(issueBetween(issueFrom, issueTo))
                .and(expiryBetween(expiryFrom, expiryTo));
    }

    private static Specification<Quotation> textSearch(String q) {
        return (root, query, cb) -> {
            if (q == null || q.isBlank()) {
                return cb.conjunction();
            }
            String like = "%" + q.trim().toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("quotationNumber")), like),
                    cb.like(cb.lower(root.get("notes")), like)
            );
        };
    }

    private static Specification<Quotation> hasStatus(QuotationStatus status) {
        return (root, query, cb) -> status == null
                ? cb.conjunction()
                : cb.equal(root.get("status"), status);
    }

    private static Specification<Quotation> hasCustomer(Long customerId) {
        return (root, query, cb) -> customerId == null
                ? cb.conjunction()
                : cb.equal(root.get("customer").get("id"), customerId);
    }

    private static Specification<Quotation> hasOpportunity(Long opportunityId) {
        return (root, query, cb) -> opportunityId == null
                ? cb.conjunction()
                : cb.equal(root.get("opportunity").get("id"), opportunityId);
    }

    private static Specification<Quotation> issueBetween(LocalDate from, LocalDate to) {
        return (root, query, cb) -> {
            if (from == null && to == null) {
                return cb.conjunction();
            }
            if (from != null && to != null) {
                return cb.between(root.get("issueDate"), from, to);
            }
            if (from != null) {
                return cb.greaterThanOrEqualTo(root.get("issueDate"), from);
            }
            return cb.lessThanOrEqualTo(root.get("issueDate"), to);
        };
    }

    private static Specification<Quotation> expiryBetween(LocalDate from, LocalDate to) {
        return (root, query, cb) -> {
            if (from == null && to == null) {
                return cb.conjunction();
            }
            if (from != null && to != null) {
                return cb.between(root.get("expiryDate"), from, to);
            }
            if (from != null) {
                return cb.greaterThanOrEqualTo(root.get("expiryDate"), from);
            }
            return cb.lessThanOrEqualTo(root.get("expiryDate"), to);
        };
    }
}
