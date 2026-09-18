"use client";

import { useState } from "react";
import { Plus, Check, X, RefreshCw } from "lucide-react";
import type { Account, AccountType } from "../types/fms";
import { createAccountAction, toggleAccountStatusAction } from "../actions/fms-actions";
import { validateAccount } from "../schemas/validation";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shared/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/features/shared/components/ui/dialog";
import { StatusBadge } from "@/features/shared/components/StatusBadge";
import { PageHeader } from "@/features/shared/components/PageHeader";

interface CoaManagerProps {
  initialAccounts: Account[];
}

export default function CoaManager({ initialAccounts }: CoaManagerProps) {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [selectedType, setSelectedType] = useState<AccountType | "ALL">("ALL");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("ASSET");
  const [postingAllowed, setPostingAllowed] = useState(true);
  const [description, setDescription] = useState("");
  const [parentAccountId, setParentAccountId] = useState("");

  const filtered = selectedType === "ALL" 
    ? accounts 
    : accounts.filter(a => a.type === selectedType);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const input = {
      code: code.trim(),
      name: name.trim(),
      type,
      postingAllowed,
      description: description.trim() || undefined,
      parentAccountId: parentAccountId || null
    };

    // Validate input
    const validationErrors = validateAccount(input);
    if (Object.keys(validationErrors).length > 0) {
      setError(Object.values(validationErrors).join(", "));
      return;
    }

    const res = await createAccountAction({ ok: false }, input);
    if (res.ok) {
      // Refresh mock state locally
      const mockNew: Account = {
        id: "mock_" + Date.now(),
        code: input.code,
        name: input.name,
        type: input.type,
        normalBalance: (type === "ASSET" || type === "EXPENSE") ? "DEBIT" : "CREDIT",
        parentAccountId: input.parentAccountId || null,
        postingAllowed: input.postingAllowed,
        description: input.description || null,
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
        createdBy: "general_accountant",
        updatedAt: null,
        updatedBy: null,
        version: 0,
      };
      setAccounts([mockNew, ...accounts]);
      setIsCreateOpen(false);
      // Reset form
      setCode("");
      setName("");
      setType("ASSET");
      setPostingAllowed(true);
      setDescription("");
      setParentAccountId("");
    } else {
      setError(res.message || "Failed to create account.");
    }
  }

  async function handleToggleStatus(id: string) {
    const res = await toggleAccountStatusAction(id);
    if (res.ok) {
      setAccounts(accounts.map(a => 
        a.id === id 
          ? { ...a, status: a.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }
          : a
      ));
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Chart of Accounts" 
        subtitle="Manage financial account categories and double-entry balances"
        action={
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} /> Add Account
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-white">
              <DialogHeader>
                <DialogTitle>Create Account Category</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="flex flex-col gap-4 mt-2">
                {error && <div className="text-red-500 text-sm">{error}</div>}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="code">Account Code *</Label>
                    <Input 
                      id="code" 
                      placeholder="e.g. 1010" 
                      value={code} 
                      onChange={e => setCode(e.target.value)} 
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="type">Account Type *</Label>
                    <Select value={type} onValueChange={(val: AccountType) => setType(val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="ASSET">ASSET (Debit)</SelectItem>
                        <SelectItem value="LIABILITY">LIABILITY (Credit)</SelectItem>
                        <SelectItem value="EQUITY">EQUITY (Credit)</SelectItem>
                        <SelectItem value="REVENUE">REVENUE (Credit)</SelectItem>
                        <SelectItem value="EXPENSE">EXPENSE (Debit)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name">Account Name *</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g. Cash in Hand" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="parent">Parent Account (Optional)</Label>
                  <Select value={parentAccountId} onValueChange={setParentAccountId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent account (if sub-account)" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="none_val">None (Header Account)</SelectItem>
                      {accounts.filter(a => !a.parentAccountId).map(a => (
                        <SelectItem key={a.id} value={a.id}>{a.code} - {a.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    placeholder="Enter short description" 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                  />
                </div>

                <div className="flex items-center gap-2 py-2">
                  <input 
                    type="checkbox" 
                    id="posting" 
                    checked={postingAllowed} 
                    onChange={e => setPostingAllowed(e.target.checked)} 
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="posting" className="cursor-pointer font-medium text-sm">
                    Allow direct posting (journal entries)
                  </Label>
                </div>

                <div className="flex justify-end gap-2 mt-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                  <Button type="submit">Save Account</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b pb-3">
        {(["ALL", "ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"] as const).map(t => (
          <Button 
            key={t}
            variant={selectedType === t ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedType(t)}
            className="text-xs"
          >
            {t}
          </Button>
        ))}
      </div>

      {/* Accounts Table */}
      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b text-slate-500 font-semibold">
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Normal Balance</th>
                <th className="px-6 py-3 text-center">Posting</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No accounts found for selected filter.
                  </td>
                </tr>
              ) : (
                filtered.map(acc => (
                  <tr key={acc.id} className="border-b hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">{acc.code}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{acc.name}</div>
                      {acc.description && <div className="text-xs text-slate-400 mt-0.5">{acc.description}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">{acc.type}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-600">{acc.normalBalance}</td>
                    <td className="px-6 py-4 text-center">
                      {acc.postingAllowed ? (
                        <span className="inline-flex items-center text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-medium"><Check size={12} className="mr-1" /> Allowed</span>
                      ) : (
                        <span className="inline-flex items-center text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-medium"><X size={12} className="mr-1" /> Header Only</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={acc.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleToggleStatus(acc.id)}
                        className="text-xs"
                      >
                        {acc.status === "ACTIVE" ? "Deactivate" : "Activate"}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
