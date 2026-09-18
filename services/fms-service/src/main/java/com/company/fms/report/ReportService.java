package com.company.fms.report;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.fms.chartofaccount.Account;
import com.company.fms.chartofaccount.AccountRepository;
import com.company.fms.journal.AccountingPeriod;
import com.company.fms.journal.AccountingPeriodRepository;
import com.company.fms.journal.JournalEntry;
import com.company.fms.journal.JournalEntryRepository;
import com.company.fms.journal.JournalLine;
import com.company.fms.report.dto.BalanceSheetReport;
import com.company.fms.report.dto.FinancialStatementItem;
import com.company.fms.report.dto.GeneralLedgerReport;
import com.company.fms.report.dto.GeneralLedgerReport.LedgerLine;
import com.company.fms.report.dto.IncomeStatementReport;
import com.company.fms.report.dto.TrialBalanceReport;
import com.company.fms.report.dto.TrialBalanceReport.TrialBalanceItem;
import com.company.fms.shared.ResourceNotFoundException;

@Service
@Transactional(readOnly = true)
public class ReportService {

    private final AccountRepository accountRepository;
    private final JournalEntryRepository journalRepository;
    private final AccountingPeriodRepository periodRepository;

    public ReportService(AccountRepository accountRepository,
            JournalEntryRepository journalRepository,
            AccountingPeriodRepository periodRepository) {
        this.accountRepository = accountRepository;
        this.journalRepository = journalRepository;
        this.periodRepository = periodRepository;
    }

    public TrialBalanceReport trialBalance(String periodId) {
        AccountingPeriod period = resolvePeriod(periodId);
        List<JournalLine> postedLines = postedLines(periodId);
        Map<String, long[]> turnovers = new HashMap<>();
        for (JournalLine line : postedLines) {
            long[] t = turnovers.computeIfAbsent(line.getAccountId(), k -> new long[2]);
            t[0] += toLongCents(line.getDebitAmount());
            t[1] += toLongCents(line.getCreditAmount());
        }
        List<Account> accounts = accountRepository.findAllByOrderByCodeAsc();
        List<TrialBalanceItem> items = new ArrayList<>();
        BigDecimal totalDebit = BigDecimal.ZERO;
        BigDecimal totalCredit = BigDecimal.ZERO;
        for (Account account : accounts) {
            long[] t = turnovers.getOrDefault(account.getId(), new long[2]);
            BigDecimal debit = fromLongCents(t[0]);
            BigDecimal credit = fromLongCents(t[1]);
            BigDecimal closing = account.getBalance() == null ? BigDecimal.ZERO : account.getBalance();
            BigDecimal opening = estimateOpening(closing, debit, credit, account.getNormalBalance());
            items.add(new TrialBalanceItem(
                    account.getId(), account.getCode(), account.getName(), account.getType(),
                    opening, debit, credit, closing));
            totalDebit = totalDebit.add(debit);
            totalCredit = totalCredit.add(credit);
        }
        return new TrialBalanceReport(period.getId(), period.getPeriodName(), items,
                totalDebit, totalCredit, totalDebit.compareTo(totalCredit) == 0);
    }

    public GeneralLedgerReport generalLedger(String accountId, String periodId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found: " + accountId));
        AccountingPeriod period = resolvePeriod(periodId);
        List<JournalLine> lines = new ArrayList<>();
        BigDecimal debitTurnover = BigDecimal.ZERO;
        BigDecimal creditTurnover = BigDecimal.ZERO;
        List<LedgerLine> ledgerLines = new ArrayList<>();
        List<String> statuses = List.of("POSTED");
        List<JournalEntry> entries = journalRepository.findByStatusIn(statuses);
        long running = 0;
        for (JournalEntry entry : entries) {
            if (!period.getId().equals(entry.getPeriodId())) {
                continue;
            }
            for (JournalLine line : entry.getLines()) {
                if (!account.getId().equals(line.getAccountId())) {
                    continue;
                }
                long cents = toLongCents(line.getDebitAmount()) - toLongCents(line.getCreditAmount());
                running += cents;
                debitTurnover = debitTurnover.add(line.getDebitAmount());
                creditTurnover = creditTurnover.add(line.getCreditAmount());
                ledgerLines.add(new LedgerLine(
                        line.getId(),
                        entry.getId(),
                        entry.getCreatedAt() != null ? entry.getCreatedAt().toString().substring(0, 10)
                                : entry.getPostedAt() != null ? entry.getPostedAt().toString().substring(0, 10) : "",
                        entry.getDescription(),
                        line.getDebitAmount(),
                        line.getCreditAmount(),
                        fromLongCents(running)));
            }
        }
        BigDecimal closing = fromLongCents(running);
        return new GeneralLedgerReport(
                account.getId(), account.getCode(), account.getName(),
                period.getId(), period.getPeriodName(),
                BigDecimal.ZERO, debitTurnover, creditTurnover, closing, ledgerLines);
    }

    public IncomeStatementReport incomeStatement(String periodId) {
        AccountingPeriod period = resolvePeriod(periodId);
        List<Account> revenueAccounts = accountRepository.findByTypeOrderByCodeAsc("REVENUE");
        List<Account> expenseAccounts = accountRepository.findByTypeOrderByCodeAsc("EXPENSE");
        List<FinancialStatementItem> revenues = new ArrayList<>();
        List<FinancialStatementItem> expenses = new ArrayList<>();
        BigDecimal totalRevenue = BigDecimal.ZERO;
        BigDecimal totalExpense = BigDecimal.ZERO;
        for (Account account : revenueAccounts) {
            BigDecimal amount = account.getBalance();
            revenues.add(new FinancialStatementItem(account.getId(), account.getCode(), account.getName(), amount, 0));
            totalRevenue = totalRevenue.add(amount);
        }
        for (Account account : expenseAccounts) {
            BigDecimal amount = account.getBalance();
            expenses.add(new FinancialStatementItem(account.getId(), account.getCode(), account.getName(), amount, 0));
            totalExpense = totalExpense.add(amount);
        }
        return new IncomeStatementReport(period.getId(), period.getPeriodName(),
                revenues, expenses, totalRevenue, totalExpense, totalRevenue.subtract(totalExpense));
    }

    public BalanceSheetReport balanceSheet(String periodId) {
        AccountingPeriod period = resolvePeriod(periodId);
        List<Account> assets = accountRepository.findByTypeOrderByCodeAsc("ASSET");
        List<Account> liabilities = accountRepository.findByTypeOrderByCodeAsc("LIABILITY");
        List<Account> equity = accountRepository.findByTypeOrderByCodeAsc("EQUITY");
        List<FinancialStatementItem> assetItems = new ArrayList<>();
        List<FinancialStatementItem> liabilityItems = new ArrayList<>();
        List<FinancialStatementItem> equityItems = new ArrayList<>();
        BigDecimal totalAssets = BigDecimal.ZERO;
        BigDecimal totalLiabilities = BigDecimal.ZERO;
        BigDecimal totalEquity = BigDecimal.ZERO;
        for (Account account : assets) {
            BigDecimal amount = account.getBalance();
            assetItems.add(new FinancialStatementItem(account.getId(), account.getCode(), account.getName(), amount, 0));
            totalAssets = totalAssets.add(amount);
        }
        for (Account account : liabilities) {
            BigDecimal amount = account.getBalance();
            liabilityItems.add(new FinancialStatementItem(account.getId(), account.getCode(), account.getName(), amount, 0));
            totalLiabilities = totalLiabilities.add(amount);
        }
        for (Account account : equity) {
            BigDecimal amount = account.getBalance();
            equityItems.add(new FinancialStatementItem(account.getId(), account.getCode(), account.getName(), amount, 0));
            totalEquity = totalEquity.add(amount);
        }
        BigDecimal liabilitiesPlusEquity = totalLiabilities.add(totalEquity);
        return new BalanceSheetReport(period.getId(), period.getPeriodName(),
                assetItems, liabilityItems, equityItems,
                totalAssets, totalLiabilities, totalEquity,
                totalAssets.compareTo(liabilitiesPlusEquity) == 0);
    }

    private Account findAccount(String id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found: " + id));
    }

    private AccountingPeriod resolvePeriod(String periodId) {
        if (periodId == null || periodId.isBlank()) {
            return periodRepository.findFirstByStatusOrderByStartDateDesc("OPEN")
                    .orElseGet(() -> periodRepository.findAll().stream().findFirst().orElse(null));
        }
        return periodRepository.findById(periodId)
                .orElseThrow(() -> new ResourceNotFoundException("Period not found: " + periodId));
    }

    private List<JournalLine> postedLines(String periodId) {
        List<JournalLine> result = new ArrayList<>();
        for (JournalEntry entry : journalRepository.findByStatus("POSTED")) {
            if (periodId == null || periodId.isBlank() || periodId.equals(entry.getPeriodId())) {
                result.addAll(entry.getLines());
            }
        }
        return result;
    }

    private BigDecimal estimateOpening(BigDecimal closing, BigDecimal debit, BigDecimal credit, String normalBalance) {
        BigDecimal net = debit.subtract(credit);
        if ("CREDIT".equals(normalBalance)) {
            net = net.negate();
        }
        return closing.subtract(net);
    }

    private long toLongCents(BigDecimal value) {
        return value == null ? 0 : value.movePointRight(2).longValue();
    }

    private BigDecimal fromLongCents(long cents) {
        return BigDecimal.valueOf(cents, 2);
    }
}
