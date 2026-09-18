"use client";

import { useState } from "react";
import { Plus, Check, X, Eye, AlertCircle, Loader2 } from "lucide-react";
import type { Payment, Invoice, Account, BankAccount } from "../types/fms";
import { processPaymentAction } from "../actions/fms-actions";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shared/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/features/shared/components/ui/dialog";
import { StatusBadge } from "@/features/shared/components/StatusBadge";
import { PageHeader } from "@/features/shared/components/PageHeader";

interface PaymentManagerProps {
  initialPayments: Payment[];
  invoices: Invoice[];
  accounts: Account[];
  bankAccounts: BankAccount[];
}

export default function PaymentManager({ initialPayments, invoices, bankAccounts }: PaymentManagerProps) {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(initialPayments[0] || null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const payableInvoices = invoices.filter(inv => inv.invoiceType === "PAYABLE" && inv.remainingBalance > 0);
  const receivableInvoices = invoices.filter(inv => inv.invoiceType === "RECEIVABLE" && inv.remainingBalance > 0);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget as HTMLFormElement);
    const invoiceId = String(form.get("invoiceId") || "");
    const bankAccountId = String(form.get("bankAccountId") || "");
    const paymentType = String(form.get("paymentType") || "DISBURSEMENT") as "DISBURSEMENT" | "RECEIPT";
    const paymentDate = String(form.get("paymentDate") || "");
    const amount = Number(form.get("amount") || 0);
    const paymentNumber = String(form.get("paymentNumber") || "").trim();
    const referenceNumber = String(form.get("referenceNumber") || "").trim();

    if (!invoiceId || !bankAccountId || !paymentDate || amount <= 0) {
      setError("Invoice, bank account, date, and amount are required.");
      return;
    }

    const input = {
      paymentType,
      invoiceId,
      bankAccountId,
      paymentNumber: paymentNumber || `PMT-${Date.now()}`,
      paymentDate,
      amount,
      referenceNumber: referenceNumber || undefined,
    };

    const res = await processPaymentAction({ ok: false }, input);
    if (res.ok) {
      const inv = invoices.find(i => i.id === invoiceId);
      const bankAcc = bankAccounts.find(b => b.id === bankAccountId);
      const mockNew: Payment = {
        id: "mock_pay_" + Date.now(),
        paymentNumber: input.paymentNumber,
        paymentType,
        invoiceId,
        invoiceNumber: inv?.invoiceNumber ?? "",
        bankAccountId,
        bankAccountCode: bankAcc?.glControlAccountCode ?? bankAcc?.accountNumber ?? "BANK-NA",
        bankAccountName: bankAcc?.accountName ?? "Bank Account",
        paymentDate,
        amount,
        referenceNumber: referenceNumber || null,
        status: "COMPLETED",
        journalEntryId: "j_auto_pay_" + Date.now(),
        createdBy: "general_accountant",
        createdAt: new Date().toISOString(),
        updatedAt: null,
      };
      setPayments([mockNew, ...payments]);
      setSelectedPayment(mockNew);
      setIsCreateOpen(false);
    } else {
      setError(res.message || "Failed to process payment.");
    }
  }

  const selectedInvoice = selectedPayment
    ? invoices.find(i => i.id === selectedPayment.invoiceId)
    : null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Payments"
        subtitle="Record and track customer receipts and vendor disbursements"
        action={
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} /> Record Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-white">
              <DialogHeader>
                <DialogTitle>Record Payment</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="flex flex-col gap-4 mt-2">
                {error && <div className="text-red-500 text-sm flex items-center gap-1.5"><AlertCircle size={16} /> {error}</div>}

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="paymentType">Payment Type *</Label>
                  <Select name="paymentType" defaultValue="DISBURSEMENT">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="DISBURSEMENT">DISBURSEMENT (Pay Vendor)</SelectItem>
                      <SelectItem value="RECEIPT">RECEIPT (Receive from Customer)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="invoiceId">Invoice *</Label>
                  <Select name="invoiceId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select invoice" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {payableInvoices.map(inv => (
                        <SelectItem key={inv.id} value={inv.id}>{inv.invoiceNumber} - {inv.partyName} (${inv.remainingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} remaining)</SelectItem>
                      ))}
                      {receivableInvoices.map(inv => (
                        <SelectItem key={inv.id} value={inv.id}>{inv.invoiceNumber} - {inv.partyName} (${inv.remainingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} remaining)</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="paymentNumber">Payment Number</Label>
                  <Input id="paymentNumber" name="paymentNumber" placeholder="Auto-generated if blank" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="bankAccountId">Bank Account *</Label>
                  <Select name="bankAccountId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bank account" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {(() => {
                        const list = bankAccounts.filter(b => b.status === "ACTIVE");
                        if (list.length === 0) {
                          return <div className="px-2 py-1.5 text-sm text-slate-400">No bank accounts available</div>;
                        }
                        return list.map(b => (
                          <SelectItem key={b.id} value={b.id}>{b.accountName} ({b.accountNumber})</SelectItem>
                        ));
                      })()}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="paymentDate">Payment Date *</Label>
                    <Input type="date" id="paymentDate" name="paymentDate" required />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="amount">Amount *</Label>
                    <Input type="number" step="0.01" min="0" id="amount" name="amount" placeholder="0.00" required />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="referenceNumber">Reference Number</Label>
                  <Input id="referenceNumber" name="referenceNumber" placeholder="e.g. CHK-99812" />
                </div>

                <div className="flex justify-end gap-2 mt-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={saving}>{saving ? "Processing..." : "Record Payment"}</Button>
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
                <th className="px-6 py-3">Payment #</th>
                <th className="px-6 py-3">Invoice</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Bank Account</th>
                <th className="px-6 py-3 text-right">Amount</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Reference</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">
                    No payments recorded.
                  </td>
                </tr>
              ) : (
                payments.map(pay => (
                  <tr
                    key={pay.id}
                    className={`border-b hover:bg-slate-50/50 transition-colors cursor-pointer ${selectedPayment?.id === pay.id ? "bg-slate-50/50" : ""}`}
                    onClick={() => setSelectedPayment(pay)}
                  >
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">{pay.paymentNumber}</td>
                    <td className="px-6 py-4 font-mono text-slate-700">{pay.invoiceNumber}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">{pay.paymentType}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{pay.bankAccountName ?? "—"}</td>
                    <td className="px-6 py-4 text-right font-mono font-semibold text-slate-900">${pay.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4 text-slate-600">{pay.paymentDate}</td>
                    <td className="px-6 py-4 font-mono text-slate-600">{pay.referenceNumber ?? "—"}</td>
                    <td className="px-6 py-4"><StatusBadge status={pay.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Detail */}
      {selectedPayment && (
        <div className="bg-white border rounded-lg p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-sm font-bold text-slate-900">{selectedPayment.paymentNumber}</h3>
                <StatusBadge status={selectedPayment.status} />
              </div>
              <p className="text-sm font-semibold text-slate-800 mt-1">
                {selectedPayment.paymentType === "DISBURSEMENT" ? "Disbursement to" : "Receipt from"}: {selectedInvoice?.partyName ?? "—"}
              </p>
              <div className="text-xs text-slate-500 mt-1">
                Invoice: <strong>{selectedPayment.invoiceNumber}</strong> · Account: {selectedPayment.bankAccountName} ({selectedPayment.bankAccountCode})
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-slate-900">${selectedPayment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              <div className="text-xs text-slate-500">Ref: {selectedPayment.referenceNumber ?? "—"}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
