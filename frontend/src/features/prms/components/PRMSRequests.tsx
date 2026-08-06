import { useState } from "react"
import { Button } from "@/features/shared/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { FileText, Plus, Eye, AlertCircle } from "lucide-react"
import { SearchFilter, SectionCard, DataTableHead, AlertBanner } from "@/features/shared/components"
import { purchaseRequests, statusConfig } from "./prms.data"

function Badge({ label }: { label: string }) {
  const s = statusConfig[label] ?? { color: "#64748B", bg: "#F1F5F9" }
  return <span className="text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap" style={{ color: s.color, background: s.bg }}>{label}</span>
}

export function PRMSRequests() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [urgencyFilter, setUrgencyFilter] = useState("All")

  const statuses = ["All", "Pending", "Finance Review", "Approved", "PO Issued", "Rejected"]
  const urgencies = ["All", "Normal", "High", "Urgent"]

  const filtered = purchaseRequests.filter(pr => {
    const q = search.toLowerCase()
    return (
      (pr.title.toLowerCase().includes(q) || pr.id.toLowerCase().includes(q) || pr.requestedBy.toLowerCase().includes(q)) &&
      (statusFilter  === "All" || pr.status  === statusFilter) &&
      (urgencyFilter === "All" || pr.urgency === urgencyFilter)
    )
  })

  const pending  = purchaseRequests.filter(pr => pr.status === "Pending").length
  const urgent   = purchaseRequests.filter(pr => pr.urgency === "Urgent").length
  const totalVal = purchaseRequests.reduce((s, pr) => s + pr.amount, 0)

  return (
    <div className="space-y-4">
      {urgent > 0 && (
        <AlertBanner
          type="warning"
          message={`<strong>${urgent} urgent request${urgent > 1 ? "s" : ""}</strong> require immediate attention. Please review and action promptly.`}
        />
      )}

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Requests", value: String(purchaseRequests.length), color: "#4F6FAF" },
          { label: "Pending Action", value: String(pending),                  color: "#D97706" },
          { label: "Urgent",         value: String(urgent),                   color: "#C8102E" },
          { label: "Total Value",    value: `ETB ${(totalVal / 1000000).toFixed(2)}M`, color: "#0B1E3D" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5", borderLeftWidth: 3, borderLeftColor: s.color }}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold mt-0.5" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <SearchFilter value={search} onChange={setSearch} placeholder="Search by PR ID, title, or requester…">
        <div className="flex gap-1.5">
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
        <Button className="gap-1.5 text-xs h-9 text-white whitespace-nowrap" style={{ background: "#4F6FAF" }}>
          <Plus className="h-3.5 w-3.5" /> New Request
        </Button>
      </SearchFilter>

      <SectionCard title="Purchase Requests" icon={FileText} noPadding count={filtered.length}>
        <Table>
          <DataTableHead columns={["PR ID", "Description", "Department", "Requested By", "Date", "Required By", "Items", "Amount (ETB)", "Urgency", "Status", ""]} />
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
                <TableCell className="text-xs font-medium whitespace-nowrap" style={{ color: pr.urgency === "Urgent" ? "#C8102E" : "#0B1E3D" }}>
                  {pr.urgency === "Urgent" && <AlertCircle className="inline h-3 w-3 mr-0.5 -mt-0.5" />}
                  {pr.requiredDate}
                </TableCell>
                <TableCell className="text-sm font-bold text-center" style={{ color: "#4F6FAF" }}>{pr.items}</TableCell>
                <TableCell className="text-sm font-bold whitespace-nowrap" style={{ color: "#0B1E3D" }}>
                  {pr.amount.toLocaleString()}
                </TableCell>
                <TableCell><Badge label={pr.urgency} /></TableCell>
                <TableCell><Badge label={pr.status} /></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0"><Eye className="h-3.5 w-3.5" /></Button>
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
