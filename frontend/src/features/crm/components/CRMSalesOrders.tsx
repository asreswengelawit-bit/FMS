import { useState } from "react"
import { Search, Plus, Eye, CheckCircle, XCircle, Clock } from "lucide-react"
import { Button } from "@/features/shared/components/ui/button"
import { Input } from "@/features/shared/components/ui/input"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { SectionCard, DataTableHead } from "@/features/shared/components"
import { salesOrders, statusConfig } from "./crm.data"

function StatusBadge({ status }: { status: string }) {
  const s = statusConfig[status] ?? { color: "#64748B", bg: "#F1F5F9" }
  return <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: s.color, background: s.bg }}>{status}</span>
}

export function CRMSalesOrders() {
  const [search, setSearch]     = useState("")
  const [filterStatus, setFilterStatus] = useState("All")

  const filtered = salesOrders.filter(o => {
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === "All" || o.status === filterStatus
    return matchSearch && matchStatus
  })

  const total        = salesOrders.reduce((s, o) => s + o.amount, 0)
  const pendingApproval = salesOrders.filter(o => o.status === "Pending Approval").length
  const delivered    = salesOrders.filter(o => o.status === "Delivered").length

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Orders",       value: String(salesOrders.length),                                       color: "#2563EB" },
          { label: "Total Value",        value: `ETB ${(total / 1000000).toFixed(2)}M`,                           color: "#0B1E3D" },
          { label: "Pending Approval",   value: String(pendingApproval),                                          color: pendingApproval > 0 ? "#D97706" : "#16A34A" },
          { label: "Delivered",          value: String(delivered),                                                 color: "#16A34A" },
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
          <Input placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-9 text-sm" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="h-9 text-sm border rounded-md px-3 bg-white" style={{ borderColor: "#E8EDF5", color: "#0B1E3D" }}>
          {["All", "Pending Approval", "Confirmed", "Processing", "Delivered", "Cancelled"].map(s => <option key={s}>{s}</option>)}
        </select>
        <Button className="h-9 gap-1.5 text-sm" style={{ background: "#C8102E", color: "#fff" }}>
          <Plus className="h-3.5 w-3.5" /> New Order
        </Button>
      </div>

      {/* Table */}
      <SectionCard title={`Sales Orders (${filtered.length})`} noPadding>
        <div className="px-5 pb-4 pt-3 overflow-x-auto">
          <Table>
            <DataTableHead columns={["Order ID", "Quotation Ref", "Customer", "Order Date", "Delivery Date", "Amount (ETB)", "Order Status", "Payment Status", "Approved By", "Actions"]} />
            <TableBody>
              {filtered.map(so => (
                <TableRow key={so.id} className="hover:bg-slate-50">
                  <TableCell className="text-xs font-mono font-semibold" style={{ color: "#C8102E" }}>{so.id}</TableCell>
                  <TableCell className="text-xs font-mono" style={{ color: "#2563EB" }}>{so.quotation}</TableCell>
                  <TableCell className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{so.customer}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{so.date}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{so.deliveryDate}</TableCell>
                  <TableCell className="text-sm font-bold" style={{ color: "#0B1E3D" }}>ETB {so.amount.toLocaleString()}</TableCell>
                  <TableCell><StatusBadge status={so.status} /></TableCell>
                  <TableCell><StatusBadge status={so.paymentStatus} /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {so.approvedBy === "—" || so.approvedBy === "Pending"
                        ? <Clock className="h-3 w-3" style={{ color: "#D97706" }} />
                        : <CheckCircle className="h-3 w-3" style={{ color: "#16A34A" }} />}
                      <span className="text-xs" style={{ color: so.approvedBy === "—" || so.approvedBy === "Pending" ? "#D97706" : "#0B1E3D" }}>
                        {so.approvedBy === "—" ? "Pending" : so.approvedBy}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {so.status === "Pending Approval" && (
                        <>
                          <button className="p-1 rounded hover:bg-green-50" title="Approve">
                            <CheckCircle className="h-3.5 w-3.5" style={{ color: "#16A34A" }} />
                          </button>
                          <button className="p-1 rounded hover:bg-red-50" title="Reject">
                            <XCircle className="h-3.5 w-3.5" style={{ color: "#C8102E" }} />
                          </button>
                        </>
                      )}
                      <button className="p-1 rounded hover:bg-slate-100" title="View">
                        <Eye className="h-3.5 w-3.5" style={{ color: "#2563EB" }} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  )
}
