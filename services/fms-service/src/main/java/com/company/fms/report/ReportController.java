package com.company.fms.report;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.company.fms.report.dto.BalanceSheetReport;
import com.company.fms.report.dto.GeneralLedgerReport;
import com.company.fms.report.dto.IncomeStatementReport;
import com.company.fms.report.dto.TrialBalanceReport;

@RestController
@RequestMapping("/api/fms/reports")
public class ReportController {

    private static final String READ_ROLES =
            "hasAnyRole('admin', 'finance_manager', 'general_accountant', 'viewer')";

    private final ReportService service;

    public ReportController(ReportService service) {
        this.service = service;
    }

    @GetMapping("/trial-balance")
    @PreAuthorize(READ_ROLES)
    public TrialBalanceReport trialBalance(@RequestParam(required = false) String periodId) {
        return service.trialBalance(periodId);
    }

    @GetMapping("/general-ledger")
    @PreAuthorize(READ_ROLES)
    public GeneralLedgerReport generalLedger(@RequestParam String accountId,
            @RequestParam(required = false) String periodId) {
        return service.generalLedger(accountId, periodId);
    }

    @GetMapping("/income-statement")
    @PreAuthorize(READ_ROLES)
    public IncomeStatementReport incomeStatement(@RequestParam(required = false) String periodId) {
        return service.incomeStatement(periodId);
    }

    @GetMapping("/balance-sheet")
    @PreAuthorize(READ_ROLES)
    public BalanceSheetReport balanceSheet(@RequestParam(required = false) String periodId) {
        return service.balanceSheet(periodId);
    }
}
