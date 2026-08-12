package com.crm.crm_backend.service.core;

import com.crm.crm_backend.dto.request.PricingApplyRequestDTO;
import com.crm.crm_backend.dto.request.QuotationCreateDTO;
import com.crm.crm_backend.dto.request.QuotationItemRequestDTO;
import com.crm.crm_backend.dto.request.QuotationUpdateDTO;
import com.crm.crm_backend.dto.response.PricingApplyResponseDTO;
import com.crm.crm_backend.dto.response.QuotationResponseDTO;
import com.crm.crm_backend.dto.response.SalesOrderResponseDTO;
import com.crm.crm_backend.exception.QuotationNotFoundException;
import com.crm.crm_backend.mapper.QuotationMapper;
import com.crm.crm_backend.mapper.SalesOrderMapper;
import com.crm.crm_backend.model.entity.Customer;
import com.crm.crm_backend.model.entity.Opportunity;
import com.crm.crm_backend.model.entity.OrderItem;
import com.crm.crm_backend.model.entity.Quotation;
import com.crm.crm_backend.model.entity.QuotationItem;
import com.crm.crm_backend.model.entity.SalesOrder;
import com.crm.crm_backend.model.enums.OrderStatus;
import com.crm.crm_backend.model.enums.OrderType;
import com.crm.crm_backend.model.enums.QuotationStatus;
import com.crm.crm_backend.repository.CustomerRepository;
import com.crm.crm_backend.repository.OpportunityRepository;
import com.crm.crm_backend.repository.QuotationRepository;
import com.crm.crm_backend.repository.SalesOrderRepository;
import com.crm.crm_backend.service.workflow.DomainStatusGuard;
import com.crm.crm_backend.spec.QuotationSpecification;
import com.crm.crm_backend.util.export.CsvGenerator;
import com.crm.crm_backend.validator.QuotationValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class QuotationService {

    private final QuotationRepository quotationRepository;
    private final CustomerRepository customerRepository;
    private final OpportunityRepository opportunityRepository;
    private final SalesOrderRepository salesOrderRepository;
    private final QuotationMapper quotationMapper;
    private final SalesOrderMapper salesOrderMapper;
    private final QuotationValidator quotationValidator;
    private final PricingService pricingService;
    private final CsvGenerator csvGenerator;

    public QuotationResponseDTO createQuotation(QuotationCreateDTO dto) {

        quotationValidator.validateCreate(dto);

        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Opportunity opportunity = opportunityRepository.findById(dto.getOpportunityId())
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));

        Quotation quotation = quotationMapper.toEntity(dto);

        quotation.setCustomer(customer);
        quotation.setOpportunity(opportunity);
        quotation.setQuotationNumber("QT-" + System.currentTimeMillis());
        quotation.setStatus(QuotationStatus.DRAFT);
        quotation.setActive(true);

        applyItemsAndTotals(
                quotation,
                dto.getItems(),
                dto.getSubtotal(),
                dto.getDiscount(),
                dto.getTax(),
                dto.getTotalAmount(),
                dto.getApplyPricingRules());

        Quotation saved = quotationRepository.save(quotation);

        log.info("Quotation {} created", saved.getQuotationNumber());

        return toResponse(saved);
    }

    @Transactional
    public QuotationResponseDTO getQuotation(Long id) {

        Quotation quotation = quotationRepository.findById(id)
                .orElseThrow(() ->
                        new QuotationNotFoundException("Quotation not found: " + id));

        expireIfPastDue(quotation);
        return toResponse(quotation);
    }

    @Transactional
    public Page<QuotationResponseDTO> getAllQuotations(Pageable pageable) {
        return searchQuotations(null, null, null, null, null, null, null, null, pageable);
    }

    @Transactional
    public Page<QuotationResponseDTO> searchQuotations(
            String q,
            QuotationStatus status,
            Long customerId,
            Long opportunityId,
            LocalDate issueFrom,
            LocalDate issueTo,
            LocalDate expiryFrom,
            LocalDate expiryTo,
            Pageable pageable) {

        Specification<Quotation> spec = QuotationSpecification.withFilters(
                q, status, customerId, opportunityId, issueFrom, issueTo, expiryFrom, expiryTo);
        return quotationRepository.findAll(spec, pageable)
                .map(quotation -> {
                    expireIfPastDue(quotation);
                    return toResponse(quotation);
                });
    }

    @Transactional(readOnly = true)
    public String exportQuotationsCsv(
            String q,
            QuotationStatus status,
            Long customerId,
            Long opportunityId,
            LocalDate issueFrom,
            LocalDate issueTo,
            LocalDate expiryFrom,
            LocalDate expiryTo) {

        Specification<Quotation> spec = QuotationSpecification.withFilters(
                q, status, customerId, opportunityId, issueFrom, issueTo, expiryFrom, expiryTo);
        List<Quotation> quotations = quotationRepository.findAll(spec);

        List<String> headers = List.of(
                "id", "quotationNumber", "status", "customerId",
                "issueDate", "expiryDate", "subtotal", "discount", "tax", "totalAmount");
        List<List<String>> rows = new ArrayList<>();
        for (Quotation quotation : quotations) {
            rows.add(List.of(
                    str(quotation.getId()),
                    str(quotation.getQuotationNumber()),
                    quotation.getStatus() != null ? quotation.getStatus().name() : "",
                    quotation.getCustomer() != null ? str(quotation.getCustomer().getId()) : "",
                    str(quotation.getIssueDate()),
                    str(quotation.getExpiryDate()),
                    str(quotation.getSubtotal()),
                    str(quotation.getDiscount()),
                    str(quotation.getTax()),
                    str(quotation.getTotalAmount())
            ));
        }
        return csvGenerator.toCsv(headers, rows);
    }

    private static String str(Object value) {
        return value == null ? "" : String.valueOf(value);
    }

    public QuotationResponseDTO updateQuotation(Long id,
                                                QuotationUpdateDTO dto) {

        Quotation quotation = quotationRepository.findById(id)
                .orElseThrow(() ->
                        new QuotationNotFoundException("Quotation not found: " + id));

        if (dto.getStatus() != null) {
            DomainStatusGuard.assertQuotationTransition(quotation.getStatus(), dto.getStatus());
        }

        quotationMapper.updateEntityFromDTO(dto, quotation);

        if (dto.getItems() != null) {
            quotationValidator.validateItems(dto.getItems());
            applyItemsAndTotals(
                    quotation,
                    dto.getItems(),
                    dto.getSubtotal(),
                    dto.getDiscount(),
                    dto.getTax(),
                    dto.getTotalAmount(),
                    dto.getApplyPricingRules());
        } else if (dto.getSubtotal() != null || dto.getDiscount() != null
                || dto.getTax() != null || dto.getTotalAmount() != null) {
            // Header-only recalculation when items are not replaced
            BigDecimal subtotal = dto.getSubtotal() != null ? dto.getSubtotal() : quotation.getSubtotal();
            if (subtotal == null) {
                subtotal = BigDecimal.ZERO;
            }
            boolean applyPricing = dto.getApplyPricingRules() == null || dto.getApplyPricingRules();
            if (applyPricing && (quotation.getItems() == null || quotation.getItems().isEmpty())) {
                PricingApplyResponseDTO priced = priceAmount(subtotal, null);
                subtotal = priced.getFinalAmount();
            }
            BigDecimal discount = dto.getDiscount() != null ? dto.getDiscount()
                    : (quotation.getDiscount() != null ? quotation.getDiscount() : BigDecimal.ZERO);
            BigDecimal tax = dto.getTax() != null ? dto.getTax()
                    : (quotation.getTax() != null ? quotation.getTax() : BigDecimal.ZERO);
            quotation.setSubtotal(subtotal);
            quotation.setDiscount(discount);
            quotation.setTax(tax);
            quotation.setTotalAmount(dto.getTotalAmount() != null
                    ? dto.getTotalAmount()
                    : subtotal.add(tax).subtract(discount));
        }

        Quotation updated = quotationRepository.save(quotation);

        return toResponse(updated);
    }

    public QuotationResponseDTO changeStatus(Long id, QuotationStatus newStatus) {
        Quotation quotation = quotationRepository.findById(id)
                .orElseThrow(() -> new QuotationNotFoundException("Quotation not found: " + id));

        DomainStatusGuard.assertQuotationTransition(quotation.getStatus(), newStatus);
        quotation.setStatus(newStatus);
        return toResponse(quotationRepository.save(quotation));
    }

    /**
     * Accept quotation and create a linked sales order, copying line items (or a
     * single summary line when the quotation has header totals only).
     */
    public SalesOrderResponseDTO acceptQuotation(Long id) {
        Quotation quotation = quotationRepository.findById(id)
                .orElseThrow(() -> new QuotationNotFoundException("Quotation not found: " + id));

        if (quotation.getStatus() == QuotationStatus.ACCEPTED
                || salesOrderRepository.existsByQuotationId(quotation.getId())) {
            throw new IllegalStateException(
                    "Quotation already accepted — cannot accept twice");
        }

        expireIfPastDue(quotation);

        quotationValidator.validateCanAccept(quotation);
        DomainStatusGuard.assertQuotationTransition(quotation.getStatus(), QuotationStatus.ACCEPTED);
        quotation.setStatus(QuotationStatus.ACCEPTED);
        quotation.getItems().size();
        quotationRepository.save(quotation);

        SalesOrder order = SalesOrder.builder()
                .orderNumber("SO-" + System.currentTimeMillis())
                .customer(quotation.getCustomer())
                .opportunity(quotation.getOpportunity())
                .quotation(quotation)
                .status(OrderStatus.DRAFT)
                .type(OrderType.SALES)
                .orderDate(LocalDate.now())
                .currency("ETB")
                .notes("Created from quotation " + quotation.getQuotationNumber())
                .build();

        BigDecimal subtotal = BigDecimal.ZERO;

        if (quotation.getItems() != null && !quotation.getItems().isEmpty()) {
            for (QuotationItem qi : quotation.getItems()) {
                OrderItem item = OrderItem.builder()
                        .itemName(qi.getItemName())
                        .sku(qi.getSku())
                        .description(qi.getDescription())
                        .quantity(qi.getQuantity())
                        .unitPrice(qi.getUnitPrice())
                        .totalPrice(qi.getTotalPrice())
                        .salesOrder(order)
                        .build();
                order.getOrderItems().add(item);
                subtotal = subtotal.add(qi.getTotalPrice() != null ? qi.getTotalPrice() : BigDecimal.ZERO);
            }
        } else {
            BigDecimal amount = quotation.getTotalAmount() != null
                    ? quotation.getTotalAmount()
                    : (quotation.getSubtotal() != null ? quotation.getSubtotal() : BigDecimal.ZERO);
            OrderItem item = OrderItem.builder()
                    .itemName("Quoted products - " + quotation.getQuotationNumber())
                    .sku("QT-" + quotation.getId())
                    .description(quotation.getNotes())
                    .quantity(1)
                    .unitPrice(amount)
                    .totalPrice(amount)
                    .salesOrder(order)
                    .build();
            order.getOrderItems().add(item);
            subtotal = amount;
        }

        BigDecimal discount = quotation.getDiscount() != null ? quotation.getDiscount() : BigDecimal.ZERO;
        BigDecimal tax = quotation.getTax() != null ? quotation.getTax() : BigDecimal.ZERO;

        order.setSubtotal(subtotal);
        order.setDiscountAmount(discount);
        order.setTaxAmount(tax);
        order.setTotalAmount(subtotal.add(tax).subtract(discount));

        SalesOrder saved = salesOrderRepository.save(order);
        log.info("Quotation {} accepted → sales order {}",
                quotation.getQuotationNumber(), saved.getOrderNumber());

        return salesOrderMapper.toResponseDTO(saved);
    }

    public void deleteQuotation(Long id) {

        Quotation quotation = quotationRepository.findById(id)
                .orElseThrow(() ->
                        new QuotationNotFoundException("Quotation not found: " + id));

        if (quotation.getStatus() == QuotationStatus.ACCEPTED) {
            throw new IllegalStateException("Cannot delete an accepted quotation");
        }

        quotationRepository.delete(quotation);

        log.info("Quotation {} deleted", id);
    }

    private void applyItemsAndTotals(
            Quotation quotation,
            List<QuotationItemRequestDTO> items,
            BigDecimal requestedSubtotal,
            BigDecimal requestedDiscount,
            BigDecimal requestedTax,
            BigDecimal requestedTotal,
            Boolean applyPricingRules) {

        BigDecimal discount = requestedDiscount != null ? requestedDiscount : BigDecimal.ZERO;
        BigDecimal tax = requestedTax != null ? requestedTax : BigDecimal.ZERO;
        boolean applyPricing = applyPricingRules == null || applyPricingRules;

        quotation.getItems().clear();

        if (items != null && !items.isEmpty()) {
            BigDecimal subtotal = BigDecimal.ZERO;
            for (QuotationItemRequestDTO itemDto : items) {
                int qty = itemDto.getQuantity() != null ? itemDto.getQuantity() : 1;
                if (qty <= 0) {
                    qty = 1;
                }
                BigDecimal unit = itemDto.getUnitPrice() != null ? itemDto.getUnitPrice() : BigDecimal.ZERO;
                BigDecimal lineBase = unit.multiply(BigDecimal.valueOf(qty));

                BigDecimal lineTotal = lineBase;
                BigDecimal pricedUnit = unit;
                if (applyPricing) {
                    PricingApplyResponseDTO priced = priceAmount(lineBase, itemDto.getSku());
                    lineTotal = priced.getFinalAmount();
                    pricedUnit = lineTotal.divide(BigDecimal.valueOf(qty), 2, RoundingMode.HALF_UP);
                    if (priced.getAppliedRuleCode() != null) {
                        log.info("Applied pricing rule {} to quotation line sku={} base={} final={}",
                                priced.getAppliedRuleCode(),
                                itemDto.getSku(),
                                lineBase,
                                lineTotal);
                    }
                }

                QuotationItem item = QuotationItem.builder()
                        .itemName(itemDto.getItemName() != null ? itemDto.getItemName() : "Item")
                        .sku(itemDto.getSku())
                        .description(itemDto.getDescription())
                        .quantity(qty)
                        .unitPrice(pricedUnit)
                        .totalPrice(lineTotal)
                        .quotation(quotation)
                        .build();
                quotation.getItems().add(item);
                subtotal = subtotal.add(lineTotal);
            }
            quotation.setSubtotal(subtotal);
            quotation.setDiscount(discount);
            quotation.setTax(tax);
            quotation.setTotalAmount(subtotal.add(tax).subtract(discount));
        } else {
            BigDecimal subtotal = requestedSubtotal != null ? requestedSubtotal : BigDecimal.ZERO;
            if (applyPricing) {
                PricingApplyResponseDTO priced = priceAmount(subtotal, null);
                subtotal = priced.getFinalAmount();
                if (priced.getAppliedRuleCode() != null) {
                    log.info("Applied pricing rule {} to quotation header subtotal final={}",
                            priced.getAppliedRuleCode(), subtotal);
                }
            }
            quotation.setSubtotal(subtotal);
            quotation.setDiscount(discount);
            quotation.setTax(tax);
            quotation.setTotalAmount(requestedTotal != null
                    ? requestedTotal
                    : subtotal.add(tax).subtract(discount));
        }
    }

    private PricingApplyResponseDTO priceAmount(BigDecimal baseAmount, String sku) {
        PricingApplyRequestDTO request = new PricingApplyRequestDTO();
        request.setBaseAmount(baseAmount != null ? baseAmount : BigDecimal.ZERO);
        request.setProductSku(sku);
        return pricingService.applyPricing(request);
    }

    private QuotationResponseDTO toResponse(Quotation quotation) {
        QuotationResponseDTO dto = quotationMapper.toResponseDTO(quotation);
        salesOrderRepository.findByQuotationId(quotation.getId())
                .ifPresent(order -> dto.setSalesOrderId(order.getId()));
        return dto;
    }

    /**
     * On-read / on-accept: mark DRAFT/SENT quotations past expiryDate as EXPIRED.
     */
    void expireIfPastDue(Quotation quotation) {
        if (quotation == null || quotation.getExpiryDate() == null) {
            return;
        }
        if (quotation.getStatus() != QuotationStatus.DRAFT
                && quotation.getStatus() != QuotationStatus.SENT) {
            return;
        }
        if (!quotation.getExpiryDate().isBefore(LocalDate.now())) {
            return;
        }
        DomainStatusGuard.assertQuotationTransition(quotation.getStatus(), QuotationStatus.EXPIRED);
        quotation.setStatus(QuotationStatus.EXPIRED);
        quotationRepository.save(quotation);
        log.info("Quotation {} expired on-read (expiryDate={})",
                quotation.getQuotationNumber(), quotation.getExpiryDate());
    }

    /**
     * Batch job: expire all open quotations past their expiry date.
     */
    public int expirePastDueQuotations() {
        LocalDate today = LocalDate.now();
        int count = 0;
        for (QuotationStatus status : List.of(QuotationStatus.DRAFT, QuotationStatus.SENT)) {
            for (Quotation quotation : quotationRepository.findByStatus(status)) {
                if (quotation.getExpiryDate() != null && quotation.getExpiryDate().isBefore(today)) {
                    DomainStatusGuard.assertQuotationTransition(quotation.getStatus(), QuotationStatus.EXPIRED);
                    quotation.setStatus(QuotationStatus.EXPIRED);
                    quotationRepository.save(quotation);
                    count++;
                }
            }
        }
        if (count > 0) {
            log.info("Expired {} past-due quotations", count);
        }
        return count;
    }

    /**
     * Close open quotations when an opportunity is won or lost.
     * ACCEPTED quotations are left untouched.
     */
    public int closeOpenQuotationsForOpportunity(Long opportunityId, boolean won) {
        List<Quotation> open = quotationRepository.findByOpportunityIdAndStatusIn(
                opportunityId,
                List.of(QuotationStatus.DRAFT, QuotationStatus.SENT));

        int count = 0;
        for (Quotation quotation : open) {
            QuotationStatus target;
            if (won) {
                target = QuotationStatus.CANCELLED;
            } else if (quotation.getStatus() == QuotationStatus.SENT) {
                target = QuotationStatus.REJECTED;
            } else {
                target = QuotationStatus.CANCELLED;
            }
            try {
                DomainStatusGuard.assertQuotationTransition(quotation.getStatus(), target);
                quotation.setStatus(target);
                quotationRepository.save(quotation);
                count++;
            } catch (IllegalStateException ex) {
                log.warn("Could not close quotation {}: {}", quotation.getId(), ex.getMessage());
            }
        }
        log.info("Closed {} open quotations for opportunity {} (won={})", count, opportunityId, won);
        return count;
    }
}
