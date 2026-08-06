import { useState } from "react"
import { Button } from "@/features/shared/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { CheckCircle2, XCircle, Clock, Eye } from "lucide-react"
import { AlertBanner, SectionCard, DataTableHead } from "@/features/shared/components"
import { purchaseRequests, statusConfig } from "./prms.data"

function Badge({ label }: { label: string }) {
  const s = statusConfig[label] ?? { color: "#64748B", bg: "#F1F5F9" }
  return <span className="text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap" style={{ color: s.color, background: s.bg }}>{label}</span>
}

const daysPendingMap: Record<string, number> = {
  "PR-2025-042": 5,
  "PR-2025-043": 12,
  "PR-2025-044": 3,
  "PR-2025-046": 2,
  "PR-2025-047": 1,
}

type ApprovalStage = "HOD Approval" | "Finance Review"

const stageMap: Record<string, ApprovalStage> = {
  "PR-2025-043": "HOD Approval",
  "PR-2025-044": "HOD Approval",
  "PR-2025-046": "HOD Approval",
  "PR-2025-047": "HOD Approval",
  "PR-2025-042": "Finance Review",
}

export function PRMSApprovals() {
  const [selectedStage, setSelectedStage] = useState<"All" | ApprovalStage>("All")

  const awaiting = purchaseRequests.filter(pr =>
    pr.status === "Pending" || pr.status === "Finance Review"
  )
  const filtered = selectedStage === "All" ? awaiting : awaiting.filter(pr => stageMap[pr.id] === selectedStage)

  const totalValue = awaiting.reduce((s, pr) => s + pr.amount, 0)
  const oldest = Math.max(...awaiting.map(pr => daysPendingMap[pr.id] ?? 1))

  return (
    <div className="space-y-4">
      {awaiting.length > 0 && (
        <AlertBanner
          type="warning"
          message={`<strong>${awaiting.length} purchase requests</strong> are awaiting approval — total value ETB ${totalValue.toLocaleString()}. Oldest pending: <strong>${oldest} days</strong>.`}
        />
      )}

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "HOD Approval Pending",     value: String(awaiting.filter(pr => stageMap[pr.id] === "HOD Approval").length),     color: "#D97706" },
          { label: "Finance Review Pending",    value: String(awaiting.filter(pr => stageMap[pr.id] === "Finance Review").length),   color: "#7C3AED" },
          { label: "Total Value Pending",       value: `ETB ${(totalValue / 1000000).toFixed(2)}M`,                                  color: "#C8102E" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5", borderLeftWidth: 3, borderLeftColor: s.color }}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold mt-0.5" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["All", "HOD Approval", "Finance Review"] as const).map(stage => (
          <button key={stage} onClick={() => setSelectedStage(stage)}
            className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
            style={{ background: selectedStage === stage ? "#0B1E3D" : "#F1F5F9", color: selectedStage === stage ? "white" : "#64748B" }}>
            {stage}
          </button>
        ))}
      </div>

      <SectionCard title="Pending Approvals" noPadding count={filtered.length}>
        <Table>
          <DataTableHead columns={["PR ID", "Description", "Department", "Requested By", "Amount (ETB)", "Urgency", "Days Pending", "Approval Stage", "Actions"]} />
          <TableBody>
            {filtered.map(pr => {
              const days = daysPendingMap[pr.id] ?? 1
              const stage = stageMap[pr.id] ?? "HOD Approval"
              return (
                <TableRow key={pr.id} className="hover:bg-slate-50">
                  <TableCell className="font-mono text-xs font-bold" style={{ color: "#4F6FAF" }}>{pr.id}</TableCell>
                  <TableCell style={{ maxWidth: 200 }}>
                    <p className="text-sm font-semibold truncate" style={{ color: "#0B1E3D" }}>{pr.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{pr.justification}</p>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{pr.department}</TableCell>
                  <TableCell className="text-xs" style={{ color: "#0B1E3D" }}>{pr.requestedBy}</TableCell>
                  <TableCell className="text-sm font-bold" style={{ color: "#0B1E3D" }}>{pr.amount.toLocaleString()}</TableCell>
                  <TableCell><Badge label={pr.urgency} /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" style={{ color: days > 7 ? "#C8102E" : days > 3 ? "#D97706" : "#16A34A" }} />
                      <span className="text-xs font-bold" style={{ color: days > 7 ? "#C8102E" : days > 3 ? "#D97706" : "#16A34A" }}>
                        {days}d
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{
                      color: stage === "Finance Review" ? "#7C3AED" : "#D97706",
                      background: stage === "Finance Review" ? "#F5F3FF" : "#FFFBEB"
                    }}>{stage}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" className="h-7 gap-1 text-xs text-white" style={{ background: "#16A34A" }}>
                        <CheckCircle2 className="h-3 w-3" /> Approve
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" style={{ borderColor: "#C8102E", color: "#C8102E" }}>
                        <XCircle className="h-3 w-3" /> Reject
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  )
}
