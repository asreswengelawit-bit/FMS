package com.crm.crm_backend.spec;

import com.crm.crm_backend.model.entity.Customer;
import com.crm.crm_backend.model.enums.CustomerStatus;
import com.crm.crm_backend.model.enums.CustomerType;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public final class CustomerSpecification {

    private CustomerSpecification() {
    }

    public static Specification<Customer> withFilters(
            String q,
            CustomerStatus status,
            CustomerType customerType,
            Long territoryId,
            String city,
            String country,
            LocalDate createdFrom,
            LocalDate createdTo) {

        return Specification.where(notDeleted())
                .and(textSearch(q))
                .and(hasStatus(status))
                .and(hasType(customerType))
                .and(hasTerritory(territoryId))
                .and(hasCity(city))
                .and(hasCountry(country))
                .and(createdBetween(createdFrom, createdTo));
    }

    private static Specification<Customer> notDeleted() {
        return (root, query, cb) -> cb.isFalse(root.get("deleted"));
    }

    private static Specification<Customer> textSearch(String q) {
        return (root, query, cb) -> {
            if (q == null || q.isBlank()) {
                return cb.conjunction();
            }
            String like = "%" + q.trim().toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("companyName")), like),
                    cb.like(cb.lower(root.get("contactName")), like),
                    cb.like(cb.lower(root.get("email")), like),
                    cb.like(cb.lower(root.get("customerNumber")), like),
                    cb.like(cb.lower(root.get("phone")), like)
            );
        };
    }

    private static Specification<Customer> hasStatus(CustomerStatus status) {
        return (root, query, cb) -> status == null
                ? cb.conjunction()
                : cb.equal(root.get("status"), status);
    }

    private static Specification<Customer> hasType(CustomerType type) {
        return (root, query, cb) -> type == null
                ? cb.conjunction()
                : cb.equal(root.get("customerType"), type);
    }

    private static Specification<Customer> hasTerritory(Long territoryId) {
        return (root, query, cb) -> territoryId == null
                ? cb.conjunction()
                : cb.equal(root.get("territory").get("id"), territoryId);
    }

    private static Specification<Customer> hasCity(String city) {
        return (root, query, cb) -> {
            if (city == null || city.isBlank()) {
                return cb.conjunction();
            }
            return cb.equal(cb.lower(root.get("city")), city.trim().toLowerCase());
        };
    }

    private static Specification<Customer> hasCountry(String country) {
        return (root, query, cb) -> {
            if (country == null || country.isBlank()) {
                return cb.conjunction();
            }
            return cb.equal(cb.lower(root.get("country")), country.trim().toLowerCase());
        };
    }

    private static Specification<Customer> createdBetween(LocalDate from, LocalDate to) {
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
