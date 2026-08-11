package com.crm.crm_backend.spec;

import com.crm.crm_backend.model.entity.Lead;
import com.crm.crm_backend.model.enums.LeadStatus;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public final class LeadSpecification {

    private LeadSpecification() {
    }

    public static Specification<Lead> withFilters(
            String q,
            LeadStatus status,
            String assignedTo,
            Long territoryId,
            Long campaignId,
            LocalDate createdFrom,
            LocalDate createdTo) {

        return Specification.where(notDeleted())
                .and(textSearch(q))
                .and(hasStatus(status))
                .and(hasAssignedTo(assignedTo))
                .and(hasTerritory(territoryId))
                .and(hasCampaign(campaignId))
                .and(createdBetween(createdFrom, createdTo));
    }

    private static Specification<Lead> notDeleted() {
        return (root, query, cb) -> cb.isFalse(root.get("deleted"));
    }

    private static Specification<Lead> textSearch(String q) {
        return (root, query, cb) -> {
            if (q == null || q.isBlank()) {
                return cb.conjunction();
            }
            String like = "%" + q.trim().toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("firstName")), like),
                    cb.like(cb.lower(root.get("lastName")), like),
                    cb.like(cb.lower(root.get("email")), like),
                    cb.like(cb.lower(root.get("company")), like),
                    cb.like(cb.lower(root.get("phone")), like)
            );
        };
    }

    private static Specification<Lead> hasStatus(LeadStatus status) {
        return (root, query, cb) -> status == null
                ? cb.conjunction()
                : cb.equal(root.get("status"), status);
    }

    private static Specification<Lead> hasAssignedTo(String assignedTo) {
        return (root, query, cb) -> {
            if (assignedTo == null || assignedTo.isBlank()) {
                return cb.conjunction();
            }
            return cb.equal(cb.lower(root.get("assignedTo")), assignedTo.trim().toLowerCase());
        };
    }

    private static Specification<Lead> hasTerritory(Long territoryId) {
        return (root, query, cb) -> territoryId == null
                ? cb.conjunction()
                : cb.equal(root.get("territory").get("id"), territoryId);
    }

    private static Specification<Lead> hasCampaign(Long campaignId) {
        return (root, query, cb) -> campaignId == null
                ? cb.conjunction()
                : cb.equal(root.get("campaignId"), campaignId);
    }

    private static Specification<Lead> createdBetween(LocalDate from, LocalDate to) {
        return (root, query, cb) -> {
            if (from == null && to == null) {
                return cb.conjunction();
            }
            if (from != null && to != null) {
                return cb.between(
                        root.get("createdAt"),
                        from.atStartOfDay(),
                        LocalDateTime.of(to, LocalTime.MAX));
            }
            if (from != null) {
                return cb.greaterThanOrEqualTo(root.get("createdAt"), from.atStartOfDay());
            }
            return cb.lessThanOrEqualTo(root.get("createdAt"), LocalDateTime.of(to, LocalTime.MAX));
        };
    }
}
