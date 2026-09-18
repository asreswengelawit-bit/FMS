"use client";

import { useState } from "react";
import { Plus, Check, X, AlertCircle, Loader2 } from "lucide-react";
import type { Budget, BudgetLine, BudgetVarianceReport, AccountingPeriod } from "../types/fms";
import { createBudgetAction, submitBudgetAction, approveBudgetAction } from "../actions/fms-actions";
import { getBudgetVariance } from "../api/budgets";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shared/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/features/shared/components/ui/dialog";
import { StatusBadge } from "@/features/shared/components/StatusBadge";
import { PageHeader } from "@/features/shared/components/PageHeader";

interface BudgetManagerProps {
  initialBudgets: Budget[];
  accounts: { id: string; code: string; name: string }[];
  initialPeriods: AccountingPeriod[];
}

type DraftLine = {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  budgetedAmount: number;
};

const emptyDraftLine = (id: string): DraftLine => ({
  id,
  accountId: "",
  accountCode: "",
  accountName: "",
  budgetedAmount: 0,
});

export default function BudgetManager({ initialBudgets, accounts, initialPeriods }: BudgetManagerProps) {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [variance, setVariance] = useState<BudgetVarianceReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [budgetName, setBudgetName] = useState("");
  const [fiscalYear, setFiscalYear] = useState(new Date().getFullYear().toString());
  const [selectedPeriodId, setSelectedPeriodId] = useState(initialPeriods[0]?.id || "");
  const [selectedLines, setSelectedLines] = useState<DraftLine[]>([
    emptyDraftLine("1"),
  ]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!budgetName || !fiscalYear || !selectedPeriodId || selectedLines.length === 0) {
      setError("Budget name, fiscal year, period, and at least one budget line are required.");
      return;
    }
    const input = {
      budgetName,
      fiscalYear: Number(fiscalYear),
      lines: selectedLines.map(l => ({ accountId: l.accountId, periodId: selectedPeriodId, budgetedAmount: l.budgetedAmount })),
    };
    const res = await createBudgetAction({ ok: false }, input);
    if (res.ok) {
      const mockNew: Budget = {
        id: "mock_budget_" + Date.now(),
        budgetName,
        fiscalYear: Number(fiscalYear),
        status: "DRAFT",
        totalBudgetedAmount: selectedLines.reduce((sum, l) => sum + l.budgetedAmount, 0),
        createdBy: "general_accountant",
        approvedBy: null,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        lines: selectedLines.map(l => {
          const acc = accounts.find(a => a.id === l.accountId);
          const period = initialPeriods.find(p => p.id === selectedPeriodId);
          return {
            id: "bl_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
            accountId: l.accountId,
            accountCode: acc?.code ?? "",
            accountName: acc?.name ?? "",
            periodId: selectedPeriodId,
            periodName: period?.periodName ?? "",
            budgetedAmount: l.budgetedAmount,
            notes: null,
          } as BudgetLine;
        }),
      };
      setBudgets([mockNew, ...budgets]);
      setIsCreateOpen(false);
      setBudgetName("");
      setSelectedLines([emptyDraftLine("1")]);
    } else {
      setError(res.message || "Failed to create budget.");
    }
  }

  async function handleAction(actionType: "submit" | "approve", budgetId: string) {
    setActionLoading(true);
    let res;
    if (actionType === "submit") res = await submitBudgetAction(budgetId);
    else res = await approveBudgetAction(budgetId);

    if (res.ok) {
      const nextStatus = actionType === "submit" ? "SUBMITTED" : "APPROVED";
      setBudgets(budgets.map(b => b.id === budgetId ? { ...b, status: nextStatus as any, approvedBy: actionType === "approve" ? "finance_manager" : b.approvedBy } : b));
      if (selectedBudget?.id === budgetId) setSelectedBudget({ ...selectedBudget, status: nextStatus as any, approvedBy: actionType === "approve" ? "finance_manager" : selectedBudget.approvedBy });
    } else {
      alert("Action failed: " + res.message);
    }
    setActionLoading(false);
  }

  async function loadVariance(budgetId: string) {
    try {
      const data = await getBudgetVariance(budgetId);
      setVariance(data);
    } catch (err: any) {
      alert("Failed to load variance: " + err.message);
    }
  }

  function handleAddLine() {
    setSelectedLines([...selectedLines, emptyDraftLine(String(selectedLines.length + 1))]);
  }

  function handleRemoveLine(index: number) {
    if (selectedLines.length > 1) {
      setSelectedLines(selectedLines.filter((_, idx) => idx !== index));
    }
  }

  function handleLineChange(index: number, key: string, value: any) {
    setSelectedLines(selectedLines.map((l, idx) => {
      if (idx !== index) return l;
      const updated = { ...l, [key]: value };
      if (key === "accountId") {
        const acc = accounts.find(a => a.id === value);
        updated.accountCode = acc?.code ?? "";
        updated.accountName = acc?.name ?? "";
      }
      return updated;
    }));
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Budgets"
        subtitle="Plan, approve, and track fiscal budgets against actuals"
        action={
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} /> New Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl bg-white max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Budget</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="flex flex-col gap-4 mt-2">
                {error && <div className="text-red-500 text-sm flex items-center gap-1.5"><AlertCircle size={16} /> {error}</div>}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="fiscalYear">Fiscal Year *</Label>
                    <Input id="fiscalYear" type="number" value={fiscalYear} onChange={e => setFiscalYear(e.target.value)} required />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="budgetName">Budget Name *</Label>
                    <Input id="budgetName" value={budgetName} onChange={e => setBudgetName(e.target.value)} required />
                  </div>
                  <div className="flex flex-col gap-1.5 col-span-2">
                    <Label>Period *</Label>
                    <Select value={selectedPeriodId} onValueChange={setSelectedPeriodId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {initialPeriods.map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.periodName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <Label>Budget Lines</Label>
                  <div className="space-y-2.5">
                    {selectedLines.map((line, idx) => (
                      <div key={idx} className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 border rounded-lg">
                        <div className="flex-1 min-w-[180px] flex flex-col gap-1">
                          <Label className="text-[10px] text-slate-400">Account *</Label>
                          <Select value={line.accountId} onValueChange={val => handleLineChange(idx, "accountId", val)}>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Select Account" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {accounts.map(a => (
                                <SelectItem key={a.id} value={a.id}>{a.code} - {a.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="w-[120px] flex flex-col gap-1">
                          <Label className="text-[10px] text-slate-400">Budget Amount ($)</Label>
                          <Input type="number" step="0.01" min="0" placeholder="0.00" value={line.budgetedAmount || ""} onChange={e => handleLineChange(idx, "budgetedAmount", parseFloat(e.target.value) || 0)} className="h-8 font-mono text-sm" />
                        </div>
                        <div className="self-end pb-0.5">
                          <Button type="button" size="icon" variant="ghost" disabled={selectedLines.length <= 1} onClick={() => handleRemoveLine(idx)} className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50">
                            <X size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddLine} className="text-xs">Add Line</Button>
                </div>
                <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                  <Button type="submit">Save Draft</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b text-slate-500 font-semibold">
                <th className="px-6 py-3">Fiscal Year</th>
                <th className="px-6 py-3">Budget Name</th>
                <th className="px-6 py-3 text-right">Total Budget</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Created By</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {budgets.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-slate-400">No budgets found.</td></tr>
              ) : budgets.map(budget => (
                <tr key={budget.id} className="border-b hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => { setSelectedBudget(budget); setVariance(null); }}>
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">{budget.fiscalYear}</td>
                  <td className="px-6 py-4 text-slate-800">{budget.budgetName ?? "—"}</td>
                  <td className="px-6 py-4 text-right font-mono font-semibold">${budget.lines.reduce((sum, l) => sum + l.budgetedAmount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4"><StatusBadge status={budget.status} /></td>
                  <td className="px-6 py-4 text-slate-600">{budget.createdBy}</td>
                  <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex gap-1 justify-end">
                      {budget.status === "DRAFT" && (
                        <Button size="sm" variant="outline" disabled={actionLoading} onClick={() => handleAction("submit", budget.id)} className="text-xs">Submit</Button>
                      )}
                      {budget.status === "SUBMITTED" && (
                        <Button size="sm" variant="outline" disabled={actionLoading} onClick={() => handleAction("approve", budget.id)} className="text-xs">Approve</Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => loadVariance(budget.id)} className="text-xs">Variance</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBudget && (
        <div className="bg-white border rounded-lg p-5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900">{selectedBudget.budgetName}</h3>
                <StatusBadge status={selectedBudget.status} />
              </div>
              <p className="text-sm text-slate-600 mt-1">Fiscal Year {selectedBudget.fiscalYear} · Total Budget ${selectedBudget.totalBudgetedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 border-b font-semibold text-slate-500">
                  <th className="px-4 py-2.5">Account Code</th>
                  <th className="px-4 py-2.5">Account Name</th>
                  <th className="px-4 py-2.5">Period</th>
                  <th className="px-4 py-2.5 text-right">Budget</th>
                </tr>
              </thead>
              <tbody>
                {selectedBudget.lines.map(line => (
                  <tr key={line.id} className="border-b">
                    <td className="px-4 py-3 font-mono font-bold">{line.accountCode}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{line.accountName}</td>
                    <td className="px-4 py-3 text-slate-500">{line.periodName || "—"}</td>
                    <td className="px-4 py-3 text-right font-mono">${line.budgetedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {variance && (
        <div className="bg-white border rounded-lg p-5 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-2">Variance Report — FY {variance.fiscalYear} ({variance.periodName})</h3>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 border-b font-semibold text-slate-500">
                  <th className="px-4 py-2.5">Account</th>
                  <th className="px-4 py-2.5 text-right">Budget</th>
                  <th className="px-4 py-2.5 text-right">Actual</th>
                  <th className="px-4 py-2.5 text-right">Variance</th>
                  <th className="px-4 py-2.5 text-right">%</th>
                </tr>
              </thead>
              <tbody>
                {variance.items.map(item => (
                  <tr key={item.accountId} className="border-b">
                    <td className="px-4 py-3 font-semibold text-slate-800">{item.accountCode} - {item.accountName}</td>
                    <td className="px-4 py-3 text-right font-mono">${item.budgetedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-right font-mono">${item.actualAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold" style={{ color: item.varianceAmount >= 0 ? "#16A34A" : "#C8102E" }}>${item.varianceAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-right font-mono">{item.utilizationPercentage.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
