package com.crm.crm_backend.model.entity;

import com.crm.crm_backend.model.enums.PricingRuleType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pricing_rules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PricingRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 200)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "rule_type", nullable = false, length = 40)
    private PricingRuleType ruleType;

    @Column(nullable = false, precision = 15, scale = 4)
    private BigDecimal value;

    @Column(name = "min_order_amount", precision = 15, scale = 2)
    private BigDecimal minOrderAmount;

    @Column(name = "max_adjustment", precision = 15, scale = 2)
    private BigDecimal maxAdjustment;

    @Column(name = "product_sku", length = 100)
    private String productSku;

    @Builder.Default
    @Column(nullable = false)
    private Integer priority = 100;

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "valid_from")
    private LocalDate validFrom;

    @Column(name = "valid_to")
    private LocalDate validTo;

    @Column(length = 1000)
    private String description;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (active == null) {
            active = true;
        }
        if (priority == null) {
            priority = 100;
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
