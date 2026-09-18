import { fmsFetch } from "./fms-client";
import type { TrialBalanceReport, IncomeStatementReport, BalanceSheetReport } from "../types/fms";

export async function getTrialBalance(periodId: string): Promise<TrialBalanceReport> {
  return fmsFetch<TrialBalanceReport>(`/api/fms/report/trial-balance?periodId=${periodId}`);
}

export async function getIncomeStatement(periodId: string): Promise<IncomeStatementReport> {
  return fmsFetch<IncomeStatementReport>(`/api/fms/reports/income-statement?periodId=${periodId}`);
}

export async function getBalanceSheet(periodId: string): Promise<BalanceSheetReport> {
  return fmsFetch<BalanceSheetReport>(`/api/fms/reports/balance-sheet?periodId=${periodId}`);
}