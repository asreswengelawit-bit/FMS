package com.crm.crm_backend.spec;

import com.crm.crm_backend.model.entity.Invoice;
import com.crm.crm_backend.model.enums.InvoiceStatus;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public final class InvoiceSpecification {

    private InvoiceSpecification() {
    }

    public static Specification<Invoice> withFilters(
            String q,
            InvoiceStatus status,
            Long customerId,
            Long salesOrderId,
            LocalDate dueFrom,
            LocalDate dueTo,
            LocalDate invoiceFrom,
            LocalDate invoiceTo) {

        return Specification.where(textSearch(q))
                .and(hasStatus(status))
                .and(hasCustomer(customerId))
                .and(hasSalesOrder(salesOrderId))
                .and(dueBetween(dueFrom, dueTo))
                .and(invoiceDateBetween(invoiceFrom, invoiceTo));
    }

    private static Specification<Invoice> textSearch(String q) {
        return (root, query, cb) -> {
            if (q == null || q.isBlank()) {
                return cb.conjunction();
            }
            String like = "%" + q.trim().toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("invoiceNumber")), like),
                    cb.like(cb.lower(root.get("notes")), like)
            );
        };
    }

    private static Specification<Invoice> hasStatus(InvoiceStatus status) {
        return (root, query, cb) -> status == null
                ? cb.conjunction()
                : cb.equal(root.get("status"), status);
    }

    private static Specification<Invoice> hasCustomer(Long customerId) {
        return (root, query, cb) -> customerId == null
                ? cb.conjunction()
                : cb.equal(root.get("customer").get("id"), customerId);
    }

    private static Specification<Invoice> hasSalesOrder(Long salesOrderId) {
        return (root, query, cb) -> salesOrderId == null
                ? cb.conjunction()
                : cb.equal(root.get("salesOrder").get("id"), salesOrderId);
    }

    private static Specification<Invoice> dueBetween(LocalDate from, LocalDate to) {
        return (root, query, cb) -> {
            if (from == null && to == null) {
                return cb.conjunction();
            }
            if (from != null && to != null) {
                return cb.between(root.get("dueDate"), from, to);
            }
            if (from != null) {
                return cb.greaterThanOrEqualTo(root.get("dueDate"), from);
            }
            return cb.lessThanOrEqualTo(root.get("dueDate"), to);
        };
    }

    private static Specification<Invoice> invoiceDateBetween(LocalDate from, LocalDate to) {
        return (root, query, cb) -> {
            if (from == null && to == null) {
                return cb.conjunction();
            }
            if (from != null && to != null) {
                return cb.between(root.get("invoiceDate"), from, to);
            }
            if (from != null) {
                return cb.greaterThanOrEqualTo(root.get("invoiceDate"), from);
            }
            return cb.lessThanOrEqualTo(root.get("invoiceDate"), to);
        };
    }
}
