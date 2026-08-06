import { useState } from "react"
import { Button } from "@/features/shared/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { BookMarked, Plus, CheckCircle2, Send, RotateCcw } from "lucide-react"
import { SectionCard, DataTableHead, AlertBanner, SearchFilter } from "@/features/shared/components"
import { journalEntries, statusConfig } from "./fms.data"

function StatusBadge({ status }: { status: string }) {
  const s = statusConfig[status] ?? { color: "#64748B", bg: "#F1F5F9" }
  return <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: s.color, background: s.bg }}>{status}</span>
}

const sourceColors: Record<string, string> = {
  MANUAL: "#4F6FAF", AP: "#D97706", AR: "#16A34A", PAYROLL: "#7C3AED", SYSTEM: "#64748B",
}

export function FMSJournals() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const statuses = ["All", "Draft", "Submitted", "Posted"]

  const drafts    = journalEntries.filter(j => j.status === "Draft").length
  const submitted = journalEntries.filter(j => j.status === "Submitted").length

  const filtered = journalEntries.filter(j => {
    const matchSearch = j.id.toLowerCase().includes(search.toLowerCase())
      || j.description.toLowerCase().includes(search.toLowerCase())
      || j.reference.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "All" || j.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-4">
      {(drafts > 0 || submitted > 0) && (
        <AlertBanner
          type="warning"
          message={`<strong>${drafts} draft</strong> and <strong>${submitted} submitted</strong> journal entr${drafts + submitted > 1 ? "ies" : "y"} pending. Maker: Accountant submits → Checker: Finance Manager approves → Posts to ledger.`}
        />
      )}

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Draft",                            value: drafts,                                                            color: "#64748B" },
          { label: "Submitted (Awaiting Approval)",    value: submitted,                                                         color: "#2563EB" },
          { label: "Posted",                           value: journalEntries.filter(j => j.status === "Posted").length,          color: "#16A34A" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5", borderLeftWidth: 3, borderLeftColor: color }}>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-xl font-bold mt-0.5" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Lifecycle banner */}
      <div className="rounded-xl p-4" style={{ background: "linear-gradient(135deg,#0B1E3D,#162D54)" }}>
        <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#60A5FA" }}>Journal Lifecycle — Double-Entry Control</p>
        <div className="flex items-center overflow-x-auto">
          {["Draft", "Submitted", "Approved", "Posted", "Reversed"].map((step, i, arr) => (
            <div key={step} className="flex items-center flex-shrink-0">
              <div className="text-center px-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white mx-auto mb-1"
                  style={{ background: i <= 2 ? "#16A34A" : i === 3 ? "#D97706" : "rgba(255,255,255,0.15)" }}>
                  {i + 1}
                </div>
                <p className="text-white text-xs font-semibold whitespace-nowrap">{step}</p>
              </div>
              {i < arr.length - 1 && <div className="h-px w-4 flex-shrink-0" style={{ background: "rgba(255,255,255,0.2)" }} />}
            </div>
          ))}
        </div>
      </div>

      <SearchFilter value={search} onChange={setSearch} placeholder="Search by journal ID, reference, or description…">
        <div className="flex gap-1">
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
              style={{ background: statusFilter === s ? "#0B1E3D" : "#F1F5F9", color: statusFilter === s ? "white" : "#64748B" }}>
              {s}
            </button>
          ))}
        </div>
        <Button className="text-white gap-1.5 text-xs h-9" style={{ background: "#4F6FAF" }}>
          <Plus className="h-3.5 w-3.5" /> New Journal
        </Button>
      </SearchFilter>

      <SectionCard title="General Ledger — Journal Entries" icon={BookMarked} noPadding count={filtered.length}>
        <Table>
          <DataTableHead columns={["Entry ID", "Date", "Period", "Source", "Reference", "Description", "Debit (ETB)", "Credit (ETB)", "Status", "Approved By", "Actions"]} />
          <TableBody>
            {filtered.map(je => {
              const debit  = je.lines.filter(l => l.type === "Debit").reduce((s, l) => s + l.amount, 0)
              const credit = je.lines.filter(l => l.type === "Credit").reduce((s, l) => s + l.amount, 0)
              const balanced = debit === credit
              return (
                <TableRow key={je.id} className="hover:bg-slate-50">
                  <TableCell className="font-mono text-xs font-bold" style={{ color: "#4F6FAF" }}>{je.id}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{je.date}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{je.period}</TableCell>
                  <TableCell>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: (sourceColors[je.sourceType] ?? "#64748B") + "20", color: sourceColors[je.sourceType] ?? "#64748B" }}>
                      {je.sourceType}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs" style={{ color: "#0B1E3D" }}>{je.reference}</TableCell>
                  <TableCell className="text-sm" style={{ color: "#0B1E3D", maxWidth: 200 }}>
                    <p className="truncate font-medium">{je.description}</p>
                    <div className="mt-0.5 space-y-0.5">
                      {je.lines.map((l, i) => (
                        <p key={i} className="text-xs text-muted-foreground flex gap-1">
                          <span className="font-mono font-bold w-5" style={{ color: l.type === "Debit" ? "#2563EB" : "#C8102E" }}>
                            {l.type === "Debit" ? "Dr" : "Cr"}
                          </span>
                          <span className="truncate">{l.account}</span>
                        </p>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-bold" style={{ color: "#2563EB" }}>{debit.toLocaleString()}</TableCell>
                  <TableCell>
                    <div>
                      <span className="text-sm font-bold" style={{ color: "#C8102E" }}>{credit.toLocaleString()}</span>
                      {!balanced && <span className="text-[10px] text-red-500 block">Unbalanced!</span>}
                    </div>
                  </TableCell>
                  <TableCell><StatusBadge status={je.status} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{je.approvedBy || "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {je.status === "Draft" && (
                        <Button size="sm" className="h-7 text-xs text-white gap-1" style={{ background: "#2563EB" }}>
                          <Send className="h-3 w-3" /> Submit
                        </Button>
                      )}
                      {je.status === "Submitted" && (
                        <Button size="sm" className="h-7 text-xs text-white gap-1" style={{ background: "#16A34A" }}>
                          <CheckCircle2 className="h-3.5 w-3.5" /> Approve & Post
                        </Button>
                      )}
                      {je.status === "Posted" && (
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                          <RotateCcw className="h-3 w-3" /> Reverse
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="h-7 text-xs">View</Button>
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
