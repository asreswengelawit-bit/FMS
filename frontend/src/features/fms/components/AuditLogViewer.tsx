"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import type { AuditLog } from "../types/fms";
import { listAuditLogs } from "../api/audit";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shared/components/ui/select";
import { StatusBadge } from "@/features/shared/components/StatusBadge";
import { PageHeader } from "@/features/shared/components/PageHeader";

export default function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [query, setQuery] = useState("");
  const [filterEntity, setFilterEntity] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadLogs() {
    setLoading(true);
    try {
      const data = await listAuditLogs({
        entityType: filterEntity || undefined,
        action: filterAction || undefined,
        performedBy: query || undefined,
        page: 0,
        size: 50,
      });
      setLogs(data.content ?? []);
    } catch (err: any) {
      alert("Failed to load audit logs: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const filtered = logs.filter(log =>
    `${log.entityType} ${log.entityId} ${log.performedBy} ${log.action}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Audit Logs"
        subtitle="Immutable audit trail for all FMS entity changes"
        action={
          <Button onClick={loadLogs} disabled={loading} className="flex items-center gap-2">
            {loading ? <span className="animate-spin">⟳</span> : <Search size={16} />}
            Refresh
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2">
        <Input name="q" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search logs..." className="max-w-md" />
        <Select value={filterEntity} onValueChange={setFilterEntity}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Entity type" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All Entities</SelectItem>
            <SelectItem value="ACCOUNT">Account</SelectItem>
            <SelectItem value="JOURNAL">Journal</SelectItem>
            <SelectItem value="INVOICE">Invoice</SelectItem>
            <SelectItem value="PAYMENT">Payment</SelectItem>
            <SelectItem value="VENDOR">Vendor</SelectItem>
            <SelectItem value="CUSTOMER">Customer</SelectItem>
            <SelectItem value="BUDGET">Budget</SelectItem>
            <SelectItem value="BANK_ACCOUNT">Bank Account</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterAction} onValueChange={setFilterAction}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="CREATE">Create</SelectItem>
            <SelectItem value="UPDATE">Update</SelectItem>
            <SelectItem value="DELETE">Delete</SelectItem>
            <SelectItem value="POST">Post</SelectItem>
            <SelectItem value="REVERSE">Reverse</SelectItem>
            <SelectItem value="CLOSE">Close</SelectItem>
            <SelectItem value="REOPEN">Reopen</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b text-slate-500 font-semibold">
                <th className="px-6 py-3">Entity</th>
                <th className="px-6 py-3">Entity ID</th>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">Performed By</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Changes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-slate-400">No audit logs found.</td></tr>
              ) : filtered.map(log => (
                <tr key={log.id} className="border-b hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-800">{log.entityType}</td>
                  <td className="px-6 py-4 font-mono text-xs">{log.entityId}</td>
                  <td className="px-6 py-4"><StatusBadge status={log.action} /></td>
                  <td className="px-6 py-4 text-slate-600">{log.performedBy}</td>
                  <td className="px-6 py-4 text-slate-600">{new Date(log.performedAt).toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {log.changes ? Object.keys(log.changes).length + " fields changed" : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
