import { fmsFetch } from "./fms-client";
import type { TrialBalanceReport, IncomeStatementReport, BalanceSheetReport, TrialBalanceItem, FinancialStatementItem } from "../types/fms";

function fromTrialBalanceApi(v: any): TrialBalanceReport {
  const items: TrialBalanceItem[] = (v.items ?? []).map((i: any) => ({
    accountId: i.accountId,
    accountCode: i.accountCode,
    accountName: i.accountName,
    totalDebit: i.debitTurnover ?? i.totalDebit ?? 0,
    totalCredit: i.creditTurnover ?? i.totalCredit ?? 0,
    netBalance: i.closingBalance ?? i.netBalance ?? 0,
  }));
  const withMovements = items.some(i => i.totalDebit > 0 || i.totalCredit > 0);
  return {
    periodId: v.periodId,
    periodName: v.periodName,
    grandTotalDebit: v.totalDebit ?? 0,
    grandTotalCredit: v.totalCredit ?? 0,
    balanced: v.balanced ?? (v.totalDebit === v.totalCredit),
    items: withMovements
      ? items.filter(i => i.totalDebit > 0 || i.totalCredit > 0 || i.netBalance !== 0)
      : items,
  };
}

function fromStatementItemApi(v: any): FinancialStatementItem {
  return {
    accountId: v.accountId,
    accountCode: v.accountCode,
    accountName: v.accountName,
    accountType: v.accountType ?? "",
    amount: v.amount ?? 0,
  };
}

function fromIncomeStatementApi(v: any): IncomeStatementReport {
  return {
    periodId: v.periodId,
    periodName: v.periodName,
    revenueItems: (v.revenueItems ?? []).map(fromStatementItemApi),
    expenseItems: (v.expenseItems ?? []).map(fromStatementItemApi),
    totalRevenue: v.totalRevenue ?? 0,
    totalExpense: v.totalExpense ?? 0,
    netIncome: v.netIncome ?? 0,
  };
}

function fromBalanceSheetApi(v: any): BalanceSheetReport {
  const totalLiabilitiesAndEquity = v.totalLiabilitiesAndEquity ?? (v.totalLiabilities ?? 0) + (v.totalEquity ?? 0);
  return {
    periodId: v.periodId,
    periodName: v.periodName,
    assetItems: (v.assetItems ?? []).map(fromStatementItemApi),
    liabilityItems: (v.liabilityItems ?? []).map(fromStatementItemApi),
    equityItems: (v.equityItems ?? []).map(fromStatementItemApi),
    totalAssets: v.totalAssets ?? 0,
    totalLiabilities: v.totalLiabilities ?? 0,
    totalEquity: v.totalEquity ?? 0,
    retainedEarnings: v.retainedEarnings ?? 0,
    totalLiabilitiesAndEquity,
    isBalanced: v.isBalanced ?? v.accountingEquationVerifies ?? Math.abs((v.totalAssets ?? 0) - totalLiabilitiesAndEquity) < 1,
  };
}

export async function getTrialBalance(periodId: string): Promise<TrialBalanceReport> {
  const v = await fmsFetch<any>(`/api/fms/reports/trial-balance?periodId=${periodId}`);
  return fromTrialBalanceApi(v);
}

export async function getIncomeStatement(periodId: string): Promise<IncomeStatementReport> {
  const v = await fmsFetch<any>(`/api/fms/reports/income-statement?periodId=${periodId}`);
  return fromIncomeStatementApi(v);
}

export async function getBalanceSheet(periodId: string): Promise<BalanceSheetReport> {
  const v = await fmsFetch<any>(`/api/fms/reports/balance-sheet?periodId=${periodId}`);
  return fromBalanceSheetApi(v);
}