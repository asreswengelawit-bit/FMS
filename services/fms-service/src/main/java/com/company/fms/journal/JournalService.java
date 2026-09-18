package com.company.fms.journal;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.fms.chartofaccount.Account;
import com.company.fms.chartofaccount.AccountService;
import com.company.fms.journal.dto.CreateJournalEntryRequest;
import com.company.fms.journal.dto.JournalEntryResponse;
import com.company.fms.shared.BadRequestException;
import com.company.fms.shared.CurrentUser;
import com.company.fms.shared.FmsWorkflowException;
import com.company.fms.shared.ResourceNotFoundException;

@Service
@Transactional(readOnly = true)
public class JournalService {

    private final JournalEntryRepository repository;
    private final AccountingPeriodRepository periodRepository;
    private final AccountService accountService;
    private final CurrentUser currentUser;

    public JournalService(JournalEntryRepository repository,
            AccountingPeriodRepository periodRepository,
            AccountService accountService,
            CurrentUser currentUser) {
        this.repository = repository;
        this.periodRepository = periodRepository;
        this.accountService = accountService;
        this.currentUser = currentUser;
    }

    public Page<JournalEntryResponse> findAll(Pageable pageable) {
        return repository.findAllByOrderByCreatedAtDesc(pageable).map(JournalEntryResponse::from);
    }

    public JournalEntryResponse findById(String id) {
        return JournalEntryResponse.from(getEntry(id));
    }

    @Transactional
    public JournalEntryResponse create(CreateJournalEntryRequest request) {
        AccountingPeriod period = periodRepository.findById(request.periodId())
                .orElseThrow(() -> new BadRequestException("Unknown accounting period: " + request.periodId()));
        if (!period.isOpen()) {
            throw new FmsWorkflowException(
                    "Cannot create a journal in period '" + period.getPeriodName() + "' because it is "
                            + period.getStatus());
        }
        if (request.lines() == null || request.lines().isEmpty()) {
            throw new BadRequestException("A journal must have at least one line");
        }

        JournalEntry entry = new JournalEntry(
                UUID.randomUUID().toString(),
                period.getId(),
                period.getPeriodName(),
                request.description(),
                "DRAFT",
                currentUser.get());

        for (CreateJournalEntryRequest.JournalLineRequest line : request.lines()) {
            Account account = accountService.getAccount(line.accountId());
            if (!account.isPostingAllowed()) {
                throw new FmsWorkflowException("Posting is not allowed to account: " + account.getCode());
            }
            BigDecimal debit = line.debitAmount() == null ? BigDecimal.ZERO : line.debitAmount();
            BigDecimal credit = line.creditAmount() == null ? BigDecimal.ZERO : line.creditAmount();
            if (debit.signum() < 0 || credit.signum() < 0) {
                throw new BadRequestException("Debit and credit amounts cannot be negative");
            }
            entry.addLine(new JournalLine(
                    UUID.randomUUID().toString(),
                    account.getId(),
                    account.getCode(),
                    account.getName(),
                    debit,
                    credit,
                    line.description()));
        }
        entry.recalcTotals();
        if (!entry.isBalanced()) {
            throw new FmsWorkflowException(
                    "Journal is not balanced: total debit " + entry.getTotalDebit()
                            + " vs total credit " + entry.getTotalCredit());
        }
        return JournalEntryResponse.from(repository.saveAndFlush(entry));
    }

    @Transactional
    public JournalEntryResponse submit(String id) {
        JournalEntry entry = getEntry(id);
        if (!"DRAFT".equals(entry.getStatus())) {
            throw new FmsWorkflowException("Only DRAFT journals can be submitted (current: " + entry.getStatus() + ")");
        }
        entry.submit();
        return JournalEntryResponse.from(repository.save(entry));
    }

    @Transactional
    public JournalEntryResponse approve(String id) {
        JournalEntry entry = getEntry(id);
        if (!"SUBMITTED".equals(entry.getStatus())) {
            throw new FmsWorkflowException("Only SUBMITTED journals can be approved (current: " + entry.getStatus() + ")");
        }
        entry.approve(currentUser.get());
        return JournalEntryResponse.from(repository.save(entry));
    }

    @Transactional
    public JournalEntryResponse post(String id) {
        JournalEntry entry = getEntry(id);
        if (!"APPROVED".equals(entry.getStatus())) {
            throw new FmsWorkflowException("Only APPROVED journals can be posted (current: " + entry.getStatus() + ")");
        }
        if (!entry.isBalanced()) {
            throw new FmsWorkflowException("Cannot post an unbalanced journal");
        }
        entry.getLines().forEach(line -> accountService.getAccount(line.getAccountId())
                .applyPosting(line.getDebitAmount(), line.getCreditAmount()));
        entry.post();
        return JournalEntryResponse.from(repository.saveAndFlush(entry));
    }

    @Transactional
    public JournalEntryResponse createReversal(String originalId) {
        JournalEntry original = getEntry(originalId);
        if (!"POSTED".equals(original.getStatus())) {
            throw new FmsWorkflowException("Only POSTED journals can be reversed");
        }
        AccountingPeriod period = periodRepository.findById(original.getPeriodId())
                .orElseThrow(() -> new BadRequestException("Original period no longer exists"));
        if (!period.isOpen()) {
            throw new FmsWorkflowException("Cannot reverse into a closed period");
        }
        JournalEntry reversal = new JournalEntry(
                UUID.randomUUID().toString(),
                period.getId(),
                period.getPeriodName(),
                "Reversal of " + original.getDescription(),
                "DRAFT",
                currentUser.get());
        reversal.setReversal(true);
        reversal.setReversalOfJournalId(original.getId());
        original.getLines().forEach(line -> {
            reversal.addLine(new JournalLine(
                    UUID.randomUUID().toString(),
                    line.getAccountId(),
                    line.getAccountCode(),
                    line.getAccountName(),
                    line.getCreditAmount(),
                    line.getDebitAmount(),
                    line.getDescription()));
        });
        reversal.recalcTotals();
        return JournalEntryResponse.from(repository.saveAndFlush(reversal));
    }

    public JournalEntry getEntry(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Journal entry not found: " + id));
    }

    public long countDraftOrSubmitted() {
        return repository.countByStatusIn(List.of("DRAFT", "SUBMITTED"));
    }
}
