import { useState } from "react"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { Button } from "@/features/shared/components/ui/button"
import { FileSearch, Plus, Send, Clock, CheckCircle2, Users, AlertTriangle } from "lucide-react"
import { SearchFilter, SectionCard, DataTableHead, AlertBanner } from "@/features/shared/components"
import { rfqs, statusConfig } from "./prms.data"

function StatusBadge({ status }: { status: string }) {
  const s = statusConfig[status] ?? { color: "#64748B", bg: "#F1F5F9" }
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: s.color, background: s.bg }}>
      {status}
    </span>
  )
}

export function PRMSRfq() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const statuses = ["All", "Draft", "Published", "Closed"]

  const filtered = rfqs.filter(rfq => {
    const matchSearch =
      rfq.id.toLowerCase().includes(search.toLowerCase()) ||
      rfq.title.toLowerCase().includes(search.toLowerCase()) ||
      rfq.prRef.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "All" || rfq.status === statusFilter
    return matchSearch && matchStatus
  })

  const published = rfqs.filter(r => r.status === "Published").length
  const closed    = rfqs.filter(r => r.status === "Closed").length
  const totalInvited = rfqs.reduce((s, r) => s + r.suppliersInvited, 0)
  const totalReceived = rfqs.reduce((s, r) => s + r.quotationsReceived, 0)

  return (
    <div className="space-y-4">
      <AlertBanner
        type="info"
        message="<strong>RFQ Rules:</strong> Only Qualified suppliers can be invited. An RFQ cannot be published without at least one invited supplier. Deadline extensions require an audit note."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Published RFQs",    value: String(published),      color: "#2563EB", icon: Send },
          { label: "Closed RFQs",       value: String(closed),         color: "#64748B", icon: CheckCircle2 },
          { label: "Suppliers Invited", value: String(totalInvited),   color: "#0B1E3D", icon: Users },
          { label: "Quotations In",     value: String(totalReceived),  color: "#16A34A", icon: Clock },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl border shadow-sm p-4 flex items-center gap-3"
            style={{ borderColor: "#E8EDF5", borderLeftWidth: 3, borderLeftColor: color }}>
            <div className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: color + "18" }}>
              <Icon className="h-4 w-4" style={{ color }} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-lg font-bold" style={{ color }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* RFQ lifecycle note */}
      <div className="bg-white rounded-xl border p-4" style={{ borderColor: "#E8EDF5" }}>
        <p className="text-xs font-bold mb-2" style={{ color: "#0B1E3D" }}>RFQ Lifecycle</p>
        <div className="flex items-center gap-2 flex-wrap">
          {["Draft", "→", "Invite Suppliers", "→", "Publish", "→", "Receive Quotations", "→", "Close", "→", "Evaluate"].map((step, i) => (
            <span key={i} className={`text-xs ${step === "→" ? "text-muted-foreground" : "font-semibold px-2 py-0.5 rounded-md"}`}
              style={step !== "→" ? { background: "#EEF2FF", color: "#2563EB" } : {}}>
              {step}
            </span>
          ))}
        </div>
      </div>

      <SearchFilter value={search} onChange={setSearch} placeholder="Search by RFQ ID, title or PR reference…">
        <div className="flex gap-1">
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
              style={{ background: statusFilter === s ? "#0B1E3D" : "#F1F5F9", color: statusFilter === s ? "white" : "#64748B" }}>
              {s}
            </button>
          ))}
        </div>
        <Button className="gap-1.5 text-xs h-9 text-white" style={{ background: "#1D4ED8" }}>
          <Plus className="h-3.5 w-3.5" /> Create RFQ
        </Button>
      </SearchFilter>

      <SectionCard title="Request for Quotation (RFQ)" icon={FileSearch} noPadding count={filtered.length}>
        <Table>
          <DataTableHead columns={["RFQ ID", "Title", "PR Ref", "Category", "Published", "Deadline", "Suppliers Invited", "Quotations Received", "Amendments", "Status", "Actions"]} />
          <TableBody>
            {filtered.map(rfq => (
              <TableRow key={rfq.id} className="hover:bg-slate-50">
                <TableCell className="font-mono text-xs font-bold" style={{ color: "#1D4ED8" }}>{rfq.id}</TableCell>
                <TableCell>
                  <p className="text-sm font-semibold" style={{ color: "#0B1E3D", maxWidth: 220 }}>{rfq.title}</p>
                  <p className="text-xs text-muted-foreground">by {rfq.createdBy}</p>
                </TableCell>
                <TableCell className="font-mono text-xs" style={{ color: "#4F6FAF" }}>{rfq.prRef}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{rfq.category}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{rfq.publishDate || "—"}</TableCell>
                <TableCell>
                  <span className="text-xs font-medium" style={{ color: rfq.status === "Published" ? "#D97706" : "#64748B" }}>
                    {rfq.deadline}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-sm font-bold" style={{ color: rfq.suppliersInvited > 0 ? "#0B1E3D" : "#94A3B8" }}>
                    {rfq.suppliersInvited}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-sm font-bold" style={{ color: rfq.quotationsReceived > 0 ? "#16A34A" : "#94A3B8" }}>
                    {rfq.quotationsReceived}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  {rfq.amendments > 0 ? (
                    <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ background: "#FFFBEB", color: "#D97706" }}>
                      v{rfq.amendments + 1}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell><StatusBadge status={rfq.status} /></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {rfq.status === "Draft" && (
                      <Button size="sm" className="h-7 text-xs text-white gap-1" style={{ background: "#1D4ED8" }}>
                        <Send className="h-3 w-3" /> Publish
                      </Button>
                    )}
                    {rfq.status === "Published" && (
                      <>
                        <Button size="sm" className="h-7 text-xs text-white gap-1" style={{ background: "#D97706" }}>
                          <Users className="h-3 w-3" /> Invite
                        </Button>
                        <Button size="sm" className="h-7 text-xs text-white gap-1" style={{ background: "#64748B" }}>
                          <AlertTriangle className="h-3 w-3" /> Close
                        </Button>
                      </>
                    )}
                    {rfq.status === "Closed" && (
                      <Button size="sm" className="h-7 text-xs text-white gap-1" style={{ background: "#16A34A" }}>
                        <CheckCircle2 className="h-3 w-3" /> Evaluate
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
