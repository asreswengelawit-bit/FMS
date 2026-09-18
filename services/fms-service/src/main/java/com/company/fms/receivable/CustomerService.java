package com.company.fms.receivable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.fms.invoice.Invoice;
import com.company.fms.invoice.InvoiceRepository;
import com.company.fms.payment.Payment;
import com.company.fms.payment.PaymentRepository;
import com.company.fms.receivable.dto.ArAgingReport;
import com.company.fms.receivable.dto.CreateCustomerRequest;
import com.company.fms.receivable.dto.CustomerResponse;
import com.company.fms.receivable.dto.CustomerStatement;
import com.company.fms.shared.ConflictException;
import com.company.fms.shared.CurrentUser;
import com.company.fms.shared.ResourceNotFoundException;

@Service
@Transactional(readOnly = true)
public class CustomerService {

    private final CustomerRepository repository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final CurrentUser currentUser;

    public CustomerService(CustomerRepository repository, InvoiceRepository invoiceRepository,
            PaymentRepository paymentRepository, CurrentUser currentUser) {
        this.repository = repository;
        this.invoiceRepository = invoiceRepository;
        this.paymentRepository = paymentRepository;
        this.currentUser = currentUser;
    }

    public Page<CustomerResponse> findAll(String search, String status, Pageable pageable) {
        if (search != null && !search.isBlank() && status != null && !status.isBlank()) {
            return repository.findByStatusAndCustomerNameContainingIgnoreCaseOrStatusAndCustomerCodeContainingIgnoreCaseOrderByCustomerNameAsc(
                    status, search, status, search, pageable).map(CustomerResponse::from);
        }
        if (search != null && !search.isBlank()) {
            return repository.findByCustomerNameContainingIgnoreCaseOrCustomerCodeContainingIgnoreCaseOrderByCustomerNameAsc(
                    search, search, pageable).map(CustomerResponse::from);
        }
        if (status != null && !status.isBlank()) {
            return repository.findByStatusOrderByCustomerNameAsc(status, pageable).map(CustomerResponse::from);
        }
        return repository.findAllByOrderByCustomerNameAsc(pageable).map(CustomerResponse::from);
    }

    public CustomerResponse findById(String id) {
        return CustomerResponse.from(getCustomer(id));
    }

    @Transactional
    public CustomerResponse create(CreateCustomerRequest request) {
        if (repository.findByCustomerCode(request.customerCode().trim()).isPresent()) {
            throw new ConflictException("Customer code already exists: " + request.customerCode());
        }
        Customer customer = new Customer(
                java.util.UUID.randomUUID().toString(),
                request.customerCode().trim(),
                request.customerName().trim(),
                request.contactPerson(),
                request.email(),
                request.phoneNumber(),
                request.address(),
                request.taxId(),
                null,
                null,
                currentUser.get());
        return CustomerResponse.from(repository.saveAndFlush(customer));
    }

    @Transactional
    public CustomerResponse update(String id, CreateCustomerRequest request) {
        Customer customer = getCustomer(id);
        customer.update(request.customerName(), request.contactPerson(), request.email(), request.phoneNumber(),
                request.address(), request.taxId(), null, null);
        return CustomerResponse.from(repository.save(customer));
    }

    @Transactional
    public CustomerResponse setActive(String id, boolean active) {
        Customer customer = getCustomer(id);
        customer.setActive(active);
        return CustomerResponse.from(repository.save(customer));
    }

    public ArAgingReport arAgingReport(LocalDate asOfDate) {
        LocalDate asOf = asOfDate == null ? LocalDate.now() : asOfDate;
        List<Invoice> invoices = invoiceRepository.findByInvoiceType("RECEIVABLE");
        java.util.Map<String, List<Invoice>> byCustomer = new java.util.HashMap<>();
        for (Invoice invoice : invoices) {
            if (invoice.getRemainingBalance().signum() <= 0) {
                continue;
            }
            byCustomer.computeIfAbsent(invoice.getCustomerId() == null ? "UNKNOWN" : invoice.getCustomerId(),
                    k -> new ArrayList<>()).add(invoice);
        }
        List<ArAgingReport.Item> items = new ArrayList<>();
        BigDecimal[] totals = new BigDecimal[5];
        for (int i = 0; i < 5; i++) {
            totals[i] = BigDecimal.ZERO;
        }
        for (java.util.Map.Entry<String, List<Invoice>> e : byCustomer.entrySet()) {
            BigDecimal[] buckets = new BigDecimal[5];
            for (int i = 0; i < 5; i++) {
                buckets[i] = BigDecimal.ZERO;
            }
            String customerCode = "";
            String customerName = "";
            for (Invoice invoice : e.getValue()) {
                if (invoice.getCustomerCode() != null && !invoice.getCustomerCode().isEmpty()) {
                    customerCode = invoice.getCustomerCode();
                }
                if (customerName.isEmpty() && invoice.getPartyName() != null) {
                    customerName = invoice.getPartyName();
                }
                long days = invoice.getDueDate() == null ? 0
                        : ChronoUnit.DAYS.between(invoice.getDueDate(), asOf);
                BigDecimal bal = invoice.getRemainingBalance();
                int b = days <= 0 ? 0 : days <= 30 ? 1 : days <= 60 ? 2 : days <= 90 ? 3 : 4;
                buckets[b] = buckets[b].add(bal);
            }
            BigDecimal total = buckets[0].add(buckets[1]).add(buckets[2]).add(buckets[3]).add(buckets[4]);
            items.add(new ArAgingReport.Item(e.getKey(), customerCode, customerName,
                    buckets[0], buckets[1], buckets[2], buckets[3], buckets[4], total));
            for (int i = 0; i < 5; i++) {
                totals[i] = totals[i].add(buckets[i]);
            }
        }
        BigDecimal grandTotal = totals[0].add(totals[1]).add(totals[2]).add(totals[3]).add(totals[4]);
        return new ArAgingReport(asOf, items, totals[0], totals[1], totals[2], totals[3], totals[4], grandTotal);
    }

    public CustomerStatement getStatement(String id) {
        Customer customer = getCustomer(id);
        List<Invoice> invoices = invoiceRepository.findByCustomerId(id);
        List<CustomerStatement.Line> lines = new ArrayList<>();
        BigDecimal running = BigDecimal.ZERO;
        for (Invoice invoice : invoices) {
            BigDecimal amount = invoice.getTotalAmount();
            running = running.add(amount);
            lines.add(new CustomerStatement.Line(
                    invoice.getJournalEntryId() == null ? invoice.getId() : invoice.getJournalEntryId(),
                    invoice.getIssueDate().toString(),
                    "Invoice " + invoice.getInvoiceNumber(),
                    amount,
                    BigDecimal.ZERO,
                    running));
            for (Payment payment : paymentRepository.findByInvoiceId(invoice.getId())) {
                running = running.subtract(payment.getAmount());
                lines.add(new CustomerStatement.Line(
                        payment.getId(),
                        payment.getPaymentDate().toString(),
                        (payment.getPaymentType().equals("PAYMENT") ? "Payment " : "Receipt ")
                                + payment.getPaymentNumber(),
                        BigDecimal.ZERO,
                        payment.getAmount(),
                        running));
            }
        }
        return new CustomerStatement(customer.getId(), customer.getCustomerCode(), customer.getCustomerName(),
                LocalDate.of(2000, 1, 1), LocalDate.now(),
                BigDecimal.ZERO, running, lines);
    }

    private Customer getCustomer(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + id));
    }
}
