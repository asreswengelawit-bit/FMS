import { useState } from "react"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { Button } from "@/features/shared/components/ui/button"
import { Package, CheckCircle2, XCircle, Clock, AlertTriangle, Plus } from "lucide-react"
import { SearchFilter, SectionCard, DataTableHead, AlertBanner } from "@/features/shared/components"
import { goodsReceipts, statusConfig } from "./prms.data"

function InspectionBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
    Passed:  { color: "#16A34A", bg: "#F0FDF4", icon: <CheckCircle2 className="h-3 w-3" /> },
    Failed:  { color: "#C8102E", bg: "#FFF1F3", icon: <XCircle className="h-3 w-3" /> },
    Pending: { color: "#D97706", bg: "#FFFBEB", icon: <Clock className="h-3 w-3" /> },
  }
  const s = map[status] ?? { color: "#64748B", bg: "#F1F5F9", icon: null }
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit"
      style={{ color: s.color, background: s.bg }}>
      {s.icon}{status}
    </span>
  )
}

export function PRMSGoodsReceipt() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")
  const filters = ["All", "Passed", "Failed", "Pending"]

  const filtered = goodsReceipts.filter(gr => {
    const matchSearch =
      gr.id.toLowerCase().includes(search.toLowerCase()) ||
      gr.po.toLowerCase().includes(search.toLowerCase()) ||
      gr.supplier.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "All" || gr.inspectionStatus === filter
    return matchSearch && matchFilter
  })

  const passed  = goodsReceipts.filter(g => g.inspectionStatus === "Passed").length
  const pending = goodsReceipts.filter(g => g.inspectionStatus === "Pending").length
  const totalAccepted = goodsReceipts.reduce((s, g) => s + g.acceptedQty, 0)
  const totalRejected = goodsReceipts.reduce((s, g) => s + g.rejectedQty, 0)

  return (
    <div className="space-y-4">
      <AlertBanner
        type="info"
        message="<strong>Goods Receipt Process:</strong> Warehouse Officer receives goods against PO, performs quality inspection, records accepted/rejected quantities. A passed GR closes the PO line and triggers inventory update in MMS."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "GRs Processed",  value: String(goodsReceipts.length), color: "#0B1E3D", icon: Package       },
          { label: "Inspection OK",  value: String(passed),               color: "#16A34A", icon: CheckCircle2  },
          { label: "Pending GR",     value: String(pending),              color: "#D97706", icon: Clock         },
          { label: "Items Rejected", value: String(totalRejected),        color: "#C8102E", icon: AlertTriangle },
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

      {/* Role responsibilities */}
      <div className="bg-white rounded-xl border p-4" style={{ borderColor: "#E8EDF5" }}>
        <p className="text-xs font-bold mb-3" style={{ color: "#0B1E3D" }}>Goods Receipt Workflow</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { role: "WAREHOUSE OFFICER", actions: ["Receive goods", "Record quantities", "Flag rejections"], color: "#16A34A" },
            { role: "PROCUREMENT OFFICER", actions: ["Verify against PO", "Confirm delivery", "Trigger payment"], color: "#1D4ED8" },
            { role: "APPROVER / QC", actions: ["Final inspection sign-off", "Warehouse confirmation", "Close PO line"], color: "#7C3AED" },
          ].map(({ role, actions, color }) => (
            <div key={role} className="p-3 rounded-lg" style={{ background: color + "08", border: `1px solid ${color}20` }}>
              <p className="text-xs font-bold mb-1.5" style={{ color }}>{role}</p>
              <ul className="space-y-0.5">
                {actions.map(a => (
                  <li key={a} className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: color }} />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <SearchFilter value={search} onChange={setSearch} placeholder="Search by GR ID, PO reference, or supplier…">
        <div className="flex gap-1">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
              style={{ background: filter === f ? "#0B1E3D" : "#F1F5F9", color: filter === f ? "white" : "#64748B" }}>
              {f}
            </button>
          ))}
        </div>
        <Button className="gap-1.5 text-xs h-9 text-white" style={{ background: "#16A34A" }}>
          <Plus className="h-3.5 w-3.5" /> Record Receipt
        </Button>
      </SearchFilter>

      <SectionCard title="Goods Receipt Register" icon={Package} noPadding count={filtered.length}>
        <Table>
          <DataTableHead columns={["GR ID", "PO Reference", "Supplier", "Receipt Date", "Total Items", "Accepted", "Rejected", "Warehouse", "Received By", "Inspection", "Notes", "Actions"]} />
          <TableBody>
            {filtered.map(gr => (
              <TableRow key={gr.id} className="hover:bg-slate-50">
                <TableCell className="font-mono text-xs font-bold" style={{ color: "#16A34A" }}>{gr.id}</TableCell>
                <TableCell className="font-mono text-xs" style={{ color: "#4F6FAF" }}>{gr.po}</TableCell>
                <TableCell className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{gr.supplier}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{gr.date || "—"}</TableCell>
                <TableCell className="text-center text-sm font-semibold" style={{ color: "#0B1E3D" }}>{gr.items}</TableCell>
                <TableCell className="text-center">
                  <span className="text-sm font-bold" style={{ color: gr.acceptedQty > 0 ? "#16A34A" : "#94A3B8" }}>
                    {gr.acceptedQty}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-sm font-bold" style={{ color: gr.rejectedQty > 0 ? "#C8102E" : "#64748B" }}>
                    {gr.rejectedQty > 0 ? gr.rejectedQty : "—"}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{gr.warehouse}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{gr.receivedBy || "—"}</TableCell>
                <TableCell><InspectionBadge status={gr.inspectionStatus} /></TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-48">
                  <p className="truncate">{gr.note || "—"}</p>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {gr.inspectionStatus === "Pending" && (
                      <Button size="sm" className="h-7 text-xs text-white gap-1" style={{ background: "#16A34A" }}>
                        <CheckCircle2 className="h-3 w-3" /> Confirm
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

      {/* Acceptance summary */}
      {totalAccepted + totalRejected > 0 && (
        <div className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5" }}>
          <p className="text-xs font-bold mb-3" style={{ color: "#0B1E3D" }}>Acceptance Rate</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: "#F1F5F9" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.round((totalAccepted / (totalAccepted + totalRejected)) * 100)}%`,
                  background: "#16A34A",
                }}
              />
            </div>
            <span className="text-sm font-bold" style={{ color: "#16A34A" }}>
              {Math.round((totalAccepted / (totalAccepted + totalRejected)) * 100)}% accepted
            </span>
          </div>
          <div className="flex gap-6 mt-2 text-xs text-muted-foreground">
            <span><strong style={{ color: "#16A34A" }}>{totalAccepted}</strong> items accepted</span>
            <span><strong style={{ color: "#C8102E" }}>{totalRejected}</strong> items rejected</span>
          </div>
        </div>
      )}
    </div>
  )
}
