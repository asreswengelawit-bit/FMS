package com.company.fms.payable;

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
import com.company.fms.payable.dto.ApAgingReport;
import com.company.fms.payable.dto.CreateVendorRequest;
import com.company.fms.payable.dto.VendorResponse;
import com.company.fms.payable.dto.VendorStatement;
import com.company.fms.payment.Payment;
import com.company.fms.payment.PaymentRepository;
import com.company.fms.shared.ConflictException;
import com.company.fms.shared.CurrentUser;
import com.company.fms.shared.ResourceNotFoundException;

@Service
@Transactional(readOnly = true)
public class VendorService {

    private final VendorRepository repository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final CurrentUser currentUser;

    public VendorService(VendorRepository repository, InvoiceRepository invoiceRepository,
            PaymentRepository paymentRepository, CurrentUser currentUser) {
        this.repository = repository;
        this.invoiceRepository = invoiceRepository;
        this.paymentRepository = paymentRepository;
        this.currentUser = currentUser;
    }

    public Page<VendorResponse> findAll(String search, String status, Pageable pageable) {
        if (search != null && !search.isBlank() && status != null && !status.isBlank()) {
            return repository.findByStatusAndVendorNameContainingIgnoreCaseOrStatusAndVendorCodeContainingIgnoreCaseOrderByVendorNameAsc(
                    status, search, status, search, pageable).map(VendorResponse::from);
        }
        if (search != null && !search.isBlank()) {
            return repository.findByVendorNameContainingIgnoreCaseOrVendorCodeContainingIgnoreCaseOrderByVendorNameAsc(
                    search, search, pageable).map(VendorResponse::from);
        }
        if (status != null && !status.isBlank()) {
            return repository.findByStatusOrderByVendorNameAsc(status, pageable).map(VendorResponse::from);
        }
        return repository.findAllByOrderByVendorNameAsc(pageable).map(VendorResponse::from);
    }

    public VendorResponse findById(String id) {
        return VendorResponse.from(getVendor(id));
    }

    @Transactional
    public VendorResponse create(CreateVendorRequest request) {
        if (repository.findByVendorCode(request.vendorCode().trim()).isPresent()) {
            throw new ConflictException("Vendor code already exists: " + request.vendorCode());
        }
        Vendor vendor = new Vendor(
                java.util.UUID.randomUUID().toString(),
                request.vendorCode().trim(),
                request.vendorName().trim(),
                request.contactPerson(),
                request.email(),
                request.phoneNumber(),
                request.address(),
                request.taxId(),
                null,
                null,
                currentUser.get());
        return VendorResponse.from(repository.saveAndFlush(vendor));
    }

    @Transactional
    public VendorResponse update(String id, CreateVendorRequest request) {
        Vendor vendor = getVendor(id);
        vendor.update(request.vendorName(), request.contactPerson(), request.email(), request.phoneNumber(),
                request.address(), request.taxId(), null, null);
        return VendorResponse.from(repository.save(vendor));
    }

    @Transactional
    public VendorResponse setActive(String id, boolean active) {
        Vendor vendor = getVendor(id);
        vendor.setActive(active);
        return VendorResponse.from(repository.save(vendor));
    }

    @Transactional
    public void deleteVendor(String id) {
        Vendor vendor = getVendor(id);
        vendor.setActive(false);
        repository.save(vendor);
    }

    public ApAgingReport apAgingReport(LocalDate asOfDate) {
        LocalDate asOf = asOfDate == null ? LocalDate.now() : asOfDate;
        List<Invoice> invoices = invoiceRepository.findByInvoiceType("PAYABLE");
        java.util.Map<String, List<Invoice>> byVendor = new java.util.HashMap<>();
        for (Invoice invoice : invoices) {
            if (invoice.getRemainingBalance().signum() <= 0) {
                continue;
            }
            byVendor.computeIfAbsent(invoice.getVendorId() == null ? "UNKNOWN" : invoice.getVendorId(),
                    k -> new ArrayList<>()).add(invoice);
        }
        List<ApAgingReport.Item> items = new ArrayList<>();
        BigDecimal[] totals = new BigDecimal[5];
        for (int i = 0; i < 5; i++) {
            totals[i] = BigDecimal.ZERO;
        }
        for (java.util.Map.Entry<String, List<Invoice>> e : byVendor.entrySet()) {
            BigDecimal[] buckets = new BigDecimal[5];
            for (int i = 0; i < 5; i++) {
                buckets[i] = BigDecimal.ZERO;
            }
            String vendorCode = "";
            String vendorName = "";
            for (Invoice invoice : e.getValue()) {
                if (invoice.getVendorCode() != null && !invoice.getVendorCode().isEmpty()) {
                    vendorCode = invoice.getVendorCode();
                }
                if (vendorName.isEmpty() && invoice.getPartyName() != null) {
                    vendorName = invoice.getPartyName();
                }
                long days = invoice.getDueDate() == null ? 0
                        : ChronoUnit.DAYS.between(invoice.getDueDate(), asOf);
                BigDecimal bal = invoice.getRemainingBalance();
                int b = days <= 0 ? 0 : days <= 30 ? 1 : days <= 60 ? 2 : days <= 90 ? 3 : 4;
                buckets[b] = buckets[b].add(bal);
            }
            BigDecimal total = buckets[0].add(buckets[1]).add(buckets[2]).add(buckets[3]).add(buckets[4]);
            items.add(new ApAgingReport.Item(e.getKey(), vendorCode, vendorName,
                    buckets[0], buckets[1], buckets[2], buckets[3], buckets[4], total));
            for (int i = 0; i < 5; i++) {
                totals[i] = totals[i].add(buckets[i]);
            }
        }
        BigDecimal grandTotal = totals[0].add(totals[1]).add(totals[2]).add(totals[3]).add(totals[4]);
        return new ApAgingReport(asOf, items, totals[0], totals[1], totals[2], totals[3], totals[4], grandTotal);
    }

    public VendorStatement getStatement(String id) {
        Vendor vendor = getVendor(id);
        List<Invoice> invoices = invoiceRepository.findByVendorId(id);
        List<VendorStatement.Line> lines = new ArrayList<>();
        BigDecimal running = BigDecimal.ZERO;
        for (Invoice invoice : invoices) {
            BigDecimal amount = invoice.getTotalAmount();
            running = running.add(amount);
            lines.add(new VendorStatement.Line(
                    invoice.getJournalEntryId() == null ? invoice.getId() : invoice.getJournalEntryId(),
                    invoice.getIssueDate().toString(),
                    "Invoice " + invoice.getInvoiceNumber(),
                    amount,
                    BigDecimal.ZERO,
                    running));
            for (Payment payment : paymentRepository.findByInvoiceId(invoice.getId())) {
                running = running.subtract(payment.getAmount());
                lines.add(new VendorStatement.Line(
                        payment.getId(),
                        payment.getPaymentDate().toString(),
                        (payment.getPaymentType().equals("PAYMENT") ? "Payment " : "Receipt ")
                                + payment.getPaymentNumber(),
                        BigDecimal.ZERO,
                        payment.getAmount(),
                        running));
            }
        }
        BigDecimal closing = running;
        return new VendorStatement(vendor.getId(), vendor.getVendorCode(), vendor.getVendorName(),
                LocalDate.of(2000, 1, 1), LocalDate.now(),
                BigDecimal.ZERO, closing, lines);
    }

    private Vendor getVendor(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found: " + id));
    }
}
