package com.company.fms.invoice;

import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.fms.chartofaccount.Account;
import com.company.fms.chartofaccount.AccountService;
import com.company.fms.invoice.dto.CreateInvoiceRequest;
import com.company.fms.invoice.dto.InvoiceResponse;
import com.company.fms.journal.AccountingPeriod;
import com.company.fms.journal.AccountingPeriodRepository;
import com.company.fms.journal.JournalEntry;
import com.company.fms.journal.JournalEntryRepository;
import com.company.fms.journal.JournalLine;
import com.company.fms.shared.BadRequestException;
import com.company.fms.shared.ConflictException;
import com.company.fms.shared.CurrentUser;
import com.company.fms.shared.FmsWorkflowException;
import com.company.fms.shared.ResourceNotFoundException;

@Service
@Transactional(readOnly = true)
public class InvoiceService {

    private final InvoiceRepository repository;
    private final AccountingPeriodRepository periodRepository;
    private final AccountService accountService;
    private final JournalEntryRepository journalRepository;
    private final CurrentUser currentUser;

    public InvoiceService(InvoiceRepository repository,
            AccountingPeriodRepository periodRepository,
            AccountService accountService,
            JournalEntryRepository journalRepository,
            CurrentUser currentUser) {
        this.repository = repository;
        this.periodRepository = periodRepository;
        this.accountService = accountService;
        this.journalRepository = journalRepository;
        this.currentUser = currentUser;
    }

    public Page<InvoiceResponse> findAll(Pageable pageable) {
        return repository.findAllByOrderByCreatedAtDesc(pageable).map(InvoiceResponse::from);
    }

    public InvoiceResponse findById(String id) {
        return InvoiceResponse.from(getInvoice(id));
    }

    @Transactional
    public InvoiceResponse create(CreateInvoiceRequest request) {
        AccountingPeriod period = periodRepository.findById(request.periodId())
                .orElseThrow(() -> new BadRequestException("Unknown accounting period: " + request.periodId()));
        if (!period.isOpen()) {
            throw new FmsWorkflowException(
                    "Cannot create an invoice in period '" + period.getPeriodName() + "' because it is "
                            + period.getStatus());
        }
        String type = normalizeType(request.invoiceType());
        if (repository.findById(request.invoiceNumber()).isPresent()) {
            throw new ConflictException("Invoice number already exists: " + request.invoiceNumber());
        }

        Account control = resolveControlAccount(request.controlAccountId(), type);
        BigDecimal total = BigDecimal.ZERO;
        for (CreateInvoiceRequest.InvoiceLineRequest line : request.lines()) {
            Account acct = accountService.getAccount(line.accountId());
            if (!acct.isPostingAllowed()) {
                throw new FmsWorkflowException("Posting is not allowed to account: " + acct.getCode());
            }
            total = total.add(line.quantity().multiply(line.unitPrice()));
        }

        Invoice invoice = new Invoice(
                UUID.randomUUID().toString(),
                request.invoiceNumber(),
                type,
                invoicePartyName(request, type),
                period.getId(),
                period.getPeriodName(),
                request.issueDate(),
                request.dueDate(),
                "DRAFT",
                total,
                control.getId(),
                control.getCode(),
                control.getName(),
                type.equals("PAYABLE") ? request.vendorId() : null,
                null,
                type.equals("RECEIVABLE") ? request.customerId() : null,
                null,
                currentUser.get());

        for (CreateInvoiceRequest.InvoiceLineRequest line : request.lines()) {
            Account acct = accountService.getAccount(line.accountId());
            invoice.addLine(new InvoiceLine(
                    UUID.randomUUID().toString(),
                    acct.getId(),
                    acct.getCode(),
                    acct.getName(),
                    line.description(),
                    line.quantity(),
                    line.unitPrice(),
                    line.quantity().multiply(line.unitPrice())));
        }
        return InvoiceResponse.from(repository.saveAndFlush(invoice));
    }

    @Transactional
    public InvoiceResponse submit(String id) {
        Invoice invoice = getInvoice(id);
        if (!"DRAFT".equals(invoice.getStatus())) {
            throw new FmsWorkflowException("Only DRAFT invoices can be submitted (current: " + invoice.getStatus() + ")");
        }
        invoice.submit();
        return InvoiceResponse.from(repository.save(invoice));
    }

    @Transactional
    public InvoiceResponse approve(String id) {
        Invoice invoice = getInvoice(id);
        if (!"SUBMITTED".equals(invoice.getStatus())) {
            throw new FmsWorkflowException("Only SUBMITTED invoices can be approved (current: " + invoice.getStatus() + ")");
        }
        invoice.approve(currentUser.get());
        return InvoiceResponse.from(repository.save(invoice));
    }

    @Transactional
    public InvoiceResponse post(String id) {
        Invoice invoice = getInvoice(id);
        if (!"APPROVED".equals(invoice.getStatus())) {
            throw new FmsWorkflowException("Only APPROVED invoices can be posted (current: " + invoice.getStatus() + ")");
        }
        AccountingPeriod period = periodRepository.findById(invoice.getPeriodId()).orElseThrow();
        boolean payable = "PAYABLE".equals(invoice.getInvoiceType());

        String description = (payable ? "Invoice " : "Invoice ") + invoice.getInvoiceNumber();
        JournalEntry entry = new JournalEntry(
                UUID.randomUUID().toString(),
                period.getId(),
                period.getPeriodName(),
                description,
                "POSTED",
                currentUser.get());
        entry.setReversal(false);

        Account control = accountService.getAccount(invoice.getControlAccountId());
        if (payable) {
            for (InvoiceLine line : invoice.getLines()) {
                entry.addLine(new JournalLine(
                        UUID.randomUUID().toString(),
                        line.getAccountId(),
                        line.getAccountCode(),
                        line.getAccountName(),
                        line.getTotalPrice(),
                        BigDecimal.ZERO,
                        line.getDescription()));
            }
            entry.addLine(new JournalLine(
                    UUID.randomUUID().toString(),
                    control.getId(),
                    control.getCode(),
                    control.getName(),
                    BigDecimal.ZERO,
                    invoice.getTotalAmount(),
                    "AP - " + invoice.getPartyName()));
        } else {
            entry.addLine(new JournalLine(
                    UUID.randomUUID().toString(),
                    control.getId(),
                    control.getCode(),
                    control.getName(),
                    invoice.getTotalAmount(),
                    BigDecimal.ZERO,
                    "AR - " + invoice.getPartyName()));
            for (InvoiceLine line : invoice.getLines()) {
                entry.addLine(new JournalLine(
                        UUID.randomUUID().toString(),
                        line.getAccountId(),
                        line.getAccountCode(),
                        line.getAccountName(),
                        BigDecimal.ZERO,
                        line.getTotalPrice(),
                        line.getDescription()));
            }
        }
        entry.recalcTotals();
        if (!entry.isBalanced()) {
            throw new FmsWorkflowException("Invoice posting journal is not balanced");
        }
        JournalEntry saved = journalRepository.saveAndFlush(entry);
        invoice.post(saved.getId());
        return InvoiceResponse.from(repository.saveAndFlush(invoice));
    }

    public Invoice getInvoice(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + id));
    }

    @Transactional
    public void flush(Invoice invoice) {
        repository.saveAndFlush(invoice);
    }

    private String normalizeType(String type) {
        String t = type == null ? "" : type.toUpperCase();
        if ("PAYABLE".equals(t) || "AP".equals(t) || "VENDOR".equals(t)) {
            return "PAYABLE";
        }
        if ("RECEIVABLE".equals(t) || "AR".equals(t) || "CUSTOMER".equals(t)) {
            return "RECEIVABLE";
        }
        throw new BadRequestException("Unknown invoice type: " + type);
    }

    private Account resolveControlAccount(String controlAccountId, String type) {
        if (controlAccountId != null && !controlAccountId.isBlank()) {
            return accountService.getAccount(controlAccountId);
        }
        throw new BadRequestException("A control account is required for " + type + " invoices");
    }

    private String invoicePartyName(CreateInvoiceRequest request, String type) {
        if (request.partyName() != null && !request.partyName().isBlank()) {
            return request.partyName();
        }
        if (type.equals("PAYABLE") && request.vendorId() != null) {
            return request.vendorId();
        }
        if (type.equals("RECEIVABLE") && request.customerId() != null) {
            return request.customerId();
        }
        return request.invoiceNumber();
    }
}
