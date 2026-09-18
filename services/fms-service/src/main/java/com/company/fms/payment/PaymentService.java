package com.company.fms.payment;

import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.fms.chartofaccount.Account;
import com.company.fms.chartofaccount.AccountService;
import com.company.fms.invoice.Invoice;
import com.company.fms.invoice.InvoiceService;
import com.company.fms.journal.AccountingPeriod;
import com.company.fms.journal.AccountingPeriodRepository;
import com.company.fms.journal.JournalEntry;
import com.company.fms.journal.JournalEntryRepository;
import com.company.fms.journal.JournalLine;
import com.company.fms.payment.dto.CreatePaymentRequest;
import com.company.fms.payment.dto.PaymentResponse;
import com.company.fms.shared.BadRequestException;
import com.company.fms.shared.CurrentUser;
import com.company.fms.shared.FmsWorkflowException;
import com.company.fms.shared.ResourceNotFoundException;

@Service
@Transactional(readOnly = true)
public class PaymentService {

    private final PaymentRepository repository;
    private final AccountingPeriodRepository periodRepository;
    private final AccountService accountService;
    private final JournalEntryRepository journalRepository;
    private final InvoiceService invoiceService;
    private final CurrentUser currentUser;

    public PaymentService(PaymentRepository repository,
            AccountingPeriodRepository periodRepository,
            AccountService accountService,
            JournalEntryRepository journalRepository,
            InvoiceService invoiceService,
            CurrentUser currentUser) {
        this.repository = repository;
        this.periodRepository = periodRepository;
        this.accountService = accountService;
        this.journalRepository = journalRepository;
        this.invoiceService = invoiceService;
        this.currentUser = currentUser;
    }

    public Page<PaymentResponse> findAll(Pageable pageable) {
        return repository.findAllByOrderByCreatedAtDesc(pageable).map(PaymentResponse::from);
    }

    public PaymentResponse findById(String id) {
        return PaymentResponse.from(getPayment(id));
    }

    @Transactional
    public PaymentResponse create(CreatePaymentRequest request) {
        AccountingPeriod period = periodRepository.findById(request.periodId())
                .orElseThrow(() -> new BadRequestException("Unknown accounting period: " + request.periodId()));
        if (!period.isOpen()) {
            throw new FmsWorkflowException(
                    "Cannot create a payment in period '" + period.getPeriodName() + "' because it is "
                            + period.getStatus());
        }
        if (request.amount() != null && request.amount().signum() <= 0) {
            throw new BadRequestException("Payment amount must be greater than zero");
        }
        Account control = request.controlAccountId() == null ? null
                : accountService.getAccount(request.controlAccountId());

        String type = normalizeType(request.paymentType());
        Payment payment = new Payment(
                UUID.randomUUID().toString(),
                generatePaymentNumber(type),
                type,
                request.partyName(),
                period.getId(),
                period.getPeriodName(),
                request.paymentDate(),
                request.amount(),
                request.paymentMethod(),
                request.referenceNumber(),
                control == null ? null : control.getId(),
                control == null ? null : control.getCode(),
                control == null ? null : control.getName(),
                request.invoiceId(),
                request.invoiceNumber(),
                request.notes(),
                currentUser.get());
        return PaymentResponse.from(repository.saveAndFlush(payment));
    }

    @Transactional
    public PaymentResponse submit(String id) {
        Payment payment = getPayment(id);
        if (!"DRAFT".equals(payment.getStatus())) {
            throw new FmsWorkflowException("Only DRAFT payments can be submitted (current: " + payment.getStatus() + ")");
        }
        payment.submit();
        return PaymentResponse.from(repository.save(payment));
    }

    @Transactional
    public PaymentResponse approve(String id) {
        Payment payment = getPayment(id);
        if (!"SUBMITTED".equals(payment.getStatus())) {
            throw new FmsWorkflowException("Only SUBMITTED payments can be approved (current: " + payment.getStatus() + ")");
        }
        payment.approve(currentUser.get());
        return PaymentResponse.from(repository.save(payment));
    }

    @Transactional
    public PaymentResponse post(String id) {
        Payment payment = getPayment(id);
        if (!"APPROVED".equals(payment.getStatus())) {
            throw new FmsWorkflowException("Only APPROVED payments can be posted (current: " + payment.getStatus() + ")");
        }
        AccountingPeriod period = periodRepository.findById(payment.getPeriodId()).orElseThrow();
        boolean outgoing = "PAYMENT".equals(payment.getPaymentType());

        JournalEntry entry = new JournalEntry(
                UUID.randomUUID().toString(),
                period.getId(),
                period.getPeriodName(),
                (outgoing ? "Payment " : "Receipt ") + payment.getPaymentNumber(),
                "POSTED",
                currentUser.get());

        Account bankOrControl;
        if (payment.getControlAccountId() != null) {
            bankOrControl = accountService.getAccount(payment.getControlAccountId());
        } else {
            bankOrControl = accountService.getDefaultBankAccount();
        }

        Account partner = resolvePartnerAccount(payment, outgoing);
        if (outgoing) {
            entry.addLine(new JournalLine(
                    UUID.randomUUID().toString(),
                    partner.getId(), partner.getCode(), partner.getName(),
                    payment.getAmount(), BigDecimal.ZERO, "AP - " + payment.getPartyName()));
            entry.addLine(new JournalLine(
                    UUID.randomUUID().toString(),
                    bankOrControl.getId(), bankOrControl.getCode(), bankOrControl.getName(),
                    BigDecimal.ZERO, payment.getAmount(), "Against " + payment.getPaymentNumber()));
        } else {
            entry.addLine(new JournalLine(
                    UUID.randomUUID().toString(),
                    bankOrControl.getId(), bankOrControl.getCode(), bankOrControl.getName(),
                    payment.getAmount(), BigDecimal.ZERO, "Against " + payment.getPaymentNumber()));
            entry.addLine(new JournalLine(
                    UUID.randomUUID().toString(),
                    partner.getId(), partner.getCode(), partner.getName(),
                    BigDecimal.ZERO, payment.getAmount(), "AR - " + payment.getPartyName()));
        }
        entry.recalcTotals();
        if (!entry.isBalanced()) {
            throw new FmsWorkflowException("Payment posting journal is not balanced");
        }
        JournalEntry saved = journalRepository.saveAndFlush(entry);
        payment.post(saved.getId());
        payment.setRelatedEntityId(saved.getId());
        payment.setRelatedEntityCode(saved.getId());

        if (payment.getInvoiceId() != null) {
            Invoice invoice = invoiceService.getInvoice(payment.getInvoiceId());
            invoice.applyPayment(payment.getAmount());
            invoiceService.flush(invoice);
        }
        return PaymentResponse.from(repository.saveAndFlush(payment));
    }

    public Payment getPayment(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + id));
    }

    private Account resolvePartnerAccount(Payment payment, boolean outgoing) {
        if (!outgoing && payment.getInvoiceId() != null) {
            Invoice invoice = invoiceService.getInvoice(payment.getInvoiceId());
            if (invoice.getControlAccountId() != null) {
                return accountService.getAccount(invoice.getControlAccountId());
            }
        }
        if (outgoing && payment.getInvoiceId() != null) {
            Invoice invoice = invoiceService.getInvoice(payment.getInvoiceId());
            if (invoice.getControlAccountId() != null) {
                return accountService.getAccount(invoice.getControlAccountId());
            }
        }
        return accountService.getDefaultApOrArAccount(outgoing ? "PAYABLE" : "RECEIVABLE");
    }

    private String normalizeType(String type) {
        String t = type == null ? "" : type.toUpperCase();
        if ("PAYMENT".equals(t) || "OUTGOING".equals(t) || "VENDOR".equals(t)) {
            return "PAYMENT";
        }
        if ("RECEIPT".equals(t) || "INCOMING".equals(t) || "CUSTOMER".equals(t)) {
            return "RECEIPT";
        }
        throw new BadRequestException("Unknown payment type: " + type);
    }

    private String generatePaymentNumber(String type) {
        long count = repository.count();
        return (type.equals("PAYMENT") ? "PMT-" : "RCP-") + String.format("%06d", count + 1);
    }
}
