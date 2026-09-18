"use client";

import { useState } from "react";
import { Plus, Check, X, AlertCircle, Loader2, FileText } from "lucide-react";
import type { Customer, CustomerStatement, ArAgingReport } from "../types/fms";
import { createCustomerAction, updateCustomerAction } from "../actions/fms-actions";
import { listCustomers, getCustomerStatement, getArAgingReport } from "../api/customers";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shared/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/features/shared/components/ui/dialog";
import { StatusBadge } from "@/features/shared/components/StatusBadge";
import { PageHeader } from "@/features/shared/components/PageHeader";

interface CustomerManagerProps {
  initialCustomers: Customer[];
}

export default function CustomerManager({ initialCustomers }: CustomerManagerProps) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [statement, setStatement] = useState<CustomerStatement | null>(null);
  const [aging, setAging] = useState<ArAgingReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = customers.filter(customer => (filter === "all" || customer.status === filter) && `${customer.customerCode} ${customer.name} ${customer.email}`.toLowerCase().includes(query.toLowerCase()));

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const input = {
      customerCode: String(form.get("customerCode") || "").trim(),
      name: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim() || undefined,
      phone: String(form.get("phone") || "").trim() || undefined,
      address: String(form.get("address") || "").trim() || undefined,
      taxId: String(form.get("taxId") || "").trim() || undefined,
    };
    if (!input.customerCode || !input.name) {
      setError("Customer code and name are required.");
      return;
    }
    const res = await createCustomerAction({ ok: false }, input);
    if (res.ok) {
      const mockNew: Customer = {
        id: "mock_customer_" + Date.now(),
        customerCode: input.customerCode,
        name: input.name,
        email: input.email ?? null,
        phone: input.phone ?? null,
        address: input.address ?? null,
        taxId: input.taxId ?? null,
        creditLimit: null,
        paymentTerms: "NET_30",
        defaultArAccountId: null,
        defaultArAccountCode: null,
        defaultArAccountName: null,
        status: "ACTIVE",
        createdBy: "general_accountant",
        createdAt: new Date().toISOString(),
        updatedAt: null,
      };
      setCustomers([mockNew, ...customers]);
      setIsCreateOpen(false);
    } else {
      setError(res.message || "Failed to create customer.");
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCustomer) return;
    setError(null);
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const input = {
      name: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim() || undefined,
      phone: String(form.get("phone") || "").trim() || undefined,
      address: String(form.get("address") || "").trim() || undefined,
      taxId: String(form.get("taxId") || "").trim() || undefined,
    };
    const res = await updateCustomerAction(selectedCustomer.id, input);
    if (res.ok) {
      const patch = { ...input, email: input.email ?? null, phone: input.phone ?? null, address: input.address ?? null, taxId: input.taxId ?? null };
      setCustomers(customers.map(c => c.id === selectedCustomer.id ? { ...c, ...patch } : c));
      setSelectedCustomer({ ...selectedCustomer, ...patch });
      setIsEditOpen(false);
    } else {
      setError(res.message || "Failed to update customer.");
    }
  }

  async function loadStatement(id: string) {
    try {
      const data = await getCustomerStatement(id);
      setStatement(data);
    } catch (err: any) {
      alert("Failed to load statement: " + err.message);
    }
  }

  async function loadAging() {
    try {
      const data = await getArAgingReport();
      setAging(data);
    } catch (err: any) {
      alert("Failed to load aging report: " + err.message);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Customers"
        subtitle="Manage customer master data and AR aging"
        action={
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} /> Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-white">
              <DialogHeader>
                <DialogTitle>Create Customer</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="flex flex-col gap-4 mt-2">
                {error && <div className="text-red-500 text-sm flex items-center gap-1.5"><AlertCircle size={16} /> {error}</div>}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="customerCode">Customer Code *</Label>
                    <Input id="customerCode" name="customerCode" placeholder="CST-XXX" required />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="name">Customer Name *</Label>
                    <Input id="name" name="name" placeholder="Customer name" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="email@example.com" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" placeholder="+251-..." />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" placeholder="Physical address" />
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                  <Button type="submit">Create Customer</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="flex flex-wrap gap-2">
        <Input name="q" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search customers..." className="max-w-md" />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={loadAging}>AR Aging Report</Button>
      </div>

      {aging && (
        <div className="bg-white border rounded-lg p-5 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-2">AR Aging Report — {aging.asOfDate}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50 border-b font-semibold text-slate-500">
                  <th className="px-4 py-2.5">Customer</th>
                  <th className="px-4 py-2.5 text-right">Current</th>
                  <th className="px-4 py-2.5 text-right">1-30 Days</th>
                  <th className="px-4 py-2.5 text-right">31-60 Days</th>
                  <th className="px-4 py-2.5 text-right">61-90 Days</th>
                  <th className="px-4 py-2.5 text-right">90+ Days</th>
                  <th className="px-4 py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {aging.items.map(item => (
                  <tr key={item.customerId} className="border-b">
                    <td className="px-4 py-3 font-semibold text-slate-800">{item.customerCode} - {item.customerName}</td>
                    <td className="px-4 py-3 text-right font-mono">${item.current.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-right font-mono">${item.days1To30.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-right font-mono">${item.days31To60.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-right font-mono">${item.days61To90.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-right font-mono">${item.days90Plus.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold">${item.totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b text-slate-500 font-semibold">
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Customer Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Payment Terms</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-slate-400">No customers found.</td></tr>
              ) : filtered.map(customer => (
                <tr key={customer.id} className="border-b hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">{customer.customerCode}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{customer.name}</td>
                  <td className="px-6 py-4 text-slate-600">{customer.email ?? "—"}</td>
                  <td className="px-6 py-4 text-slate-600">{customer.phone ?? "—"}</td>
                  <td className="px-6 py-4 text-slate-600">{customer.paymentTerms}</td>
                  <td className="px-6 py-4"><StatusBadge status={customer.status} /></td>
                  <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="outline" onClick={() => { setSelectedCustomer(customer); setIsEditOpen(true); }} className="text-xs">Edit</Button>
                      <Button size="sm" variant="ghost" onClick={() => loadStatement(customer.id)} className="text-xs"><FileText size={12} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCustomer && (
        <Dialog open={!!selectedCustomer && !isEditOpen} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
          <DialogContent className="max-w-md bg-white">
            <DialogHeader>
              <DialogTitle>{selectedCustomer.customerCode} - {selectedCustomer.name}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2 text-sm">
              <div><strong>Email:</strong> {selectedCustomer.email ?? "—"}</div>
              <div><strong>Phone:</strong> {selectedCustomer.phone ?? "—"}</div>
              <div><strong>Address:</strong> {selectedCustomer.address ?? "—"}</div>
              <div><strong>Tax ID:</strong> {selectedCustomer.taxId ?? "—"}</div>
              <div><strong>Credit Limit:</strong> {selectedCustomer.creditLimit != null ? `$${selectedCustomer.creditLimit.toLocaleString()}` : "—"}</div>
              <div><strong>Payment Terms:</strong> {selectedCustomer.paymentTerms}</div>
              <div><strong>Status:</strong> <StatusBadge status={selectedCustomer.status} /></div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setSelectedCustomer(null)}>Close</Button>
              <Button onClick={() => setIsEditOpen(true)}>Edit</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {selectedCustomer && isEditOpen && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-md bg-white">
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="flex flex-col gap-4 mt-2">
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Customer Name</Label>
                <Input id="name" name="name" defaultValue={selectedCustomer.name} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" defaultValue={selectedCustomer.email ?? ""} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" defaultValue={selectedCustomer.phone ?? ""} />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {statement && (
        <div className="bg-white border rounded-lg p-5 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-2">Customer Statement — {statement.customerName}</h3>
          <div className="text-xs text-slate-500 mb-3">As of {statement.statementDate}</div>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 border-b font-semibold text-slate-500">
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5">Type</th>
                  <th className="px-4 py-2.5">Reference</th>
                  <th className="px-4 py-2.5 text-right">Invoice</th>
                  <th className="px-4 py-2.5 text-right">Receipt</th>
                  <th className="px-4 py-2.5 text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {statement.transactions.map((line, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-3">{line.transactionDate}</td>
                    <td className="px-4 py-3 text-slate-800">{line.transactionType}</td>
                    <td className="px-4 py-3 text-slate-500">{line.referenceNumber ?? "—"}</td>
                    <td className="px-4 py-3 text-right font-mono">${line.invoiceAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-right font-mono">${line.receiptAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">${line.runningBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
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