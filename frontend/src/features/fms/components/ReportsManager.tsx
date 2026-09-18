"use client";

import { useState, useEffect } from "react";
import { FileText, BookOpen, Loader2 } from "lucide-react";
import type { AccountingPeriod, TrialBalanceReport, IncomeStatementReport, BalanceSheetReport, FinancialStatementItem } from "../types/fms";
import { getTrialBalance, getIncomeStatement, getBalanceSheet } from "../api/reports";
import { Button } from "@/features/shared/components/ui/button";
import { Label } from "@/features/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shared/components/ui/select";
import { PageHeader } from "@/features/shared/components/PageHeader";

type ReportTab = "trial-balance" | "income-statement" | "balance-sheet";

interface ReportsManagerProps {
  initialPeriods: AccountingPeriod[];
  accounts: { id: string; code: string; name: string }[];
}

export default function ReportsManager({ initialPeriods }: ReportsManagerProps) {
  const [activeTab, setActiveTab] = useState<ReportTab>("trial-balance");
  const [selectedPeriodId, setSelectedPeriodId] = useState(initialPeriods[0]?.id || "");
  const [trialBalance, setTrialBalance] = useState<TrialBalanceReport | null>(null);
  const [incomeStatement, setIncomeStatement] = useState<IncomeStatementReport | null>(null);
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheetReport | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPeriodId) {
      loadReport(activeTab);
    }
  }, []);

  async function loadReport(tab: ReportTab) {
    setLoading(true);
    try {
      if (tab === "trial-balance") {
        const data = await getTrialBalance(selectedPeriodId);
        setTrialBalance(data);
      } else if (tab === "income-statement") {
        const data = await getIncomeStatement(selectedPeriodId);
        setIncomeStatement(data);
      } else {
        const data = await getBalanceSheet(selectedPeriodId);
        setBalanceSheet(data);
      }
    } catch (err: any) {
      alert("Failed to load report: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleTabChange(tab: ReportTab) {
    setActiveTab(tab);
    const hasData = tab === "trial-balance" ? !!trialBalance : tab === "income-statement" ? !!incomeStatement : !!balanceSheet;
    if (!hasData) loadReport(tab);
  }

  function handlePeriodChange(periodId: string) {
    setSelectedPeriodId(periodId);
    setTrialBalance(null);
    setIncomeStatement(null);
    setBalanceSheet(null);
    loadReport(activeTab);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Financial Reports"
        subtitle="Trial balance, income statement, and balance sheet"
        action={
          <div className="flex items-center gap-2">
            <Label htmlFor="period" className="text-xs">Period:</Label>
            <Select value={selectedPeriodId} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {initialPeriods.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.periodName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" onClick={() => loadReport(activeTab)} disabled={loading}>
              {loading ? <Loader2 size={14} className="animate-spin" /> : "Refresh"}
            </Button>
          </div>
        }
      />

      <div className="flex gap-1.5 border-b">
        <Button
          variant={activeTab === "trial-balance" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleTabChange("trial-balance")}
          className="text-xs"
        >
          <FileText size={14} className="mr-1" /> Trial Balance
        </Button>
        <Button
          variant={activeTab === "income-statement" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleTabChange("income-statement")}
          className="text-xs"
        >
          <BookOpen size={14} className="mr-1" /> Income Statement
        </Button>
        <Button
          variant={activeTab === "balance-sheet" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleTabChange("balance-sheet")}
          className="text-xs"
        >
          <BookOpen size={14} className="mr-1" /> Balance Sheet
        </Button>
      </div>

      {activeTab === "trial-balance" && (
        <TrialBalanceView data={trialBalance} loading={loading} onRefresh={() => loadReport("trial-balance")} />
      )}
      {activeTab === "income-statement" && (
        <IncomeStatementView data={incomeStatement} loading={loading} onRefresh={() => loadReport("income-statement")} />
      )}
      {activeTab === "balance-sheet" && (
        <BalanceSheetView data={balanceSheet} loading={loading} onRefresh={() => loadReport("balance-sheet")} />
      )}
    </div>
  );
}

function TrialBalanceView({ data, loading, onRefresh }: { data: TrialBalanceReport | null; loading: boolean; onRefresh: () => void }) {
  if (!data && !loading) {
    return (
      <div className="bg-white border rounded-lg p-8 text-center">
        <Button onClick={onRefresh}>Load Trial Balance</Button>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
      <div className="bg-slate-50 border-b p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-900">Trial Balance</h3>
            <p className="text-xs text-slate-500">Period: {data?.periodName ?? "—"}</p>
          </div>
          {data && (
            <div className="flex gap-4 text-xs">
              <span className="font-mono">Total Debit: <strong>${data.grandTotalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
              <span className="font-mono">Total Credit: <strong>${data.grandTotalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
              <span className={data.balanced ? "text-emerald-600 font-semibold" : "text-rose-600 font-semibold"}>
                {data.balanced ? "BALANCED" : "UNBALANCED"}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-slate-50 border-b font-semibold text-slate-500">
              <th className="px-4 py-2.5">Account Code</th>
              <th className="px-4 py-2.5">Account Name</th>
              <th className="px-4 py-2.5 text-right">Debit</th>
              <th className="px-4 py-2.5 text-right">Credit</th>
              <th className="px-4 py-2.5 text-right">Net Balance</th>
            </tr>
          </thead>
          <tbody>
            {data?.items.map(item => (
              <tr key={item.accountId} className="border-b">
                <td className="px-4 py-3 font-mono font-bold">{item.accountCode}</td>
                <td className="px-4 py-3 font-semibold text-slate-800">{item.accountName}</td>
                <td className="px-4 py-3 text-right font-mono">${item.totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-3 text-right font-mono">${item.totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-3 text-right font-mono font-semibold text-slate-900">${item.netBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatementTable({ items, label }: { items: FinancialStatementItem[]; label: string }) {
  return (
    <div>
      <h4 className="font-semibold text-slate-700 text-sm mb-1">{label}</h4>
      <table className="w-full text-sm text-left">
        <tbody>
          {items.map(item => (
            <tr key={item.accountId} className="border-b">
              <td className="px-4 py-3 font-mono font-bold">{item.accountCode}</td>
              <td className="px-4 py-3 font-semibold text-slate-800">{item.accountName}</td>
              <td className="px-4 py-3 text-right font-mono">${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function IncomeStatementView({ data, loading, onRefresh }: { data: IncomeStatementReport | null; loading: boolean; onRefresh: () => void }) {
  if (!data && !loading) {
    return (
      <div className="bg-white border rounded-lg p-8 text-center">
        <Button onClick={onRefresh}>Load Income Statement</Button>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
      <div className="bg-slate-50 border-b p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-900">Income Statement</h3>
            <p className="text-xs text-slate-500">Period: {data?.periodName ?? "—"}</p>
          </div>
          {data && (
            <div className="flex gap-4 text-xs">
              <span className="font-mono">Total Revenue: <strong>${data.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
              <span className="font-mono">Total Expense: <strong>${data.totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
              <span className="font-mono">Net Income: <strong>${data.netIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 flex flex-col gap-4">
        <StatementTable label="Revenue" items={data?.revenueItems ?? []} />
        <StatementTable label="Expenses" items={data?.expenseItems ?? []} />
      </div>
    </div>
  );
}

function BalanceSheetView({ data, loading, onRefresh }: { data: BalanceSheetReport | null; loading: boolean; onRefresh: () => void }) {
  if (!data && !loading) {
    return (
      <div className="bg-white border rounded-lg p-8 text-center">
        <Button onClick={onRefresh}>Load Balance Sheet</Button>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
      <div className="bg-slate-50 border-b p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-900">Balance Sheet</h3>
            <p className="text-xs text-slate-500">Period: {data?.periodName ?? "—"}</p>
          </div>
          {data && (
            <div className="flex gap-4 text-xs">
              <span className="font-mono">Assets: <strong>${data.totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
              <span className="font-mono">Liabilities: <strong>${data.totalLiabilities.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
              <span className="font-mono">Equity: <strong>${data.totalEquity.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
              <span className={data.isBalanced ? "text-emerald-600 font-semibold" : "text-rose-600 font-semibold"}>
                {data.isBalanced ? "BALANCED" : "UNBALANCED"}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 flex flex-col gap-4">
        <StatementTable label="Assets" items={data?.assetItems ?? []} />
        <StatementTable label="Liabilities" items={data?.liabilityItems ?? []} />
        <StatementTable label="Equity" items={data?.equityItems ?? []} />
      </div>
    </div>
  );
}