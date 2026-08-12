package com.crm.crm_backend.service.core;

import com.crm.crm_backend.cache.PricingCache;
import com.crm.crm_backend.dto.request.PricingApplyRequestDTO;
import com.crm.crm_backend.dto.request.PricingRuleRequestDTO;
import com.crm.crm_backend.dto.response.PricingApplyResponseDTO;
import com.crm.crm_backend.dto.response.PricingRuleResponseDTO;
import com.crm.crm_backend.model.entity.PricingRule;
import com.crm.crm_backend.model.enums.PricingRuleType;
import com.crm.crm_backend.repository.PricingRuleRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PricingService {

    private final PricingRuleRepository pricingRuleRepository;
    private final PricingCache pricingCache;

    @PostConstruct
    public void warmCache() {
        refreshCache();
    }

    public PricingRuleResponseDTO createRule(PricingRuleRequestDTO dto) {
        if (pricingRuleRepository.existsByCode(dto.getCode())) {
            throw new IllegalArgumentException("Pricing rule code already exists: " + dto.getCode());
        }

        PricingRule rule = mapToEntity(dto, new PricingRule());
        PricingRule saved = pricingRuleRepository.save(rule);
        refreshCache();
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public PricingRuleResponseDTO getRule(Long id) {
        return toResponse(requireRule(id));
    }

    @Transactional(readOnly = true)
    public Page<PricingRuleResponseDTO> getAllRules(Pageable pageable) {
        return pricingRuleRepository.findAll(pageable).map(this::toResponse);
    }

    public PricingRuleResponseDTO updateRule(Long id, PricingRuleRequestDTO dto) {
        PricingRule rule = requireRule(id);
        if (!rule.getCode().equals(dto.getCode()) && pricingRuleRepository.existsByCode(dto.getCode())) {
            throw new IllegalArgumentException("Pricing rule code already exists: " + dto.getCode());
        }
        mapToEntity(dto, rule);
        PricingRule saved = pricingRuleRepository.save(rule);
        refreshCache();
        return toResponse(saved);
    }

    public void deleteRule(Long id) {
        PricingRule rule = requireRule(id);
        pricingRuleRepository.delete(rule);
        refreshCache();
        log.info("Pricing rule {} deleted", id);
    }

    @Transactional(readOnly = true)
    public PricingApplyResponseDTO applyPricing(PricingApplyRequestDTO request) {
        BigDecimal base = request.getBaseAmount().setScale(2, RoundingMode.HALF_UP);
        LocalDate today = LocalDate.now();

        List<PricingRule> candidates = pricingCache.snapshot().stream()
                .filter(r -> Boolean.TRUE.equals(r.getActive()))
                .filter(r -> isCurrentlyValid(r, today))
                .filter(r -> matchesSku(r, request.getProductSku()))
                .filter(r -> meetsMinOrder(r, base))
                .sorted(Comparator.comparing(PricingRule::getPriority))
                .toList();

        if (candidates.isEmpty()) {
            return PricingApplyResponseDTO.builder()
                    .baseAmount(base)
                    .adjustment(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP))
                    .finalAmount(base)
                    .build();
        }

        PricingRule rule = candidates.getFirst();
        BigDecimal adjustment = computeAdjustment(rule, base);
        BigDecimal finalAmount = base.add(adjustment).setScale(2, RoundingMode.HALF_UP);
        if (finalAmount.compareTo(BigDecimal.ZERO) < 0) {
            finalAmount = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }

        return PricingApplyResponseDTO.builder()
                .baseAmount(base)
                .adjustment(adjustment)
                .finalAmount(finalAmount)
                .appliedRuleId(rule.getId())
                .appliedRuleCode(rule.getCode())
                .build();
    }

    private void refreshCache() {
        pricingCache.replaceActiveRules(pricingRuleRepository.findByActiveTrueOrderByPriorityAsc());
    }

    private boolean isCurrentlyValid(PricingRule rule, LocalDate today) {
        if (rule.getValidFrom() != null && today.isBefore(rule.getValidFrom())) {
            return false;
        }
        if (rule.getValidTo() != null && today.isAfter(rule.getValidTo())) {
            return false;
        }
        return true;
    }

    private boolean matchesSku(PricingRule rule, String sku) {
        if (rule.getProductSku() == null || rule.getProductSku().isBlank()) {
            return true;
        }
        return sku != null && rule.getProductSku().equalsIgnoreCase(sku);
    }

    private boolean meetsMinOrder(PricingRule rule, BigDecimal base) {
        if (rule.getMinOrderAmount() == null) {
            return true;
        }
        return base.compareTo(rule.getMinOrderAmount()) >= 0;
    }

    private BigDecimal computeAdjustment(PricingRule rule, BigDecimal base) {
        BigDecimal adjustment;
        if (rule.getRuleType() == PricingRuleType.PERCENTAGE_DISCOUNT
                || rule.getRuleType() == PricingRuleType.DISCOUNT) {
            adjustment = base.multiply(rule.getValue())
                    .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)
                    .negate();
        } else if (rule.getRuleType() == PricingRuleType.FIXED_DISCOUNT) {
            adjustment = rule.getValue().negate();
        } else {
            adjustment = base.multiply(rule.getValue())
                    .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
        }

        if (rule.getMaxAdjustment() != null) {
            BigDecimal max = rule.getMaxAdjustment().abs();
            if (adjustment.abs().compareTo(max) > 0) {
                adjustment = adjustment.signum() < 0 ? max.negate() : max;
            }
        }

        return adjustment.setScale(2, RoundingMode.HALF_UP);
    }

    private PricingRule requireRule(Long id) {
        return pricingRuleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pricing rule not found: " + id));
    }

    private PricingRule mapToEntity(PricingRuleRequestDTO dto, PricingRule rule) {
        rule.setCode(dto.getCode().trim());
        rule.setName(dto.getName().trim());
        rule.setRuleType(dto.getRuleType());
        rule.setValue(dto.getValue());
        rule.setMinOrderAmount(dto.getMinOrderAmount());
        rule.setMaxAdjustment(dto.getMaxAdjustment());
        rule.setProductSku(dto.getProductSku());
        rule.setPriority(dto.getPriority() != null ? dto.getPriority() : 100);
        rule.setActive(dto.getActive() != null ? dto.getActive() : true);
        rule.setValidFrom(dto.getValidFrom());
        rule.setValidTo(dto.getValidTo());
        rule.setDescription(dto.getDescription());
        return rule;
    }

    private PricingRuleResponseDTO toResponse(PricingRule rule) {
        PricingRuleResponseDTO dto = new PricingRuleResponseDTO();
        dto.setId(rule.getId());
        dto.setCode(rule.getCode());
        dto.setName(rule.getName());
        dto.setRuleType(rule.getRuleType());
        dto.setValue(rule.getValue());
        dto.setMinOrderAmount(rule.getMinOrderAmount());
        dto.setMaxAdjustment(rule.getMaxAdjustment());
        dto.setProductSku(rule.getProductSku());
        dto.setPriority(rule.getPriority());
        dto.setActive(rule.getActive());
        dto.setValidFrom(rule.getValidFrom());
        dto.setValidTo(rule.getValidTo());
        dto.setDescription(rule.getDescription());
        dto.setCreatedAt(rule.getCreatedAt());
        dto.setUpdatedAt(rule.getUpdatedAt());
        return dto;
    }
}
