"use client";

import { useState } from "react";
import { Plus, Check, X, AlertCircle, Loader2, FileText } from "lucide-react";
import type { Vendor, VendorStatement, ApAgingReport } from "../types/fms";
import { createVendorAction, updateVendorAction } from "../actions/fms-actions";
import { listVendors, getVendorStatement, getApAgingReport } from "../api/vendors";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shared/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/features/shared/components/ui/dialog";
import { StatusBadge } from "@/features/shared/components/StatusBadge";
import { PageHeader } from "@/features/shared/components/PageHeader";

interface VendorManagerProps {
  initialVendors: Vendor[];
}

export default function VendorManager({ initialVendors }: VendorManagerProps) {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [statement, setStatement] = useState<VendorStatement | null>(null);
  const [aging, setAging] = useState<ApAgingReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = vendors.filter(vendor => (filter === "all" || vendor.status === filter) && `${vendor.vendorCode} ${vendor.name} ${vendor.email}`.toLowerCase().includes(query.toLowerCase()));

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const input = {
      vendorCode: String(form.get("vendorCode") || "").trim(),
      name: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim() || undefined,
      phone: String(form.get("phone") || "").trim() || undefined,
      address: String(form.get("address") || "").trim() || undefined,
      taxId: String(form.get("taxId") || "").trim() || undefined,
    };
    if (!input.vendorCode || !input.name) {
      setError("Vendor code and name are required.");
      return;
    }
    const res = await createVendorAction({ ok: false }, input);
    if (res.ok) {
      const mockNew: Vendor = {
        id: "mock_vendor_" + Date.now(),
        vendorCode: input.vendorCode,
        name: input.name,
        email: input.email ?? null,
        phone: input.phone ?? null,
        address: input.address ?? null,
        taxId: input.taxId ?? null,
        paymentTerms: "NET_30",
        defaultApAccountId: null,
        defaultApAccountCode: null,
        defaultApAccountName: null,
        status: "ACTIVE",
        createdBy: "general_accountant",
        createdAt: new Date().toISOString(),
        updatedAt: null,
      };
      setVendors([mockNew, ...vendors]);
      setIsCreateOpen(false);
    } else {
      setError(res.message || "Failed to create vendor.");
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedVendor) return;
    setError(null);
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const input = {
      name: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim() || undefined,
      phone: String(form.get("phone") || "").trim() || undefined,
      address: String(form.get("address") || "").trim() || undefined,
      taxId: String(form.get("taxId") || "").trim() || undefined,
    };
    const res = await updateVendorAction(selectedVendor.id, input);
    if (res.ok) {
      const patch = { ...input, email: input.email ?? null, phone: input.phone ?? null, address: input.address ?? null, taxId: input.taxId ?? null };
      setVendors(vendors.map(v => v.id === selectedVendor.id ? { ...v, ...patch } : v));
      setSelectedVendor({ ...selectedVendor, ...patch });
      setIsEditOpen(false);
    } else {
      setError(res.message || "Failed to update vendor.");
    }
  }

  async function loadStatement(id: string) {
    try {
      const data = await getVendorStatement(id);
      setStatement(data);
    } catch (err: any) {
      alert("Failed to load statement: " + err.message);
    }
  }

  async function loadAging() {
    try {
      const data = await getApAgingReport();
      setAging(data);
    } catch (err: any) {
      alert("Failed to load aging report: " + err.message);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Vendors"
        subtitle="Manage vendor master data and AP aging"
        action={
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} /> Add Vendor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-white">
              <DialogHeader>
                <DialogTitle>Create Vendor</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="flex flex-col gap-4 mt-2">
                {error && <div className="text-red-500 text-sm flex items-center gap-1.5"><AlertCircle size={16} /> {error}</div>}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="vendorCode">Vendor Code *</Label>
                    <Input id="vendorCode" name="vendorCode" placeholder="VND-XXX" required />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="name">Vendor Name *</Label>
                    <Input id="name" name="name" placeholder="Vendor name" required />
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
                  <Button type="submit">Create Vendor</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="flex flex-wrap gap-2">
        <Input name="q" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search vendors..." className="max-w-md" />
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
        <Button variant="outline" onClick={loadAging}>AP Aging Report</Button>
      </div>

      {aging && (
        <div className="bg-white border rounded-lg p-5 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-2">AP Aging Report — {aging.asOfDate}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50 border-b font-semibold text-slate-500">
                  <th className="px-4 py-2.5">Vendor</th>
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
                  <tr key={item.vendorId} className="border-b">
                    <td className="px-4 py-3 font-semibold text-slate-800">{item.vendorCode} - {item.vendorName}</td>
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
                <th className="px-6 py-3">Vendor Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Payment Terms</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-slate-400">No vendors found.</td></tr>
              ) : filtered.map(vendor => (
                <tr key={vendor.id} className="border-b hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setSelectedVendor(vendor)}>
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">{vendor.vendorCode}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{vendor.name}</td>
                  <td className="px-6 py-4 text-slate-600">{vendor.email ?? "—"}</td>
                  <td className="px-6 py-4 text-slate-600">{vendor.phone ?? "—"}</td>
                  <td className="px-6 py-4 text-slate-600">{vendor.paymentTerms}</td>
                  <td className="px-6 py-4"><StatusBadge status={vendor.status} /></td>
                  <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="outline" onClick={() => { setSelectedVendor(vendor); setIsEditOpen(true); }} className="text-xs">Edit</Button>
                      <Button size="sm" variant="ghost" onClick={() => loadStatement(vendor.id)} className="text-xs"><FileText size={12} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedVendor && (
        <Dialog open={!!selectedVendor && !isEditOpen} onOpenChange={(open) => !open && setSelectedVendor(null)}>
          <DialogContent className="max-w-md bg-white">
            <DialogHeader>
              <DialogTitle>{selectedVendor.vendorCode} - {selectedVendor.name}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2 text-sm">
              <div><strong>Email:</strong> {selectedVendor.email ?? "—"}</div>
              <div><strong>Phone:</strong> {selectedVendor.phone ?? "—"}</div>
              <div><strong>Address:</strong> {selectedVendor.address ?? "—"}</div>
              <div><strong>Tax ID:</strong> {selectedVendor.taxId ?? "—"}</div>
              <div><strong>Payment Terms:</strong> {selectedVendor.paymentTerms}</div>
              <div><strong>Status:</strong> <StatusBadge status={selectedVendor.status} /></div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setSelectedVendor(null)}>Close</Button>
              <Button onClick={() => setIsEditOpen(true)}>Edit</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {selectedVendor && isEditOpen && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-md bg-white">
            <DialogHeader>
              <DialogTitle>Edit Vendor</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="flex flex-col gap-4 mt-2">
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Vendor Name</Label>
                <Input id="name" name="name" defaultValue={selectedVendor.name} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" defaultValue={selectedVendor.email ?? ""} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" defaultValue={selectedVendor.phone ?? ""} />
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
          <h3 className="font-bold text-slate-900 mb-2">Vendor Statement — {statement.vendorName}</h3>
          <div className="text-xs text-slate-500 mb-3">As of {statement.statementDate}</div>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 border-b font-semibold text-slate-500">
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5">Type</th>
                  <th className="px-4 py-2.5">Reference</th>
                  <th className="px-4 py-2.5 text-right">Invoice</th>
                  <th className="px-4 py-2.5 text-right">Payment</th>
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
                    <td className="px-4 py-3 text-right font-mono">${line.paymentAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
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