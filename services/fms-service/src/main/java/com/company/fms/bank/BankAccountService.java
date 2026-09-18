package com.company.fms.bank;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.fms.bank.dto.BankAccountResponse;
import com.company.fms.bank.dto.BankReconciliationSummary;
import com.company.fms.bank.dto.BankStatementLineResponse;
import com.company.fms.bank.dto.BankTransaction;
import com.company.fms.bank.dto.CashPosition;
import com.company.fms.bank.dto.CreateBankAccountRequest;
import com.company.fms.bank.dto.ImportStatementLineRequest;
import com.company.fms.journal.JournalEntry;
import com.company.fms.journal.JournalEntryRepository;
import com.company.fms.shared.BankAccount;
import com.company.fms.shared.BankAccountRepository;
import com.company.fms.shared.BankStatementLine;
import com.company.fms.shared.BankStatementLineRepository;
import com.company.fms.shared.CurrentUser;
import com.company.fms.shared.ResourceNotFoundException;

@Service
@Transactional(readOnly = true)
public class BankAccountService {

    private final BankAccountRepository repository;
    private final BankStatementLineRepository statementRepository;
    private final JournalEntryRepository journalRepository;
    private final CurrentUser currentUser;

    public BankAccountService(BankAccountRepository repository,
            BankStatementLineRepository statementRepository,
            JournalEntryRepository journalRepository,
            CurrentUser currentUser) {
        this.repository = repository;
        this.statementRepository = statementRepository;
        this.journalRepository = journalRepository;
        this.currentUser = currentUser;
    }

    public List<BankAccountResponse> findAll() {
        return repository.findAllByOrderByAccountNameAsc().stream()
                .map(BankAccountResponse::from).toList();
    }

    public BankAccountResponse findById(String id) {
        return BankAccountResponse.from(getAccount(id));
    }

    @Transactional
    public BankAccountResponse create(CreateBankAccountRequest request) {
        BankAccount account = new BankAccount(
                UUID.randomUUID().toString(),
                request.accountName().trim(),
                request.accountNumber().trim(),
                request.bankName(),
                request.resolvedBranch(),
                request.currency(),
                request.openingBalance(),
                currentUser.get());
        return BankAccountResponse.from(repository.saveAndFlush(account));
    }

    @Transactional
    public BankAccountResponse update(String id, CreateBankAccountRequest request) {
        BankAccount account = getAccount(id);
        account.update(request.accountName(), request.accountNumber(), request.bankName(),
                request.resolvedBranch(), request.currency(), request.openingBalance());
        return BankAccountResponse.from(repository.save(account));
    }

    @Transactional
    public BankAccountResponse setActive(String id, boolean active) {
        BankAccount account = getAccount(id);
        account.setActive(active);
        return BankAccountResponse.from(repository.save(account));
    }

    @Transactional
    public BankAccountResponse updateStatus(String id, String status) {
        BankAccount account = getAccount(id);
        account.setActive("ACTIVE".equalsIgnoreCase(status));
        return BankAccountResponse.from(repository.save(account));
    }

    public CashPosition cashPosition(String accountId) {
        BankAccount account = getAccount(accountId);
        long unmatched = statementRepository
                .countByBankAccountIdAndReconciliationStatus(accountId, "UNMATCHED");
        BigDecimal statementBalance = account.getCurrentBalance().add(statementNet(accountId));
        return new CashPosition(
                account.getId(),
                account.getAccountName(),
                account.getCurrentBalance(),
                statementBalance,
                statementBalance.subtract(account.getCurrentBalance()),
                unmatched);
    }

    @Transactional
    public List<BankStatementLineResponse> importStatementLines(String accountId,
            List<ImportStatementLineRequest> lines) {
        getAccount(accountId);
        return lines.stream().map(line -> {
            BankStatementLine entity = new BankStatementLine(
                    UUID.randomUUID().toString(),
                    accountId,
                    line.transactionDate(),
                    line.description(),
                    line.amount(),
                    normalizeLineType(line.type()),
                    line.reference());
            return BankStatementLineResponse.from(statementRepository.save(entity));
        }).toList();
    }

    public Page<BankStatementLineResponse> reconciliationReport(String accountId, String status, Pageable pageable) {
        getAccount(accountId);
        if (status != null && !status.isBlank()) {
            return statementRepository
                    .findByBankAccountIdAndReconciliationStatusOrderByTransactionDateDesc(accountId, status, pageable)
                    .map(BankStatementLineResponse::from);
        }
        return statementRepository
                .findByBankAccountIdOrderByTransactionDateDesc(accountId, pageable)
                .map(BankStatementLineResponse::from);
    }

    @Transactional
    public BankStatementLineResponse matchStatementLine(String lineId, String paymentId) {
        BankStatementLine line = getStatementLine(lineId);
        line.markMatched(paymentId);
        return BankStatementLineResponse.from(statementRepository.save(line));
    }

    @Transactional
    public BankStatementLineResponse flagException(String lineId) {
        BankStatementLine line = getStatementLine(lineId);
        line.flagException();
        return BankStatementLineResponse.from(statementRepository.save(line));
    }

    public BankReconciliationSummary summarizeReconciliation(String accountId) {
        BankAccount account = getAccount(accountId);
        List<JournalEntry> entries = journalRepository.findAllByOrderByCreatedAtDesc();
        List<BankTransaction> transactions = new ArrayList<>();
        BigDecimal totalCredits = BigDecimal.ZERO;
        BigDecimal totalDebits = BigDecimal.ZERO;
        long matched = 0;
        for (JournalEntry entry : entries) {
            if (!"POSTED".equals(entry.getStatus()) || entry.getLines().isEmpty()) {
                continue;
            }
            var line = entry.getLines().get(0);
            if (line.getAccountId() != null
                    && matchesBank(account, line.getAccountCode())) {
                boolean incoming = line.getDebitAmount().signum() > 0;
                BigDecimal amount = incoming ? line.getDebitAmount() : line.getCreditAmount();
                if (incoming) {
                    totalDebits = totalDebits.add(amount);
                } else {
                    totalCredits = totalCredits.add(amount);
                }
                String type = incoming ? "DEPOSIT" : "PAYMENT";
                boolean reconciled = entry.getPostedAt() != null;
                if (reconciled) {
                    matched++;
                }
                transactions.add(BankTransaction.from(
                        entry.getId(),
                        entry.getId().substring(0, Math.min(8, entry.getId().length())),
                        entry.getDescription(),
                        type,
                        entry.getPostedAt() != null ? entry.getPostedAt() : entry.getCreatedAt(),
                        amount,
                        true,
                        entry.getReversalOfJournalId()));
            }
        }
        return new BankReconciliationSummary(
                account.getId(),
                account.getAccountName(),
                account.getCurrentBalance(),
                account.getCurrentBalance(),
                totalCredits,
                totalDebits,
                matched,
                transactions.size() - matched,
                transactions);
    }

    private boolean matchesBank(BankAccount account, String accountCode) {
        if (accountCode == null) {
            return false;
        }
        String normalized = accountCode.toUpperCase();
        return normalized.startsWith("BANK")
                || normalized.startsWith("101")
                || account.getAccountName().toUpperCase().contains("BANK");
    }

    private BankAccount getAccount(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bank account not found: " + id));
    }

    private BankStatementLine getStatementLine(String id) {
        return statementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bank statement line not found: " + id));
    }

    private BigDecimal statementNet(String accountId) {
        return statementRepository.findByBankAccountIdOrderByTransactionDateDesc(accountId).stream()
                .filter(l -> "CREDIT".equals(l.getType()))
                .map(BankStatementLine::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private String normalizeLineType(String type) {
        String t = type == null ? "" : type.toUpperCase();
        if ("CREDIT".equals(t) || "DEPOSIT".equals(t)) {
            return "CREDIT";
        }
        if ("DEBIT".equals(t) || "PAYMENT".equals(t) || "WITHDRAWAL".equals(t)) {
            return "DEBIT";
        }
        return t.isEmpty() ? "DEBIT" : t;
    }
}
