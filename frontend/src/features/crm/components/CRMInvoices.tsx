import { useState } from "react"
import { Search, Download, Bell, Eye, FileText } from "lucide-react"
import { Button } from "@/features/shared/components/ui/button"
import { Input } from "@/features/shared/components/ui/input"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { SectionCard, DataTableHead } from "@/features/shared/components"
import { invoices, statusConfig } from "./crm.data"

export function CRMInvoices() {
  const [search, setSearch]     = useState("")
  const [filterStatus, setFilterStatus] = useState("All")

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.customer.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.orderId.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === "All" || inv.status === filterStatus
    return matchSearch && matchStatus
  })

  const totalAmount  = invoices.reduce((s, i) => s + i.amount, 0)
  const totalPaid    = invoices.reduce((s, i) => s + i.paid, 0)
  const totalUnpaid  = totalAmount - totalPaid
  const overdueCount = invoices.filter(i => i.status === "Overdue").length

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Invoiced",  value: `ETB ${(totalAmount / 1000000).toFixed(2)}M`, color: "#2563EB" },
          { label: "Collected",       value: `ETB ${(totalPaid / 1000000).toFixed(2)}M`,   color: "#16A34A" },
          { label: "Outstanding",     value: `ETB ${(totalUnpaid / 1000000).toFixed(2)}M`, color: "#D97706" },
          { label: "Overdue",         value: String(overdueCount),                          color: overdueCount > 0 ? "#C8102E" : "#16A34A" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5", borderLeftWidth: 3, borderLeftColor: s.color }}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold mt-0.5" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-9 text-sm" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="h-9 text-sm border rounded-md px-3 bg-white" style={{ borderColor: "#E8EDF5", color: "#0B1E3D" }}>
          {["All", "Paid", "Partial", "Unpaid", "Overdue", "Voided"].map(s => <option key={s}>{s}</option>)}
        </select>
        <Button variant="outline" className="h-9 gap-1.5 text-sm" style={{ borderColor: "#C8102E", color: "#C8102E" }}>
          <Download className="h-3.5 w-3.5" /> Export
        </Button>
      </div>

      {/* Table */}
      <SectionCard title={`Invoices (${filtered.length})`} noPadding>
        <div className="px-5 pb-4 pt-3 overflow-x-auto">
          <Table>
            <DataTableHead columns={["Invoice ID", "Order Ref", "Customer", "Date", "Due Date", "Amount", "Paid", "Balance", "Status", "Actions"]} />
            <TableBody>
              {filtered.map(inv => {
                const sc = statusConfig[inv.status] ?? { color: "#64748B", bg: "#F1F5F9" }
                const balance = inv.amount - inv.paid
                const isOverdue = inv.status === "Overdue"
                return (
                  <TableRow key={inv.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5" style={{ color: "#C8102E" }} />
                        <span className="text-xs font-mono font-semibold" style={{ color: "#C8102E" }}>{inv.id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-mono" style={{ color: "#2563EB" }}>{inv.orderId}</TableCell>
                    <TableCell className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{inv.customer}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{inv.date}</TableCell>
                    <TableCell>
                      <span className="text-xs" style={{ color: isOverdue ? "#C8102E" : "#64748B", fontWeight: isOverdue ? 700 : 400 }}>
                        {inv.dueDate}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm font-bold" style={{ color: "#0B1E3D" }}>
                      ETB {inv.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm font-semibold" style={{ color: "#16A34A" }}>
                      ETB {inv.paid.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-bold" style={{ color: balance > 0 ? (isOverdue ? "#C8102E" : "#D97706") : "#16A34A" }}>
                        {balance > 0 ? `ETB ${balance.toLocaleString()}` : "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: sc.color, background: sc.bg }}>{inv.status}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {balance > 0 && (
                          <button className="p-1 rounded hover:bg-yellow-50" title="Send reminder">
                            <Bell className="h-3.5 w-3.5" style={{ color: "#D97706" }} />
                          </button>
                        )}
                        <button className="p-1 rounded hover:bg-slate-100" title="Download PDF">
                          <Download className="h-3.5 w-3.5" style={{ color: "#2563EB" }} />
                        </button>
                        <button className="p-1 rounded hover:bg-slate-100" title="View">
                          <Eye className="h-3.5 w-3.5" style={{ color: "#64748B" }} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  )
}
