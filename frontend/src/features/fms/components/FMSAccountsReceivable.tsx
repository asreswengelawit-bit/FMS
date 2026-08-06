import { useState } from "react"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { Button } from "@/features/shared/components/ui/button"
import { Receipt, AlertCircle, CheckCircle2, Clock, Plus } from "lucide-react"
import { SearchFilter, SectionCard, DataTableHead, AlertBanner } from "@/features/shared/components"
import { arInvoices, statusConfig } from "./fms.data"

function StatusBadge({ status }: { status: string }) {
  const s = statusConfig[status] ?? { color: "#64748B", bg: "#F1F5F9" }
  return <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: s.color, background: s.bg }}>{status}</span>
}

const agingBuckets = [
  { label: "Current (0–30 days)",   days: [0, 30],  color: "#16A34A" },
  { label: "31–60 days",            days: [31, 60], color: "#D97706" },
  { label: "61–90 days",            days: [61, 90], color: "#C8102E" },
  { label: "> 90 days",             days: [91, 999],color: "#7C3AED" },
]

export function FMSAccountsReceivable() {
  const [search, setSearch]       = useState("")
  const [statusFilter, setStatus] = useState("All")
  const statuses = ["All", "Pending", "Partially Paid", "Fully Paid", "Overdue"]

  const overdue        = arInvoices.filter(i => i.status === "Overdue")
  const totalOutstanding = arInvoices.reduce((s, i) => s + i.outstanding, 0)
  const totalCollected = arInvoices.reduce((s, i) => s + i.paid, 0)

  const filtered = arInvoices.filter(inv => {
    const matchSearch = inv.id.toLowerCase().includes(search.toLowerCase())
      || inv.customer.toLowerCase().includes(search.toLowerCase())
      || inv.salesRef.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "All" || inv.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-4">
      {overdue.length > 0 && (
        <AlertBanner
          type="warning"
          message={`<strong>${overdue.length} customer invoice${overdue.length > 1 ? "s" : ""} overdue</strong> — ETB ${overdue.reduce((s, i) => s + i.outstanding, 0).toLocaleString()} outstanding. AR Officer follow-up required.`}
        />
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Invoices",  value: String(arInvoices.length),                          color: "#0B1E3D", icon: Receipt      },
          { label: "Collected",       value: `ETB ${(totalCollected / 1000000).toFixed(2)}M`,    color: "#16A34A", icon: CheckCircle2 },
          { label: "Outstanding",     value: `ETB ${(totalOutstanding / 1000000).toFixed(2)}M`,  color: "#D97706", icon: Clock        },
          { label: "Overdue",         value: String(overdue.length),                              color: "#C8102E", icon: AlertCircle  },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl border shadow-sm p-4 flex items-center gap-3" style={{ borderColor: "#E8EDF5", borderLeftWidth: 3, borderLeftColor: color }}>
            <div className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: color + "18" }}>
              <Icon className="h-4 w-4" style={{ color }} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-lg font-bold" style={{ color }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Aging summary */}
      <div className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5" }}>
        <p className="text-xs font-bold mb-3" style={{ color: "#0B1E3D" }}>AR Aging Buckets</p>
        <div className="grid grid-cols-4 gap-3">
          {agingBuckets.map(({ label, color }) => {
            const amt = arInvoices
              .filter(i => i.outstanding > 0)
              .reduce((s, i) => {
                const daysPast = i.status === "Overdue" ? 45 : 10
                const inBucket = (label === "Current (0–30 days)" && daysPast <= 30)
                  || (label === "31–60 days" && daysPast > 30 && daysPast <= 60)
                  || (label === "61–90 days" && daysPast > 60 && daysPast <= 90)
                  || (label === "> 90 days" && daysPast > 90)
                return s + (inBucket ? i.outstanding : 0)
              }, 0)
            return (
              <div key={label} className="text-center p-3 rounded-lg" style={{ background: color + "10", border: `1px solid ${color}30` }}>
                <p className="text-xs text-muted-foreground leading-tight mb-1">{label}</p>
                <p className="text-sm font-bold" style={{ color }}>ETB {(amt / 1000).toFixed(0)}K</p>
              </div>
            )
          })}
        </div>
      </div>

      <SearchFilter value={search} onChange={setSearch} placeholder="Search by AR ID, customer, or sales order…">
        <div className="flex gap-1">
          {statuses.map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
              style={{ background: statusFilter === s ? "#0B1E3D" : "#F1F5F9", color: statusFilter === s ? "white" : "#64748B" }}>
              {s}
            </button>
          ))}
        </div>
        <Button className="gap-1.5 text-xs h-9 text-white" style={{ background: "#16A34A" }}>
          <Plus className="h-3.5 w-3.5" /> Create Invoice
        </Button>
      </SearchFilter>

      <SectionCard title="Customer Invoices (Accounts Receivable)" icon={Receipt} noPadding count={filtered.length}>
        <Table>
          <DataTableHead columns={["AR ID", "Customer", "Sales Ref", "Issue Date", "Due Date", "Amount (ETB)", "Paid (ETB)", "Outstanding (ETB)", "Status", "Approved By", "Actions"]} />
          <TableBody>
            {filtered.map(inv => (
              <TableRow key={inv.id} className="hover:bg-slate-50">
                <TableCell className="font-mono text-xs font-bold" style={{ color: "#16A34A" }}>{inv.id}</TableCell>
                <TableCell className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{inv.customer}</TableCell>
                <TableCell className="font-mono text-xs" style={{ color: "#4F6FAF" }}>{inv.salesRef}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{inv.date}</TableCell>
                <TableCell>
                  <span className="text-xs" style={{ color: inv.status === "Overdue" ? "#C8102E" : "#64748B" }}>
                    {inv.status === "Overdue" && <AlertCircle className="inline h-3 w-3 mr-0.5 -mt-0.5" />}
                    {inv.dueDate}
                  </span>
                </TableCell>
                <TableCell className="text-sm font-bold" style={{ color: "#0B1E3D" }}>{inv.amount.toLocaleString()}</TableCell>
                <TableCell className="text-sm font-semibold" style={{ color: "#16A34A" }}>{inv.paid > 0 ? inv.paid.toLocaleString() : "—"}</TableCell>
                <TableCell>
                  <span className="text-sm font-bold" style={{ color: inv.outstanding > 0 ? "#C8102E" : "#16A34A" }}>
                    {inv.outstanding > 0 ? inv.outstanding.toLocaleString() : "Settled"}
                  </span>
                </TableCell>
                <TableCell><StatusBadge status={inv.status} /></TableCell>
                <TableCell className="text-xs text-muted-foreground">{inv.approvedBy || "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {inv.outstanding > 0 && (
                      <Button size="sm" className="h-7 text-xs text-white" style={{ background: "#16A34A" }}>
                        Record Receipt
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="h-7 text-xs">View</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  )
}
