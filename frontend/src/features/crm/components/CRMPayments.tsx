import { useState } from "react"
import { Search, Plus, CheckCircle, Clock, Eye } from "lucide-react"
import { Button } from "@/features/shared/components/ui/button"
import { Input } from "@/features/shared/components/ui/input"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { SectionCard, DataTableHead } from "@/features/shared/components"
import { payments, statusConfig } from "./crm.data"

export function CRMPayments() {
  const [search, setSearch]     = useState("")
  const [filterStatus, setFilterStatus] = useState("All")

  const filtered = payments.filter(p => {
    const matchSearch = p.customer.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.reference.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === "All" || p.status === filterStatus
    return matchSearch && matchStatus
  })

  const totalCollected = payments.filter(p => p.status === "Completed").reduce((s, p) => s + p.amount, 0)
  const totalPending   = payments.filter(p => p.status === "Pending").reduce((s, p) => s + p.amount, 0)

  const methodBreakdown = ["Bank Transfer", "Cheque", "Cash"].map(method => ({
    method,
    count: payments.filter(p => p.method === method).length,
    amount: payments.filter(p => p.method === method).reduce((s, p) => s + p.amount, 0),
  }))

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Payments",      value: String(payments.length),                       color: "#2563EB" },
          { label: "Collected",           value: `ETB ${(totalCollected / 1000000).toFixed(2)}M`, color: "#16A34A" },
          { label: "Pending",             value: `ETB ${(totalPending / 1000000).toFixed(2)}M`,   color: "#D97706" },
          { label: "Pending Transactions",value: String(payments.filter(p => p.status === "Pending").length), color: "#D97706" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5", borderLeftWidth: 3, borderLeftColor: s.color }}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold mt-0.5" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Payment Method Summary */}
      <div className="grid grid-cols-3 gap-3">
        {methodBreakdown.map(m => (
          <div key={m.method} className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5" }}>
            <p className="text-xs font-semibold text-muted-foreground">{m.method}</p>
            <p className="text-lg font-bold mt-1" style={{ color: "#0B1E3D" }}>ETB {m.amount.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{m.count} transaction{m.count !== 1 ? "s" : ""}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search payments..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-9 text-sm" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="h-9 text-sm border rounded-md px-3 bg-white" style={{ borderColor: "#E8EDF5", color: "#0B1E3D" }}>
          {["All", "Completed", "Pending", "Failed"].map(s => <option key={s}>{s}</option>)}
        </select>
        <Button className="h-9 gap-1.5 text-sm" style={{ background: "#C8102E", color: "#fff" }}>
          <Plus className="h-3.5 w-3.5" /> Record Payment
        </Button>
      </div>

      {/* Table */}
      <SectionCard title={`Payment Transactions (${filtered.length})`} noPadding>
        <div className="px-5 pb-4 pt-3 overflow-x-auto">
          <Table>
            <DataTableHead columns={["Payment ID", "Invoice Ref", "Customer", "Date", "Amount", "Method", "Reference", "Processed By", "Status", "Actions"]} />
            <TableBody>
              {filtered.map(p => {
                const sc = statusConfig[p.status] ?? { color: "#64748B", bg: "#F1F5F9" }
                return (
                  <TableRow key={p.id} className="hover:bg-slate-50">
                    <TableCell className="text-xs font-mono font-semibold" style={{ color: "#C8102E" }}>{p.id}</TableCell>
                    <TableCell className="text-xs font-mono" style={{ color: "#2563EB" }}>{p.invoiceId}</TableCell>
                    <TableCell className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{p.customer}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.date}</TableCell>
                    <TableCell className="text-sm font-bold" style={{ color: "#16A34A" }}>
                      ETB {p.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#EEF2FF", color: "#2563EB" }}>{p.method}</span>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{p.reference}</TableCell>
                    <TableCell className="text-xs" style={{ color: "#0B1E3D" }}>{p.processedBy}</TableCell>
                    <TableCell>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit" style={{ color: sc.color, background: sc.bg }}>
                        {p.status === "Completed"
                          ? <CheckCircle className="h-2.5 w-2.5" />
                          : <Clock className="h-2.5 w-2.5" />}
                        {p.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <button className="p-1 rounded hover:bg-slate-100" title="View">
                        <Eye className="h-3.5 w-3.5" style={{ color: "#2563EB" }} />
                      </button>
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
