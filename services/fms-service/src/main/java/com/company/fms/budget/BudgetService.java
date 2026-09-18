package com.company.fms.budget;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.fms.budget.dto.BudgetResponse;
import com.company.fms.budget.dto.BudgetVarianceReport;
import com.company.fms.budget.dto.CreateBudgetRequest;
import com.company.fms.chartofaccount.Account;
import com.company.fms.chartofaccount.AccountService;
import com.company.fms.journal.AccountingPeriod;
import com.company.fms.journal.AccountingPeriodRepository;
import com.company.fms.shared.CurrentUser;
import com.company.fms.shared.FmsWorkflowException;
import com.company.fms.shared.ResourceNotFoundException;

@Service
@Transactional(readOnly = true)
public class BudgetService {

    private final BudgetRepository repository;
    private final AccountService accountService;
    private final AccountingPeriodRepository periodRepository;
    private final CurrentUser currentUser;

    public BudgetService(BudgetRepository repository, AccountService accountService,
            AccountingPeriodRepository periodRepository, CurrentUser currentUser) {
        this.repository = repository;
        this.accountService = accountService;
        this.periodRepository = periodRepository;
        this.currentUser = currentUser;
    }

    public Page<BudgetResponse> findAll(Integer fiscalYear, String status, Pageable pageable) {
        String period = fiscalYear == null ? null : String.valueOf(fiscalYear);
        if (period != null && status != null && !status.isBlank()) {
            return repository.findByBudgetPeriodAndStatusOrderByCreatedAtDesc(period, status, pageable)
                    .map(BudgetResponse::from);
        }
        if (period != null) {
            return repository.findByBudgetPeriodOrderByCreatedAtDesc(period, pageable).map(BudgetResponse::from);
        }
        if (status != null && !status.isBlank()) {
            return repository.findByStatusOrderByCreatedAtDesc(status, pageable).map(BudgetResponse::from);
        }
        return repository.findAllByOrderByCreatedAtDesc(pageable).map(BudgetResponse::from);
    }

    public BudgetResponse findById(String id) {
        return BudgetResponse.from(getBudget(id));
    }

    @Transactional
    public BudgetResponse create(CreateBudgetRequest request) {
        BigDecimal total = request.lines().stream()
                .map(CreateBudgetRequest.BudgetLineRequest::budgetAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        Budget budget = new Budget(
                UUID.randomUUID().toString(),
                "FY " + request.fiscalYear(),
                String.valueOf(request.fiscalYear()),
                null,
                request.description(),
                null,
                "DRAFT",
                total,
                null,
                null,
                currentUser.get(),
                currentUser.get());
        for (CreateBudgetRequest.BudgetLineRequest line : request.lines()) {
            Account account = accountService.getAccount(line.accountId());
            budget.addLine(new BudgetLine(
                    UUID.randomUUID().toString(),
                    account.getId(),
                    account.getCode(),
                    account.getName(),
                    line.budgetAmount()));
        }
        return BudgetResponse.from(repository.saveAndFlush(budget));
    }

    @Transactional
    public BudgetResponse submit(String id) {
        Budget budget = getBudget(id);
        if (!"DRAFT".equals(budget.getStatus())) {
            throw new FmsWorkflowException("Only DRAFT budgets can be submitted (current: " + budget.getStatus() + ")");
        }
        budget.submit();
        return BudgetResponse.from(repository.save(budget));
    }

    @Transactional
    public BudgetResponse approve(String id) {
        Budget budget = getBudget(id);
        if (!"SUBMITTED".equals(budget.getStatus())) {
            throw new FmsWorkflowException("Only SUBMITTED budgets can be approved (current: " + budget.getStatus() + ")");
        }
        budget.approve();
        return BudgetResponse.from(repository.save(budget));
    }

    public BudgetVarianceReport variance(String id, String periodId) {
        Budget budget = getBudget(id);
        AccountingPeriod period = periodRepository.findAll().stream().findFirst().orElse(null);
        BigDecimal totalBudget = BigDecimal.ZERO;
        BigDecimal totalActual = BigDecimal.ZERO;
        List<BudgetVarianceReport.Item> items = new ArrayList<>();
        for (BudgetLine line : budget.getLines()) {
            BigDecimal budgetAmount = line.getAllocatedAmount();
            BigDecimal actual = line.getPostedAmount().add(line.getPaidAmount());
            BigDecimal variance = budgetAmount.subtract(actual);
            BigDecimal variancePercent = budgetAmount.signum() == 0 ? BigDecimal.ZERO
                    : variance.divide(budgetAmount, 4, java.math.RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
            totalBudget = totalBudget.add(budgetAmount);
            totalActual = totalActual.add(actual);
            items.add(new BudgetVarianceReport.Item(
                    line.getAccountId(), line.getAccountCode(), line.getAccountName(),
                    budgetAmount, actual, variance, variancePercent));
        }
        return new BudgetVarianceReport(
                budget.getId(),
                parseFiscalYear(budget.getBudgetPeriod()),
                period == null ? null : period.getId(),
                period == null ? null : period.getPeriodName(),
                items,
                totalBudget,
                totalActual,
                totalBudget.subtract(totalActual));
    }

    @Deprecated
    public BudgetResponse deactivate(String id) {
        Budget budget = getBudget(id);
        budget.setStatus("INACTIVE");
        return BudgetResponse.from(repository.save(budget));
    }

    @Deprecated
    public BudgetResponse activate(String id) {
        Budget budget = getBudget(id);
        budget.setStatus("ACTIVE");
        return BudgetResponse.from(repository.save(budget));
    }

    private int parseFiscalYear(String budgetPeriod) {
        try {
            return (int) Double.parseDouble(budgetPeriod.trim());
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    public Budget getBudget(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found: " + id));
    }
}
