import { useState } from "react"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { ShoppingCart } from "lucide-react"
import { AlertBanner, SectionCard, DataTableHead, SearchFilter } from "@/features/shared/components"
import { purchaseRequests, statusConfig } from "./prms.data"

function Badge({ label }: { label: string }) {
  const s = statusConfig[label] ?? { color: "#64748B", bg: "#F1F5F9" }
  return <span className="text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap" style={{ color: s.color, background: s.bg }}>{label}</span>
}

export function PRMSRequisitions() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [urgencyFilter, setUrgencyFilter] = useState("All")

  const statuses = ["All", "Pending", "Finance Review", "Approved", "PO Issued", "Rejected"]
  const urgencies = ["All", "Normal", "High", "Urgent"]

  const filtered = purchaseRequests.filter(pr => {
    const q = search.toLowerCase()
    return (
      (pr.title.toLowerCase().includes(q) || pr.id.toLowerCase().includes(q) || pr.requestedBy.toLowerCase().includes(q) || pr.department.toLowerCase().includes(q)) &&
      (statusFilter === "All" || pr.status === statusFilter) &&
      (urgencyFilter === "All" || pr.urgency === urgencyFilter)
    )
  })

  const pendingCount  = purchaseRequests.filter(pr => pr.status === "Pending" || pr.status === "Finance Review").length
  const approvedCount = purchaseRequests.filter(pr => pr.status === "Approved" || pr.status === "PO Issued").length
  const urgentCount   = purchaseRequests.filter(pr => pr.urgency === "Urgent").length

  return (
    <div className="space-y-4">
      <AlertBanner
        type="info"
        message="<strong>Purchase Requisitions only</strong> — This view shows departmental purchase requests routed through PRMS. Internal material/store requisitions are managed within MMS."
      />
      {urgentCount > 0 && (
        <AlertBanner
          type="warning"
          message={`<strong>${urgentCount} urgent requisition${urgentCount > 1 ? "s" : ""}</strong> require priority attention.`}
        />
      )}

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Purchase Reqs", value: String(purchaseRequests.length), color: "#4F6FAF" },
          { label: "Pending/In Review",   value: String(pendingCount),            color: "#D97706" },
          { label: "Approved/PO Issued",  value: String(approvedCount),           color: "#16A34A" },
          { label: "Urgent",              value: String(urgentCount),             color: "#C8102E" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5", borderLeftWidth: 3, borderLeftColor: s.color }}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold mt-0.5" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <SearchFilter value={search} onChange={setSearch} placeholder="Search by PR ID, title, department, or requester…">
        <div className="flex gap-1.5 flex-wrap">
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap"
              style={{ background: statusFilter === s ? "#0B1E3D" : "#F1F5F9", color: statusFilter === s ? "white" : "#64748B" }}>
              {s}
            </button>
          ))}
        </div>
        <select value={urgencyFilter} onChange={e => setUrgencyFilter(e.target.value)}
          className="text-xs border rounded-lg px-3 py-2 bg-white" style={{ borderColor: "#E8EDF5" }}>
          {urgencies.map(u => <option key={u}>{u}</option>)}
        </select>
      </SearchFilter>

      <SectionCard title="Purchase Requisitions" icon={ShoppingCart} noPadding count={filtered.length}>
        <Table>
          <DataTableHead columns={["PR ID", "Title", "Department", "Requested By", "Date", "Required By", "Items", "Amount (ETB)", "Urgency", "Status", "Approved By"]} />
          <TableBody>
            {filtered.map(pr => (
              <TableRow key={pr.id} className="hover:bg-slate-50">
                <TableCell className="font-mono text-xs font-bold" style={{ color: "#4F6FAF" }}>{pr.id}</TableCell>
                <TableCell style={{ maxWidth: 200 }}>
                  <p className="text-sm font-semibold truncate" style={{ color: "#0B1E3D" }}>{pr.title}</p>
                  {pr.justification && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{pr.justification}</p>
                  )}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{pr.department}</TableCell>
                <TableCell className="text-xs whitespace-nowrap" style={{ color: "#0B1E3D" }}>{pr.requestedBy}</TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{pr.date}</TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{pr.requiredDate}</TableCell>
                <TableCell className="text-sm font-bold text-center" style={{ color: "#4F6FAF" }}>{pr.items}</TableCell>
                <TableCell className="text-sm font-bold whitespace-nowrap" style={{ color: "#0B1E3D" }}>{pr.amount.toLocaleString()}</TableCell>
                <TableCell><Badge label={pr.urgency} /></TableCell>
                <TableCell><Badge label={pr.status} /></TableCell>
                <TableCell className="text-xs" style={{ color: pr.approvedBy ? "#16A34A" : "#94A3B8" }}>
                  {pr.approvedBy ?? "—"}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={11} className="text-center text-muted-foreground text-sm py-8">No requisitions match the current filter</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  )
}
