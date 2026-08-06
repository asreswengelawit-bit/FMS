import { useState } from "react"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { Button } from "@/features/shared/components/ui/button"
import { ShoppingCart, AlertCircle, CheckCircle2, Clock, Plus } from "lucide-react"
import { SearchFilter, SectionCard, DataTableHead, AlertBanner } from "@/features/shared/components"
import { apInvoices, statusConfig } from "./fms.data"

function StatusBadge({ status }: { status: string }) {
  const s = statusConfig[status] ?? { color: "#64748B", bg: "#F1F5F9" }
  return <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: s.color, background: s.bg }}>{status}</span>
}

export function FMSAccountsPayable() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const statuses = ["All", "Draft", "Pending", "Approved", "Paid", "Overdue"]

  const filtered = apInvoices.filter(inv => {
    const matchSearch = inv.id.toLowerCase().includes(search.toLowerCase())
      || inv.supplier.toLowerCase().includes(search.toLowerCase())
      || inv.invoiceNo.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "All" || inv.status === statusFilter
    return matchSearch && matchStatus
  })

  const overdue        = apInvoices.filter(i => i.status === "Overdue")
  const totalOutstanding = apInvoices.reduce((s, i) => s + i.outstanding, 0)
  const totalPaid      = apInvoices.reduce((s, i) => s + i.paid, 0)
  const pending        = apInvoices.filter(i => i.status === "Pending" || i.status === "Approved")

  return (
    <div className="space-y-4">
      {overdue.length > 0 && (
        <AlertBanner
          type="warning"
          message={`<strong>${overdue.length} supplier invoice${overdue.length > 1 ? "s" : ""} overdue</strong> — ETB ${overdue.reduce((s, i) => s + i.outstanding, 0).toLocaleString()} requires immediate payment. AP Officer action required.`}
        />
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Invoices",   value: String(apInvoices.length),                                  color: "#0B1E3D", icon: ShoppingCart },
          { label: "Paid",             value: `ETB ${(totalPaid / 1000).toFixed(0)}K`,                    color: "#16A34A", icon: CheckCircle2 },
          { label: "Outstanding",      value: `ETB ${(totalOutstanding / 1000).toFixed(0)}K`,             color: "#D97706", icon: Clock },
          { label: "Overdue",          value: String(overdue.length),                                      color: "#C8102E", icon: AlertCircle },
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

      {/* Maker-checker note */}
      <div className="bg-white rounded-xl border p-4 flex gap-3" style={{ borderColor: "#E8EDF5" }}>
        <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#EEF2FF" }}>
          <CheckCircle2 className="h-4 w-4" style={{ color: "#4F6FAF" }} />
        </div>
        <div>
          <p className="text-xs font-bold" style={{ color: "#0B1E3D" }}>Maker-Checker Control</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            <strong>AP Officer</strong> creates supplier invoices and proposes payment.
            <strong> AP Supervisor / Finance Manager</strong> approves before posting.
            Duplicate supplier invoice detection is enforced.
          </p>
        </div>
      </div>

      <SearchFilter value={search} onChange={setSearch} placeholder="Search by AP ID, supplier, or invoice number…">
        <div className="flex gap-1">
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
              style={{ background: statusFilter === s ? "#0B1E3D" : "#F1F5F9", color: statusFilter === s ? "white" : "#64748B" }}>
              {s}
            </button>
          ))}
        </div>
        <Button className="gap-1.5 text-xs h-9 text-white" style={{ background: "#D97706" }}>
          <Plus className="h-3.5 w-3.5" /> Record Invoice
        </Button>
      </SearchFilter>

      <SectionCard title="Supplier Invoices (Accounts Payable)" icon={ShoppingCart} noPadding count={filtered.length}>
        <Table>
          <DataTableHead columns={["AP ID", "Supplier", "PO Reference", "Invoice No.", "Date", "Due Date", "Amount (ETB)", "Outstanding (ETB)", "Status", "Approved By", "Actions"]} />
          <TableBody>
            {filtered.map(inv => (
              <TableRow key={inv.id} className="hover:bg-slate-50">
                <TableCell className="font-mono text-xs font-bold" style={{ color: "#D97706" }}>{inv.id}</TableCell>
                <TableCell className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{inv.supplier}</TableCell>
                <TableCell className="font-mono text-xs" style={{ color: "#4F6FAF" }}>{inv.poRef}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{inv.invoiceNo}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{inv.date}</TableCell>
                <TableCell>
                  <span className="text-xs" style={{ color: inv.status === "Overdue" ? "#C8102E" : "#64748B" }}>
                    {inv.status === "Overdue" && <AlertCircle className="inline h-3 w-3 mr-0.5 -mt-0.5" />}
                    {inv.dueDate}
                  </span>
                </TableCell>
                <TableCell className="text-sm font-bold" style={{ color: "#0B1E3D" }}>{inv.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <span className="text-sm font-bold" style={{ color: inv.outstanding > 0 ? "#C8102E" : "#16A34A" }}>
                    {inv.outstanding > 0 ? inv.outstanding.toLocaleString() : "Settled"}
                  </span>
                </TableCell>
                <TableCell><StatusBadge status={inv.status} /></TableCell>
                <TableCell className="text-xs text-muted-foreground">{inv.approvedBy || "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {inv.status === "Pending" && (
                      <Button size="sm" className="h-7 text-xs text-white gap-1" style={{ background: "#16A34A" }}>
                        <CheckCircle2 className="h-3 w-3" /> Approve
                      </Button>
                    )}
                    {inv.status === "Approved" && inv.outstanding > 0 && (
                      <Button size="sm" className="h-7 text-xs text-white gap-1" style={{ background: "#4F6FAF" }}>
                        Pay
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
