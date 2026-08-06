import { useState } from "react"
import { Search, Plus, Edit2, Phone, Mail, Shield } from "lucide-react"
import { Button } from "@/features/shared/components/ui/button"
import { Input } from "@/features/shared/components/ui/input"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { SectionCard, DataTableHead } from "@/features/shared/components"
import { customers, statusConfig } from "./crm.data"

const classificationConfig: Record<string, { color: string; bg: string }> = {
  PUBLIC:       { color: "#16A34A", bg: "#F0FDF4" },
  INTERNAL:     { color: "#2563EB", bg: "#EEF2FF" },
  CONFIDENTIAL: { color: "#D97706", bg: "#FFFBEB" },
  SECRET:       { color: "#C8102E", bg: "#FFF1F3" },
}

export function CRMCustomers() {
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.contact.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
    const matchType   = filterType === "All"   || c.type === filterType
    const matchStatus = filterStatus === "All" || c.status === filterStatus
    return matchSearch && matchType && matchStatus
  })

  const totalOutstanding = customers.reduce((s, c) => s + c.outstanding, 0)
  const totalCreditLimit = customers.reduce((s, c) => s + c.creditLimit, 0)

  return (
    <div className="space-y-5">
      {/* KPI Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Customers",    value: String(customers.length),                                    color: "#2563EB" },
          { label: "Active",             value: String(customers.filter(c => c.status === "Active").length), color: "#16A34A" },
          { label: "Total Outstanding",  value: `ETB ${(totalOutstanding / 1000000).toFixed(2)}M`,           color: "#C8102E" },
          { label: "Total Credit Limit", value: `ETB ${(totalCreditLimit / 1000000).toFixed(1)}M`,           color: "#7C3AED" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5", borderLeftWidth: 3, borderLeftColor: s.color }}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold mt-0.5" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-9 text-sm" />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          className="h-9 text-sm border rounded-md px-3 bg-white" style={{ borderColor: "#E8EDF5", color: "#0B1E3D" }}>
          {["All", "Government", "State Enterprise", "Private", "NGO"].map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="h-9 text-sm border rounded-md px-3 bg-white" style={{ borderColor: "#E8EDF5", color: "#0B1E3D" }}>
          {["All", "Active", "Inactive", "Prospect", "Blacklisted"].map(s => <option key={s}>{s}</option>)}
        </select>
        <Button className="h-9 gap-1.5 text-sm" style={{ background: "#C8102E", color: "#fff" }}>
          <Plus className="h-3.5 w-3.5" /> Add Customer
        </Button>
      </div>

      {/* Table */}
      <SectionCard title={`Customer Registry (${filtered.length})`} noPadding>
        <div className="px-5 pb-4 pt-3 overflow-x-auto">
          <Table>
            <DataTableHead columns={["ID", "Name", "Type", "Contact", "City", "Credit Limit", "Outstanding", "Orders", "Classification", "Status", "Actions"]} />
            <TableBody>
              {filtered.map(c => {
                const sc = statusConfig[c.status] ?? { color: "#64748B", bg: "#F1F5F9" }
                const cc = classificationConfig[c.dataClassification]
                const creditUsed = c.creditLimit > 0 ? (c.outstanding / c.creditLimit) * 100 : 0
                return (
                  <TableRow key={c.id} className="hover:bg-slate-50">
                    <TableCell className="text-xs font-mono font-semibold" style={{ color: "#2563EB" }}>{c.id}</TableCell>
                    <TableCell>
                      <p className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.tin}</p>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: "#7C3AED", background: "#F5F3FF" }}>{c.type}</span>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm" style={{ color: "#0B1E3D" }}>{c.contact}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{c.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.city}</TableCell>
                    <TableCell className="text-sm font-semibold" style={{ color: "#4F6FAF" }}>
                      ETB {c.creditLimit.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-bold" style={{ color: c.outstanding > 0 ? (creditUsed > 70 ? "#C8102E" : "#D97706") : "#16A34A" }}>
                        {c.outstanding > 0 ? `ETB ${c.outstanding.toLocaleString()}` : "Nil"}
                      </p>
                      {c.outstanding > 0 && (
                        <div className="h-1 w-20 rounded-full mt-1" style={{ background: "#E8EDF5" }}>
                          <div className="h-1 rounded-full" style={{ width: `${Math.min(creditUsed, 100)}%`, background: creditUsed > 70 ? "#C8102E" : "#D97706" }} />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-center" style={{ color: "#0B1E3D" }}>{c.orders}</TableCell>
                    <TableCell>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit" style={{ color: cc.color, background: cc.bg }}>
                        <Shield className="h-2.5 w-2.5" /> {c.dataClassification}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: sc.color, background: sc.bg }}>{c.status}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <button className="p-1 rounded hover:bg-slate-100" title="Call">
                          <Phone className="h-3.5 w-3.5" style={{ color: "#2563EB" }} />
                        </button>
                        <button className="p-1 rounded hover:bg-slate-100" title="Email">
                          <Mail className="h-3.5 w-3.5" style={{ color: "#16A34A" }} />
                        </button>
                        <button className="p-1 rounded hover:bg-slate-100" title="Edit">
                          <Edit2 className="h-3.5 w-3.5" style={{ color: "#C8102E" }} />
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
