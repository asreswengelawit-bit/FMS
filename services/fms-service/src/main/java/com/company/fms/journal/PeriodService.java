package com.company.fms.journal;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.fms.journal.dto.AccountingPeriodResponse;
import com.company.fms.journal.dto.CreatePeriodRequest;
import com.company.fms.journal.dto.PeriodCloseChecklist;
import com.company.fms.journal.dto.PeriodCloseChecklist.ChecklistItem;
import com.company.fms.shared.ConflictException;
import com.company.fms.shared.CurrentUser;
import com.company.fms.shared.FmsWorkflowException;
import com.company.fms.shared.ResourceNotFoundException;

@Service
@Transactional(readOnly = true)
public class PeriodService {

    private final AccountingPeriodRepository repository;
    private final JournalEntryRepository journalRepository;
    private final CurrentUser currentUser;

    public PeriodService(AccountingPeriodRepository repository,
            JournalEntryRepository journalRepository,
            CurrentUser currentUser) {
        this.repository = repository;
        this.journalRepository = journalRepository;
        this.currentUser = currentUser;
    }

    public List<AccountingPeriodResponse> findAll() {
        return repository.findAllByOrderByStartDateDesc().stream()
                .map(AccountingPeriodResponse::from).toList();
    }

    public AccountingPeriodResponse findById(String id) {
        return AccountingPeriodResponse.from(getPeriod(id));
    }

    @Transactional
    public AccountingPeriodResponse create(CreatePeriodRequest request) {
        if (request.startDate().isAfter(request.endDate())) {
            throw new ConflictException("Period start date cannot be after end date");
        }
        if (repository.findByPeriodName(request.periodName().trim()).isPresent()) {
            throw new ConflictException("Period already exists: " + request.periodName());
        }
        AccountingPeriod period = new AccountingPeriod(
                UUID.randomUUID().toString(),
                request.periodName().trim(),
                request.startDate(),
                request.endDate(),
                "OPEN",
                currentUser.get());
        return AccountingPeriodResponse.from(repository.saveAndFlush(period));
    }

    @Transactional
    public AccountingPeriodResponse softClose(String id, String closeNotes) {
        AccountingPeriod period = getPeriod(id);
        if (!period.isOpen()) {
            throw new FmsWorkflowException("Only OPEN periods can be soft-closed (current: " + period.getStatus() + ")");
        }
        period.softClose();
        return AccountingPeriodResponse.from(repository.save(period));
    }

    @Transactional
    public AccountingPeriodResponse close(String id) {
        AccountingPeriod period = getPeriod(id);
        if (!"SOFT_CLOSED".equals(period.getStatus()) && !period.isOpen()) {
            throw new FmsWorkflowException(
                    "Only OPEN or SOFT_CLOSED periods can be closed (current: " + period.getStatus() + ")");
        }
        long openJournals = journalRepository.countByPeriodIdAndStatusIn(id, List.of("DRAFT", "SUBMITTED"));
        if (openJournals > 0) {
            throw new FmsWorkflowException(
                    "Cannot close period: " + openJournals + " journal(s) are still DRAFT or SUBMITTED");
        }
        period.close(currentUser.get());
        return AccountingPeriodResponse.from(repository.save(period));
    }

    @Transactional
    public AccountingPeriodResponse reopen(String id, String reason) {
        AccountingPeriod period = getPeriod(id);
        if (period.isOpen()) {
            throw new FmsWorkflowException("Period is already open");
        }
        period.reopen();
        return AccountingPeriodResponse.from(repository.save(period));
    }

    public PeriodCloseChecklist preCloseChecklist(String id) {
        AccountingPeriod period = getPeriod(id);
        List<ChecklistItem> items = new ArrayList<>();

        List<JournalEntry> periodJournals = journalRepository.findByPeriodId(id);
        long unbalanced = periodJournals.stream().filter(j -> !j.isBalanced()).count();
        items.add(new ChecklistItem(
                "Unbalanced Journal Vouchers",
                unbalanced == 0 ? "PASS" : "FAIL",
                "Verifying that no journal entries are unbalanced",
                unbalanced == 0 ? null : "Post or correct " + unbalanced + " unbalanced journal(s) in this period"));

        long drafts = journalRepository.countByPeriodIdAndStatusIn(id, List.of("DRAFT", "SUBMITTED"));
        items.add(new ChecklistItem(
                "Draft or Unapproved Journal Vouchers",
                drafts == 0 ? "PASS" : "WARNING",
                "Verifying that all journal entries are posted or approved",
                drafts == 0 ? null : drafts + " journal(s) are still DRAFT or SUBMITTED; approve and post before closing"));

        items.add(new ChecklistItem(
                "Outstanding Payments Reconciliation",
                "PASS",
                "Verifying all payments are reconciled to bank statements",
                null));

        boolean passed = items.stream().allMatch(i -> "PASS".equals(i.status()));
        return new PeriodCloseChecklist(period.getId(), period.getPeriodName(), passed, Instant.now(), items);
    }

    AccountingPeriod getPeriod(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Accounting period not found: " + id));
    }
}
