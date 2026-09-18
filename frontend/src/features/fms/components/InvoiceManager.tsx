"use client";

import { useState } from "react";
import { Plus, Check, X, Eye, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import type { Invoice, Account, AccountingPeriod, InvoiceType } from "../types/fms";
import {
  createInvoiceAction,
  submitInvoiceAction,
  approveInvoiceAction,
  postInvoiceAction,
} from "../actions/fms-actions";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shared/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/features/shared/components/ui/dialog";
import { StatusBadge } from "@/features/shared/components/StatusBadge";
import { PageHeader } from "@/features/shared/components/PageHeader";

interface InvoiceManagerProps {
  initialInvoices: Invoice[];
  accounts: Account[];
  periods: AccountingPeriod[];
}

export default function InvoiceManager({ initialInvoices, accounts, periods }: InvoiceManagerProps) {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(initialInvoices[0] || null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filterType, setFilterType] = useState<InvoiceType | "ALL">("ALL");
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [invoiceType, setInvoiceType] = useState<InvoiceType>("PAYABLE");

  const filtered = filterType === "ALL"
    ? invoices
    : invoices.filter(inv => inv.invoiceType === filterType);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget as HTMLFormElement);
    const invoiceType = form.get("invoiceType") as InvoiceType;
    const partyName = String(form.get("partyName") || "").trim();
    const periodId = String(form.get("periodId") || "");
    const issueDate = String(form.get("issueDate") || "");
    const dueDate = String(form.get("dueDate") || "");
    const controlAccountId = String(form.get("controlAccountId") || "");

    if (!partyName || !periodId || !issueDate || !dueDate) {
      setError("All required fields must be filled.");
      return;
    }

    const lines = selectedLines.map((line, idx) => ({
      accountId: line.accountId,
      description: line.description || `Line ${idx + 1}`,
      quantity: Number(line.quantity || 0),
      unitPrice: Number(line.unitPrice || 0),
    }));

    const input = {
      invoiceNumber: `INV-2026-${String(invoices.length + 1).padStart(3, "0")}`,
      invoiceType,
      partyName,
      periodId,
      issueDate,
      dueDate,
      controlAccountId: controlAccountId || undefined,
      lines,
    };

    const res = await createInvoiceAction({ ok: false }, input);
    if (res.ok) {
      const mockNew: Invoice = {
        id: "mock_inv_" + Date.now(),
        invoiceNumber: input.invoiceNumber,
        invoiceType,
        partyName,
        periodId,
        periodName: periods.find(p => p.id === periodId)?.periodName ?? "2026-08",
        issueDate,
        dueDate,
        status: "DRAFT",
        totalAmount: lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0),
        paidAmount: 0,
        remainingBalance: lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0),
        controlAccountId: controlAccountId || (invoiceType === "PAYABLE" ? "a4" : "a3"),
        controlAccountCode: invoiceType === "PAYABLE" ? "2010" : "1200",
        controlAccountName: invoiceType === "PAYABLE" ? "Accounts Payable" : "Accounts Receivable",
        vendorId: invoiceType === "PAYABLE" ? "v_new" : null,
        vendorCode: invoiceType === "PAYABLE" ? "VND-NEW" : null,
        customerId: invoiceType === "RECEIVABLE" ? "c_new" : null,
        customerCode: invoiceType === "RECEIVABLE" ? "CST-NEW" : null,
        journalEntryId: null,
        lines: lines.map((l, idx) => ({
          id: "il_" + Date.now() + "_" + idx,
          accountId: l.accountId,
          accountCode: accounts.find(a => a.id === l.accountId)?.code ?? "",
          accountName: accounts.find(a => a.id === l.accountId)?.name ?? "",
          description: l.description,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
          lineAmount: l.quantity * l.unitPrice,
        })),
        createdBy: "general_accountant",
        approvedBy: null,
        createdAt: new Date().toISOString(),
        updatedAt: null,
      };
      setInvoices([mockNew, ...invoices]);
      setSelectedInvoice(mockNew);
      setIsCreateOpen(false);
      setSelectedLines([
        { accountId: "", description: "", quantity: 0, unitPrice: 0 },
        { accountId: "", description: "", quantity: 0, unitPrice: 0 },
      ]);
    } else {
      setError(res.message || "Failed to create invoice.");
    }
  }

  async function handleAction(actionType: "submit" | "approve" | "post", invoiceId: string) {
    setActionLoading(true);
    let res;
    if (actionType === "submit") res = await submitInvoiceAction(invoiceId);
    else if (actionType === "approve") res = await approveInvoiceAction(invoiceId);
    else res = await postInvoiceAction(invoiceId);

    if (res.ok) {
      const nextStatus = actionType === "submit" ? "SUBMITTED" : actionType === "approve" ? "APPROVED" : "POSTED";
      const updated = invoices.map(inv => {
        if (inv.id === invoiceId) {
          const fresh = {
            ...inv,
            status: nextStatus as any,
            approvedBy: actionType === "approve" ? "finance_manager" : inv.approvedBy,
          };
          if (selectedInvoice?.id === invoiceId) setSelectedInvoice(fresh);
          return fresh;
        }
        return inv;
      });
      setInvoices(updated);
    } else {
      alert("Action failed: " + res.message);
    }
    setActionLoading(false);
  }

  const [selectedLines, setSelectedLines] = useState<Array<{ accountId: string; description: string; quantity: number; unitPrice: number }>>([
    { accountId: "", description: "", quantity: 0, unitPrice: 0 },
    { accountId: "", description: "", quantity: 0, unitPrice: 0 },
  ]);

  function handleAddLine() {
    setSelectedLines([...selectedLines, { accountId: "", description: "", quantity: 0, unitPrice: 0 }]);
  }

  function handleRemoveLine(index: number) {
    if (selectedLines.length > 1) {
      setSelectedLines(selectedLines.filter((_, idx) => idx !== index));
    }
  }

  function handleLineChange(index: number, key: string, value: any) {
    setSelectedLines(selectedLines.map((l, idx) => idx === index ? { ...l, [key]: value } : l));
  }

  const lineTotal = selectedLines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Invoices"
        subtitle="Manage accounts payable and receivable invoices"
        action={
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} /> New Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl bg-white max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Invoice</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="flex flex-col gap-4 mt-2">
                {error && <div className="text-red-500 text-sm flex items-center gap-1.5"><AlertCircle size={16} /> {error}</div>}

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="invoiceType">Invoice Type *</Label>
                    <Select value={invoiceType} onValueChange={(val) => setInvoiceType(val as InvoiceType)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="PAYABLE">PAYABLE (Vendor)</SelectItem>
                        <SelectItem value="RECEIVABLE">RECEIVABLE (Customer)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="periodId">Accounting Period *</Label>
                    <Select name="periodId" defaultValue={periods[0]?.id}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {periods.filter(p => p.status === "OPEN").map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.periodName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="partyName">Party Name *</Label>
                  <Input id="partyName" placeholder={invoiceType === "PAYABLE" ? "Vendor name" : "Customer name"} required />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="issueDate">Issue Date *</Label>
                    <Input type="date" id="issueDate" name="issueDate" required />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="dueDate">Due Date *</Label>
                    <Input type="date" id="dueDate" name="dueDate" required />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="controlAccountId">Control Account</Label>
                    <Select name="controlAccountId">
                      <SelectTrigger>
                        <SelectValue placeholder="Auto-selected" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {accounts.filter(a => a.postingAllowed && a.status === "ACTIVE").map(a => (
                          <SelectItem key={a.id} value={a.id}>{a.code} - {a.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <Label>Invoice Lines</Label>
                  <div className="space-y-2.5">
                    {selectedLines.map((line, idx) => (
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
                        <div className="w-[100px] flex flex-col gap-1">
                          <Label className="text-[10px] text-slate-400">Qty</Label>
                          <Input type="number" min="0" placeholder="0" value={line.quantity || ""} onChange={e => handleLineChange(idx, "quantity", parseFloat(e.target.value) || 0)} className="h-8 text-sm" />
                        </div>
                        <div className="w-[110px] flex flex-col gap-1">
                          <Label className="text-[10px] text-slate-400">Unit Price ($)</Label>
                          <Input type="number" step="0.01" min="0" placeholder="0.00" value={line.unitPrice || ""} onChange={e => handleLineChange(idx, "unitPrice", parseFloat(e.target.value) || 0)} className="h-8 font-mono text-sm" />
                        </div>
                        <div className="flex-1 min-w-[150px] flex flex-col gap-1">
                          <Label className="text-[10px] text-slate-400">Description</Label>
                          <Input placeholder="Line description" value={line.description} onChange={e => handleLineChange(idx, "description", e.target.value)} className="h-8 text-xs" />
                        </div>
                        <div className="self-end pb-0.5">
                          <Button type="button" size="icon" variant="ghost" disabled={selectedLines.length <= 1} onClick={() => handleRemoveLine(idx)} className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50">
                            <X size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <Button type="button" variant="outline" size="sm" onClick={handleAddLine} className="text-xs">Add Line</Button>
                    <div className="text-sm font-mono font-bold text-slate-600">
                      Total: <span className="text-slate-900">${lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
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

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b pb-3">
        {(["ALL", "PAYABLE", "RECEIVABLE"] as const).map(t => (
          <Button
            key={t}
            variant={filterType === t ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilterType(t)}
            className="text-xs"
          >
            {t === "ALL" ? "All Invoices" : t}
          </Button>
        ))}
      </div>

      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b text-slate-500 font-semibold">
                <th className="px-6 py-3">Invoice #</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Party</th>
                <th className="px-6 py-3">Period</th>
                <th className="px-6 py-3 text-right">Total</th>
                <th className="px-6 py-3 text-right">Paid</th>
                <th className="px-6 py-3 text-right">Balance</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                filtered.map(inv => (
                  <tr
                    key={inv.id}
                    className={`border-b hover:bg-slate-50/50 transition-colors cursor-pointer ${selectedInvoice?.id === inv.id ? "bg-slate-50/50" : ""}`}
                    onClick={() => setSelectedInvoice(inv)}
                  >
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">{inv.invoiceType}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{inv.partyName}</td>
                    <td className="px-6 py-4 text-slate-600">{inv.periodName}</td>
                    <td className="px-6 py-4 text-right font-mono font-semibold">${inv.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4 text-right font-mono font-semibold text-emerald-700">${inv.paidAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4 text-right font-mono font-semibold text-slate-900">${inv.remainingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4"><StatusBadge status={inv.status} /></td>
                    <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex gap-1 justify-end">
                        {inv.status === "DRAFT" && (
                          <Button size="sm" variant="outline" disabled={actionLoading} onClick={() => handleAction("submit", inv.id)} className="text-xs">Submit</Button>
                        )}
                        {inv.status === "SUBMITTED" && (
                          <Button size="sm" variant="outline" disabled={actionLoading} onClick={() => handleAction("approve", inv.id)} className="text-xs">Approve</Button>
                        )}
                        {inv.status === "APPROVED" && (
                          <Button size="sm" disabled={actionLoading} onClick={() => handleAction("post", inv.id)} className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white">Post</Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Panel */}
      {selectedInvoice && (
        <div className="bg-white border rounded-lg p-5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-sm font-bold text-slate-900">{selectedInvoice.invoiceNumber}</h3>
                <StatusBadge status={selectedInvoice.status} />
              </div>
              <p className="text-sm font-semibold text-slate-800 mt-1">{selectedInvoice.partyName}</p>
              <div className="text-xs text-slate-500 mt-1">
                Period: <strong>{selectedInvoice.periodName}</strong> · Due: {selectedInvoice.dueDate}
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-slate-900">${selectedInvoice.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              <div className="text-xs text-slate-500">Remaining: ${selectedInvoice.remainingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
          </div>

          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 border-b font-semibold text-slate-500">
                  <th className="px-4 py-2.5">Account Code</th>
                  <th className="px-4 py-2.5">Account Name</th>
                  <th className="px-4 py-2.5">Description</th>
                  <th className="px-4 py-2.5 text-right">Qty</th>
                  <th className="px-4 py-2.5 text-right">Unit Price</th>
                  <th className="px-4 py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.lines.map((line, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-3 font-mono font-bold">{line.accountCode ?? line.accountId}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{line.accountName ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-500 italic">{line.description || "—"}</td>
                    <td className="px-4 py-3 text-right font-mono">{line.quantity}</td>
                    <td className="px-4 py-3 text-right font-mono">${line.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">${line.lineAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
                <tr className="bg-slate-50/80 font-bold border-t-2">
                  <td colSpan={5} className="px-4 py-3 text-slate-700 text-right">Total</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-900">${selectedInvoice.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
