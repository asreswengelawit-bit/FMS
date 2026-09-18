"use client";

import { useState } from "react";
import { Plus, Check, X, AlertCircle, RefreshCw } from "lucide-react";
import type { BankAccount, BankStatementLine, CashPosition, ImportStatementLineInput } from "../types/fms";
import { createBankAccountAction, updateBankAccountStatusAction, importStatementLinesAction, manualMatchAction, flagExceptionAction } from "../actions/fms-actions";
import { listBankAccounts, getCashPosition, getReconciliationReport } from "../api/bank";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shared/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/features/shared/components/ui/dialog";
import { StatusBadge } from "@/features/shared/components/StatusBadge";
import { PageHeader } from "@/features/shared/components/PageHeader";

interface BankManagerProps {
  initialAccounts: BankAccount[];
  accounts: { id: string; code: string; name: string }[];
}

export default function BankManager({ initialAccounts, accounts }: BankManagerProps) {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(initialAccounts);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(initialAccounts[0] || null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [cashPosition, setCashPosition] = useState<CashPosition | null>(null);
  const [reconciliationLines, setReconciliationLines] = useState<BankStatementLine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [openingBalance, setOpeningBalance] = useState("0");
  const [glControlAccountId, setGlControlAccountId] = useState("");

  function resetCreateForm() {
    setAccountName("");
    setBankName("");
    setAccountNumber("");
    setBranchCode("");
    setCurrency("USD");
    setOpeningBalance("0");
    setGlControlAccountId("");
    setError(null);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setActionLoading(true);
    const input = {
      accountName: accountName.trim(),
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      branchCode: branchCode.trim(),
      currency: currency || "USD",
      openingBalance: Number(openingBalance || 0),
      glControlAccountId,
    };
    if (!input.accountName || !input.bankName || !input.accountNumber || !input.glControlAccountId) {
      setError("All required fields must be filled.");
      setActionLoading(false);
      return;
    }
    try {
      const res = await createBankAccountAction({ ok: false }, input);
      if (!res.ok) {
        setError(res.message || "Failed to create bank account.");
        setActionLoading(false);
        return;
      }
      if (res.data) {
        setBankAccounts(prev => [res.data as BankAccount, ...prev.filter(a => a.id !== (res.data as BankAccount).id)]);
        setSelectedAccount(res.data as BankAccount);
      } else {
        const created = await listBankAccounts();
        setBankAccounts(created);
        setSelectedAccount(created[0] ?? null);
      }
      resetCreateForm();
      setIsCreateOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to create bank account.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleStatusToggle(id: string) {
    const account = bankAccounts.find(a => a.id === id);
    if (!account) return;
    const newStatus = account.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const res = await updateBankAccountStatusAction(id, newStatus);
    if (res.ok) {
      setBankAccounts(bankAccounts.map(a => a.id === id ? { ...a, status: newStatus } : a));
      if (selectedAccount?.id === id) setSelectedAccount({ ...selectedAccount, status: newStatus });
    }
  }

  async function loadCashPosition(id: string) {
    try {
      const data = await getCashPosition(id);
      setCashPosition(data);
    } catch (err: any) {
      alert("Failed to load cash position: " + err.message);
    }
  }

  async function loadReconciliation(id: string) {
    try {
      const data = await getReconciliationReport(id);
      setReconciliationLines(data.content ?? []);
    } catch (err: any) {
      alert("Failed to load reconciliation report: " + err.message);
    }
  }

  async function handleImport(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAccount) return;
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const lines: ImportStatementLineInput[] = [
      {
        transactionDate: String(form.get("transactionDate") || ""),
        description: String(form.get("description") || "").trim(),
        amount: Number(form.get("amount") || 0),
        type: String(form.get("type") || "CREDIT") as "CREDIT" | "DEBIT",
        reference: String(form.get("reference") || "").trim() || undefined,
      }
    ];
    const res = await importStatementLinesAction(selectedAccount.id, lines);
    if (res.ok) {
      alert("Statement lines imported successfully.");
      loadReconciliation(selectedAccount.id);
    } else {
      alert("Import failed: " + res.message);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Bank Accounts"
        subtitle="Manage bank accounts, cash positions, and reconciliation"
        action={
          <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (open) resetCreateForm(); }}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} /> Add Bank Account
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-white">
              <DialogHeader>
                <DialogTitle>Create Bank Account</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="flex flex-col gap-4 mt-2">
                {error && <div className="text-red-500 text-sm flex items-center gap-1.5"><AlertCircle size={16} /> {error}</div>}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="accountName">Account Name *</Label>
                  <Input id="accountName" value={accountName} onChange={e => setAccountName(e.target.value)} placeholder="e.g. Operating Account" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="bankName">Bank Name *</Label>
                    <Input id="bankName" value={bankName} onChange={e => setBankName(e.target.value)} placeholder="e.g. Commercial Bank" required />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="accountNumber">Account Number *</Label>
                    <Input id="accountNumber" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} placeholder="e.g. 1234567890" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="branchCode">Branch Code</Label>
                    <Input id="branchCode" value={branchCode} onChange={e => setBranchCode(e.target.value)} placeholder="e.g. 001" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="ETB">ETB</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="openingBalance">Opening Balance ($)</Label>
                  <Input id="openingBalance" type="number" step="0.01" value={openingBalance} onChange={e => setOpeningBalance(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="glControlAccountId">GL Control Account *</Label>
                  <Select value={glControlAccountId || undefined} onValueChange={setGlControlAccountId} required>
                    <SelectTrigger><SelectValue placeholder="Select GL account" /></SelectTrigger>
                    <SelectContent className="bg-white">
                      {(() => {
                        const preferred = accounts.filter(a => a.code.startsWith("1010") || a.code.startsWith("1020"));
                        const fallback = accounts.filter(a => a.code.startsWith("10") || /^1[01]\d\d$/.test(a.code));
                        const list = preferred.length
                          ? preferred
                          : (fallback.length ? fallback.slice(0, 50) : accounts);
                        if (list.length === 0) {
                          return <div className="px-2 py-1.5 text-sm text-slate-400">No GL control accounts available</div>;
                        }
                        return list.map(a => (
                          <SelectItem key={a.id} value={a.id}>{a.code} - {a.name}</SelectItem>
                        ));
                      })()}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <Button type="button" variant="outline" disabled={actionLoading} onClick={() => { resetCreateForm(); setIsCreateOpen(false); }}>Cancel</Button>
                  <Button type="submit" disabled={actionLoading}>{actionLoading ? "Creating..." : "Create Account"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bankAccounts.map(account => (
          <div key={account.id} className={`bg-white border rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow ${selectedAccount?.id === account.id ? "ring-2 ring-blue-500" : ""}`} onClick={() => { setSelectedAccount(account); setCashPosition(null); setReconciliationLines([]); }}>
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-slate-900">{account.accountName}</div>
                <div className="text-xs text-slate-500">{account.bankName} · {account.accountNumber}</div>
              </div>
              <StatusBadge status={account.status} />
            </div>
            <div className="mt-3 flex justify-between text-xs">
              <span className="text-slate-500">Current Balance</span>
              <span className="font-mono font-bold text-slate-900">${account.currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="mt-2 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleStatusToggle(account.id)} className="text-xs">
                {account.status === "ACTIVE" ? "Deactivate" : "Activate"}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => loadCashPosition(account.id)} className="text-xs">Cash Position</Button>
              <Button size="sm" variant="ghost" onClick={() => loadReconciliation(account.id)} className="text-xs">Reconciliation</Button>
            </div>
          </div>
        ))}
      </div>

      {cashPosition && (
        <div className="bg-white border rounded-lg p-5 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-2">Cash Position — {selectedAccount?.accountName}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-xs text-slate-500">Book Balance</div>
              <div className="font-mono font-bold text-slate-900">${cashPosition.bookBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-xs text-slate-500">Statement Balance</div>
              <div className="font-mono font-bold text-slate-900">${cashPosition.statementBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-xs text-slate-500">Variance</div>
              <div className="font-mono font-bold" style={{ color: cashPosition.variance === 0 ? "#16A34A" : "#C8102E" }}>${cashPosition.variance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-xs text-slate-500">Unmatched Lines</div>
              <div className="font-mono font-bold text-slate-900">{cashPosition.unmatchedLines}</div>
            </div>
          </div>
        </div>
      )}

      {reconciliationLines.length > 0 && (
        <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
          <div className="bg-slate-50 border-b p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900">Bank Reconciliation Report</h3>
              <p className="text-xs text-slate-500">{selectedAccount?.accountName}</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus size={14} /> Import Statement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-white">
                <DialogHeader>
                  <DialogTitle>Import Bank Statement Line</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleImport} className="flex flex-col gap-4 mt-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="transactionDate">Transaction Date *</Label>
                    <Input type="date" id="transactionDate" name="transactionDate" required />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="description">Description *</Label>
                    <Input id="description" name="description" placeholder="Transaction description" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="amount">Amount *</Label>
                      <Input type="number" step="0.01" id="amount" name="amount" placeholder="0.00" required />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="type">Type *</Label>
                      <Select name="type" defaultValue="CREDIT">
                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="CREDIT">CREDIT</SelectItem>
                          <SelectItem value="DEBIT">DEBIT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="reference">Reference</Label>
                    <Input id="reference" name="reference" placeholder="Optional reference" />
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button type="button" variant="outline">Cancel</Button>
                    <Button type="submit">Import</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50 border-b font-semibold text-slate-500">
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5">Description</th>
                  <th className="px-4 py-2.5 text-right">Amount</th>
                  <th className="px-4 py-2.5">Type</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reconciliationLines.map(line => (
                  <tr key={line.id} className="border-b">
                    <td className="px-4 py-3">{line.transactionDate}</td>
                    <td className="px-4 py-3 text-slate-800">{line.description}</td>
                    <td className="px-4 py-3 text-right font-mono">${line.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3"><span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">{line.type}</span></td>
                    <td className="px-4 py-3"><StatusBadge status={line.reconciliationStatus} /></td>
                    <td className="px-4 py-3 text-right">
                      {line.reconciliationStatus === "UNMATCHED" && (
                        <div className="flex gap-1 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={async () => {
                              const res = await manualMatchAction(line.id, line.reference ?? "");
                              if (res.ok && selectedAccount) loadReconciliation(selectedAccount.id);
                              else alert(res.message || "Failed to match statement line.");
                            }}
                          >
                            Match
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs text-amber-600"
                            onClick={async () => {
                              const res = await flagExceptionAction(line.id);
                              if (res.ok && selectedAccount) loadReconciliation(selectedAccount.id);
                              else alert(res.message || "Failed to flag exception.");
                            }}
                          >
                            Flag
                          </Button>
                        </div>
                      )}
                    </td>
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
