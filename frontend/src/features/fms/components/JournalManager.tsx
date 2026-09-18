"use client";

import { useState } from "react";
import { Plus, Check, Eye, Trash2, ShieldAlert, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import type { JournalEntry, Account, AccountingPeriod } from "../types/fms";
import {
  createJournalAction,
  submitJournalAction,
  approveJournalAction,
  postJournalAction,
} from "../actions/fms-actions";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shared/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/features/shared/components/ui/dialog";
import { StatusBadge } from "@/features/shared/components/StatusBadge";
import { PageHeader } from "@/features/shared/components/PageHeader";

interface JournalManagerProps {
  initialJournals: JournalEntry[];
  accounts: Account[];
  periods: AccountingPeriod[];
}

export default function JournalManager({ initialJournals, accounts, periods }: JournalManagerProps) {
  const [journals, setJournals] = useState<JournalEntry[]>(initialJournals);
  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(initialJournals[0] || null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form states
  const [periodId, setPeriodId] = useState(periods[0]?.id || "");
  const [description, setDescription] = useState("");
  const [lines, setLines] = useState<Array<{ accountId: string; debit: number; credit: number; desc: string }>>([
    { accountId: "", debit: 0, credit: 0, desc: "" },
    { accountId: "", debit: 0, credit: 0, desc: "" }
  ]);

  const totalDebits = lines.reduce((sum, l) => sum + Number(l.debit || 0), 0);
  const totalCredits = lines.reduce((sum, l) => sum + Number(l.credit || 0), 0);
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01 && totalDebits > 0;

  function handleAddLine() {
    setLines([...lines, { accountId: "", debit: 0, credit: 0, desc: "" }]);
  }

  function handleRemoveLine(index: number) {
    if (lines.length > 2) {
      setLines(lines.filter((_, idx) => idx !== index));
    }
  }

  function handleLineChange(index: number, key: string, value: any) {
    setLines(lines.map((l, idx) => {
      if (idx !== index) return l;
      const updated = { ...l, [key]: value };
      // Mutual exclusion check
      if (key === "debit" && Number(value) > 0) updated.credit = 0;
      if (key === "credit" && Number(value) > 0) updated.debit = 0;
      return updated;
    }));
  }

  async function handleCreateJournal(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!periodId) {
      setError("Please select an accounting period.");
      return;
    }
    if (!description.trim()) {
      setError("Journal description is required.");
      return;
    }
    if (!isBalanced) {
      setError("Journal is unbalanced. Total debits must equal total credits and be greater than 0.");
      return;
    }
    if (lines.some(l => !l.accountId)) {
      setError("All lines must have a selected account.");
      return;
    }

    const payload = {
      periodId,
      description: description.trim(),
      lines: lines.map(l => ({
        accountId: l.accountId,
        debitAmount: Number(l.debit || 0),
        creditAmount: Number(l.credit || 0),
        description: l.desc.trim() || undefined
      }))
    };

    const res = await createJournalAction({ ok: false }, payload);
    if (res.ok) {
      // Mock refresh
      const p = periods.find(per => per.id === periodId);
      const mappedLines = lines.map((l, idx) => {
        const acc = accounts.find(a => a.id === l.accountId);
        return {
          id: "mock_jl_" + Date.now() + "_" + idx,
          accountId: l.accountId,
          accountCode: acc?.code ?? "",
          accountName: acc?.name ?? "",
          debitAmount: l.debit,
          creditAmount: l.credit,
          description: l.desc || null
        };
      });

      const mockNew: JournalEntry = {
        id: "mock_je_" + Date.now(),
        periodId,
        periodName: p?.periodName ?? "2026-08",
        description: description.trim(),
        status: "DRAFT",
        createdBy: "general_accountant",
        approvedBy: null,
        postedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        totalDebit: totalDebits,
        totalCredit: totalCredits,
        lines: mappedLines,
      };

      setJournals([mockNew, ...journals]);
      setSelectedJournal(mockNew);
      setIsCreateOpen(false);
      setDescription("");
      setLines([
        { accountId: "", debit: 0, credit: 0, desc: "" },
        { accountId: "", debit: 0, credit: 0, desc: "" }
      ]);
    } else {
      setError(res.message || "Failed to create journal entry.");
    }
  }

  async function handleAction(actionType: "submit" | "approve" | "post", journalId: string) {
    setActionLoading(true);
    let res;
    if (actionType === "submit") res = await submitJournalAction(journalId);
    else if (actionType === "approve") res = await approveJournalAction(journalId);
    else res = await postJournalAction(journalId);

    if (res.ok) {
      const nextStatus = actionType === "submit" ? "SUBMITTED" : actionType === "approve" ? "APPROVED" : "POSTED";
      const updated = journals.map(j => {
        if (j.id === journalId) {
          const fresh = { 
            ...j, 
            status: nextStatus as any,
            approvedBy: actionType === "approve" ? "finance_manager" : j.approvedBy,
            postedAt: actionType === "post" ? new Date().toISOString() : j.postedAt
          };
          // Also select it
          if (selectedJournal?.id === journalId) setSelectedJournal(fresh);
          return fresh;
        }
        return j;
      });
      setJournals(updated);
    } else {
      alert("Action failed: " + res.message);
    }
    setActionLoading(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="General Ledger Journals" 
        subtitle="Manage journal entries, review audits, and post balances to the ledger"
        action={
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} /> New Journal Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl bg-white max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Record Double-Entry Journal Voucher</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateJournal} className="flex flex-col gap-4 mt-2">
                {error && <div className="text-red-500 text-sm flex items-center gap-1.5"><AlertCircle size={16} /> {error}</div>}
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1 flex flex-col gap-1.5">
                    <Label htmlFor="period">Accounting Period *</Label>
                    <Select value={periodId} onValueChange={setPeriodId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {periods.filter(p => p.status === "OPEN").map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.periodName} (Active)</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <Label htmlFor="desc">Entry Description / Narrative *</Label>
                    <Input 
                      id="desc" 
                      placeholder="e.g. Purchase of office utility supplies with petty cash" 
                      value={description} 
                      onChange={e => setDescription(e.target.value)} 
                    />
                  </div>
                </div>

                {/* Journal Lines */}
                <div className="flex flex-col gap-2 mt-2">
                  <Label>Journal Lines (Voucher Lines)</Label>
                  <div className="space-y-2.5">
                    {lines.map((line, idx) => (
                      <div key={idx} className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 border rounded-lg">
                        <div className="flex-1 min-w-[200px] flex flex-col gap-1">
                          <Label className="text-[10px] text-slate-400">Account *</Label>
                          <Select value={line.accountId} onValueChange={val => handleLineChange(idx, "accountId", val)}>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Select Account" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {accounts.filter(a => a.postingAllowed && a.status === "ACTIVE").map(a => (
                                <SelectItem key={a.id} value={a.id}>{a.code} - {a.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="w-[110px] flex flex-col gap-1">
                          <Label className="text-[10px] text-slate-400">Debit ($)</Label>
                          <Input 
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={line.debit || ""}
                            onChange={e => handleLineChange(idx, "debit", parseFloat(e.target.value) || 0)}
                            className="h-8 font-mono text-sm"
                          />
                        </div>
                        <div className="w-[110px] flex flex-col gap-1">
                          <Label className="text-[10px] text-slate-400">Credit ($)</Label>
                          <Input 
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={line.credit || ""}
                            onChange={e => handleLineChange(idx, "credit", parseFloat(e.target.value) || 0)}
                            className="h-8 font-mono text-sm"
                          />
                        </div>
                        <div className="flex-1 min-w-[150px] flex flex-col gap-1">
                          <Label className="text-[10px] text-slate-400">Line Narrative</Label>
                          <Input 
                            placeholder="Optional line memo"
                            value={line.desc}
                            onChange={e => handleLineChange(idx, "desc", e.target.value)}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="self-end pb-0.5">
                          <Button 
                            type="button" 
                            size="icon" 
                            variant="ghost" 
                            disabled={lines.length <= 2}
                            onClick={() => handleRemoveLine(idx)}
                            className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center mt-2.5">
                    <Button type="button" variant="outline" size="sm" onClick={handleAddLine} className="text-xs">
                      Add Line
                    </Button>
                    <div className="flex gap-4 text-xs font-mono font-bold text-slate-600">
                      <div>Total Debits: <span className="text-slate-900">${totalDebits.toFixed(2)}</span></div>
                      <div>Total Credits: <span className="text-slate-900">${totalCredits.toFixed(2)}</span></div>
                      <div>
                        Status: {isBalanced ? (
                          <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">BALANCED</span>
                        ) : (
                          <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">UNBALANCED</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={!isBalanced}>Save Draft</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Journal Entries List */}
        <div className="lg:col-span-1 border rounded-lg bg-white overflow-hidden shadow-sm flex flex-col h-[600px]">
          <div className="bg-slate-50 border-b p-3 font-semibold text-slate-700 text-sm">
            Journal Vouchers List
          </div>
          <div className="flex-1 overflow-y-auto divide-y">
            {journals.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                No journals created.
              </div>
            ) : (
              journals.map(j => (
                <div 
                  key={j.id} 
                  onClick={() => setSelectedJournal(j)}
                  className={`p-3.5 cursor-pointer hover:bg-slate-50/50 transition-colors ${selectedJournal?.id === j.id ? "bg-slate-50 border-l-4 border-slate-900" : ""}`}
                >
                  <div className="flex justify-between items-start gap-1">
                    <span className="font-mono text-xs font-bold text-slate-700">{j.id.startsWith("mock") ? "JV-DRAFT" : j.id.slice(0, 8).toUpperCase()}</span>
                    <StatusBadge status={j.status} />
                  </div>
                  <div className="font-semibold text-xs text-slate-900 mt-1 line-clamp-1">{j.description}</div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2 font-mono">
                    <span>Amt: ${j.totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    <span>Pd: {j.periodName}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right column: Selected Journal Detail */}
        <div className="lg:col-span-2 border rounded-lg bg-white overflow-hidden shadow-sm flex flex-col h-[600px]">
          {selectedJournal ? (
            <div className="flex-1 flex flex-col">
              {/* Detail Header */}
              <div className="border-b p-4 flex justify-between items-start flex-wrap gap-4 bg-slate-50/50">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono text-sm font-bold text-slate-900">Journal Entry {selectedJournal.id.startsWith("mock") ? "Voucher Draft" : selectedJournal.id.toUpperCase()}</h3>
                    <StatusBadge status={selectedJournal.status} />
                  </div>
                  <p className="text-sm font-semibold text-slate-800 mt-1.5">{selectedJournal.description}</p>
                  <div className="text-xs text-slate-500 mt-2">
                    Period: <strong>{selectedJournal.periodName}</strong> · Created by {selectedJournal.createdBy}
                  </div>
                </div>

                {/* Maker-Checker actions */}
                <div className="flex gap-2">
                  {selectedJournal.status === "DRAFT" && (
                    <Button 
                      size="sm"
                      onClick={() => handleAction("submit", selectedJournal.id)}
                      disabled={actionLoading}
                      className="flex items-center gap-1 text-xs"
                    >
                      {actionLoading ? <Loader2 size={12} className="animate-spin" /> : null}
                      Submit Review
                    </Button>
                  )}
                  {selectedJournal.status === "SUBMITTED" && (
                    <Button 
                      size="sm"
                      onClick={() => handleAction("approve", selectedJournal.id)}
                      disabled={actionLoading}
                      className="flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {actionLoading ? <Loader2 size={12} className="animate-spin" /> : null}
                      Approve (Checker)
                    </Button>
                  )}
                  {selectedJournal.status === "APPROVED" && (
                    <Button 
                      size="sm"
                      onClick={() => handleAction("post", selectedJournal.id)}
                      disabled={actionLoading}
                      className="flex items-center gap-1 text-xs bg-rose-600 hover:bg-rose-700 text-white"
                    >
                      {actionLoading ? <Loader2 size={12} className="animate-spin" /> : null}
                      Post GL (Book)
                    </Button>
                  )}
                </div>
              </div>

              {/* Detail Lines Table */}
              <div className="flex-1 overflow-y-auto p-4">
                <table className="w-full text-xs text-left border">
                  <thead>
                    <tr className="bg-slate-50 border-b font-semibold text-slate-500">
                      <th className="px-4 py-2.5">Account Code</th>
                      <th className="px-4 py-2.5">Account Name</th>
                      <th className="px-4 py-2.5 text-right">Debit ($)</th>
                      <th className="px-4 py-2.5 text-right">Credit ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedJournal.lines.map((line, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="px-4 py-3 font-mono font-bold">{line.accountCode}</td>
                        <td className="px-4 py-3 font-semibold text-slate-800">{line.accountName}</td>
                        <td className="px-4 py-3 text-right font-mono font-semibold">
                          {line.debitAmount > 0 ? `$${line.debitAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "-"}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-semibold">
                          {line.creditAmount > 0 ? `$${line.creditAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "-"}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50/80 font-bold border-t-2">
                      <td colSpan={2} className="px-4 py-3 text-slate-700 text-right">Totals</td>
                      <td className="px-4 py-3 text-right font-mono text-slate-900">${selectedJournal.totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3 text-right font-mono text-slate-900">${selectedJournal.totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              Select a journal entry to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
