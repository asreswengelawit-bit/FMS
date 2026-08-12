package com.crm.crm_backend.service.core;

import com.crm.crm_backend.dto.request.InvoiceCreateDTO;
import com.crm.crm_backend.dto.request.InvoiceUpdateDTO;
import com.crm.crm_backend.dto.response.InvoiceResponseDTO;
import com.crm.crm_backend.event.publisher.InvoiceEventPublisher;
import com.crm.crm_backend.mapper.InvoiceMapper;
import com.crm.crm_backend.model.entity.Customer;
import com.crm.crm_backend.model.entity.Invoice;
import com.crm.crm_backend.model.entity.SalesOrder;
import com.crm.crm_backend.model.enums.InvoiceStatus;
import com.crm.crm_backend.repository.CustomerRepository;
import com.crm.crm_backend.repository.InvoiceRepository;
import com.crm.crm_backend.repository.SalesOrderRepository;
import com.crm.crm_backend.service.workflow.DomainStatusGuard;
import com.crm.crm_backend.spec.InvoiceSpecification;
import com.crm.crm_backend.util.export.CsvGenerator;
import com.crm.crm_backend.validator.InvoiceValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final SalesOrderRepository salesOrderRepository;
    private final CustomerRepository customerRepository;
    private final InvoiceMapper invoiceMapper;
    private final InvoiceEventPublisher invoiceEventPublisher;
    private final InvoiceValidator invoiceValidator;
    private final CsvGenerator csvGenerator;

    public InvoiceResponseDTO createInvoice(InvoiceCreateDTO dto) {

        SalesOrder order = salesOrderRepository.findById(dto.getSalesOrderId())
                .orElseThrow(() -> new RuntimeException("Sales Order not found"));

        invoiceValidator.validateCanCreateFromOrder(order);

        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Invoice invoice = invoiceMapper.toEntity(dto);

        invoice.setSalesOrder(order);
        invoice.setCustomer(customer);

        invoice.setInvoiceNumber("INV-" + System.currentTimeMillis());

        invoice.setStatus(InvoiceStatus.DRAFT);

        invoice.setSubtotal(order.getSubtotal());
        invoice.setTaxAmount(dto.getTaxAmount() == null ? BigDecimal.ZERO : dto.getTaxAmount());
        invoice.setDiscountAmount(dto.getDiscountAmount() == null ? BigDecimal.ZERO : dto.getDiscountAmount());

        BigDecimal total =
                invoice.getSubtotal()
                        .add(invoice.getTaxAmount())
                        .subtract(invoice.getDiscountAmount());

        invoice.setTotalAmount(total);

        invoice.setPaidAmount(BigDecimal.ZERO);

        invoice.setBalanceAmount(total);

        Invoice saved = invoiceRepository.save(invoice);
        invoiceEventPublisher.publishInvoiceCreated(saved);

        return invoiceMapper.toResponseDTO(saved);
    }

    @Transactional(readOnly = true)
    public InvoiceResponseDTO getInvoice(Long id) {

        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        return invoiceMapper.toResponseDTO(invoice);
    }

    @Transactional(readOnly = true)
    public Page<InvoiceResponseDTO> getAllInvoices(Pageable pageable) {
        return searchInvoices(null, null, null, null, null, null, null, null, pageable);
    }

    @Transactional(readOnly = true)
    public Page<InvoiceResponseDTO> searchInvoices(
            String q,
            InvoiceStatus status,
            Long customerId,
            Long salesOrderId,
            LocalDate dueFrom,
            LocalDate dueTo,
            LocalDate invoiceFrom,
            LocalDate invoiceTo,
            Pageable pageable) {

        Specification<Invoice> spec = InvoiceSpecification.withFilters(
                q, status, customerId, salesOrderId, dueFrom, dueTo, invoiceFrom, invoiceTo);
        return invoiceRepository.findAll(spec, pageable).map(invoiceMapper::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public String exportInvoicesCsv(
            String q,
            InvoiceStatus status,
            Long customerId,
            Long salesOrderId,
            LocalDate dueFrom,
            LocalDate dueTo,
            LocalDate invoiceFrom,
            LocalDate invoiceTo) {

        Specification<Invoice> spec = InvoiceSpecification.withFilters(
                q, status, customerId, salesOrderId, dueFrom, dueTo, invoiceFrom, invoiceTo);
        List<Invoice> invoices = invoiceRepository.findAll(spec);

        List<String> headers = List.of(
                "id", "invoiceNumber", "status", "customerId", "salesOrderId",
                "invoiceDate", "dueDate", "subtotal", "discountAmount", "taxAmount",
                "totalAmount", "paidAmount", "balanceAmount");
        List<List<String>> rows = new ArrayList<>();
        for (Invoice invoice : invoices) {
            rows.add(List.of(
                    str(invoice.getId()),
                    str(invoice.getInvoiceNumber()),
                    invoice.getStatus() != null ? invoice.getStatus().name() : "",
                    invoice.getCustomer() != null ? str(invoice.getCustomer().getId()) : "",
                    invoice.getSalesOrder() != null ? str(invoice.getSalesOrder().getId()) : "",
                    str(invoice.getInvoiceDate()),
                    str(invoice.getDueDate()),
                    str(invoice.getSubtotal()),
                    str(invoice.getDiscountAmount()),
                    str(invoice.getTaxAmount()),
                    str(invoice.getTotalAmount()),
                    str(invoice.getPaidAmount()),
                    str(invoice.getBalanceAmount())
            ));
        }
        return csvGenerator.toCsv(headers, rows);
    }

    private static String str(Object value) {
        return value == null ? "" : String.valueOf(value);
    }

    public InvoiceResponseDTO updateInvoice(Long id,
                                            InvoiceUpdateDTO dto) {

        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        invoiceValidator.validateNotCancelled(invoice);

        if (dto.getStatus() != null) {
            DomainStatusGuard.assertInvoiceTransition(invoice.getStatus(), dto.getStatus());
        }

        invoiceMapper.updateEntityFromDTO(dto, invoice);

        if (invoice.getPaidAmount() == null) {
            invoice.setPaidAmount(BigDecimal.ZERO);
        }

        invoice.setBalanceAmount(
                invoice.getTotalAmount().subtract(invoice.getPaidAmount()));

        if (invoice.getBalanceAmount().compareTo(BigDecimal.ZERO) == 0
                && invoice.getStatus() != InvoiceStatus.CANCELLED) {
            DomainStatusGuard.assertInvoiceTransition(invoice.getStatus(), InvoiceStatus.PAID);
            invoice.setStatus(InvoiceStatus.PAID);
        }

        Invoice updated = invoiceRepository.save(invoice);

        return invoiceMapper.toResponseDTO(updated);
    }

    public void deleteInvoice(Long id) {

        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        if (invoice.getStatus() == InvoiceStatus.PAID) {
            throw new IllegalStateException("Cannot delete a paid invoice");
        }

        invoiceRepository.delete(invoice);

        log.info("Invoice {} deleted", id);
    }

    /**
     * Mark past-due SENT/PENDING invoices as OVERDUE and publish reminder events.
     * Reminders are throttled by lastReminderSentAt (default once per day).
     */
    public int processOverdueAndReminders() {
        LocalDate today = LocalDate.now();
        LocalDateTime reminderThreshold = LocalDateTime.now().minusHours(23);

        List<Invoice> dueCandidates = invoiceRepository.findPastDueForOverdue(
                today,
                EnumSet.of(InvoiceStatus.SENT, InvoiceStatus.PENDING, InvoiceStatus.OVERDUE));

        int reminded = 0;
        for (Invoice invoice : dueCandidates) {
            if (invoice.getStatus() == InvoiceStatus.SENT
                    || invoice.getStatus() == InvoiceStatus.PENDING) {
                DomainStatusGuard.assertInvoiceTransition(invoice.getStatus(), InvoiceStatus.OVERDUE);
                invoice.setStatus(InvoiceStatus.OVERDUE);
                invoiceRepository.save(invoice);
                log.info("Invoice {} marked OVERDUE (due {})", invoice.getInvoiceNumber(), invoice.getDueDate());
            }

            if (invoice.getLastReminderSentAt() == null
                    || invoice.getLastReminderSentAt().isBefore(reminderThreshold)) {
                invoiceEventPublisher.publishInvoiceOverdueReminder(invoice);
                invoice.setLastReminderSentAt(LocalDateTime.now());
                invoiceRepository.save(invoice);
                reminded++;
            }
        }

        log.info("Invoice reminder run complete: candidates={} reminded={}", dueCandidates.size(), reminded);
        return reminded;
    }
}
