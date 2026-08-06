import { useState } from "react"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { Button } from "@/features/shared/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { ClipboardList, Star, Trophy, CheckCircle2 } from "lucide-react"
import { SearchFilter, SectionCard, DataTableHead, AlertBanner } from "@/features/shared/components"
import { quotations, statusConfig } from "./prms.data"

function StatusBadge({ status }: { status: string }) {
  const s = statusConfig[status] ?? { color: "#64748B", bg: "#F1F5F9" }
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: s.color, background: s.bg }}>
      {status}
    </span>
  )
}

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="text-xs font-semibold w-6 text-right" style={{ color }}>{score}</span>
    </div>
  )
}

export function PRMSQuotations() {
  const [search, setSearch]         = useState("")
  const [statusFilter, setStatus]   = useState("All")
  const [selectedRfq, setSelectedRfq] = useState("All")
  const statuses  = ["All", "Awarded", "Not Awarded", "Pending Evaluation"]
  const rfqRefs   = ["All", ...Array.from(new Set(quotations.map(q => q.rfqRef)))]

  const filtered = quotations.filter(q => {
    const matchSearch = q.id.toLowerCase().includes(search.toLowerCase())
      || q.supplier.toLowerCase().includes(search.toLowerCase())
      || q.rfqRef.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "All" || q.status === statusFilter
    const matchRfq    = selectedRfq === "All" || q.rfqRef === selectedRfq
    return matchSearch && matchStatus && matchRfq
  })

  const awarded = quotations.filter(q => q.status === "Awarded")
  const pending = quotations.filter(q => q.status === "Pending Evaluation")

  // Comparison chart data for selected RFQ
  const rfqForChart = selectedRfq !== "All" ? selectedRfq : "RFQ-2025-011"
  const comparisonData = quotations
    .filter(q => q.rfqRef === rfqForChart)
    .map(q => ({
      supplier: q.supplier.split(" ")[0],
      Technical: q.technicalScore,
      Commercial: q.commercialScore,
      Total: q.totalScore,
      amount: q.totalAmount,
    }))

  return (
    <div className="space-y-4">
      <AlertBanner
        type="info"
        message="<strong>Evaluation Process:</strong> Each quotation undergoes Technical Evaluation (specification compliance) then Commercial Evaluation (price, payment terms, TCO). Winner selected by weighted total score."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Quotations",   value: String(quotations.length), color: "#0B1E3D", icon: ClipboardList },
          { label: "Awarded",            value: String(awarded.length),    color: "#16A34A", icon: Trophy       },
          { label: "Pending Evaluation", value: String(pending.length),    color: "#D97706", icon: Star         },
          { label: "Avg. Total Score",   value: `${Math.round(quotations.reduce((s, q) => s + q.totalScore, 0) / quotations.length)}%`, color: "#2563EB", icon: CheckCircle2 },
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

      {/* Comparison matrix chart */}
      {comparisonData.length > 0 && (
        <div className="bg-white rounded-xl border shadow-sm p-5" style={{ borderColor: "#E8EDF5" }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold" style={{ color: "#0B1E3D" }}>
              Supplier Comparison Matrix — {rfqForChart}
            </p>
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm inline-block" style={{ background: "#2563EB" }} /> Technical</span>
              <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm inline-block" style={{ background: "#D97706" }} /> Commercial</span>
              <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm inline-block" style={{ background: "#16A34A" }} /> Total</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={comparisonData} barGap={2}>
              <XAxis dataKey="supplier" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v, name) => [`${v}%`, name]} />
              <Bar dataKey="Technical"   fill="#2563EB" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Commercial"  fill="#D97706" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Total"       fill="#16A34A" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <SearchFilter value={search} onChange={setSearch} placeholder="Search by quotation ID, supplier or RFQ…">
        <div className="flex gap-1">
          {statuses.map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
              style={{ background: statusFilter === s ? "#0B1E3D" : "#F1F5F9", color: statusFilter === s ? "white" : "#64748B" }}>
              {s}
            </button>
          ))}
        </div>
        <select
          value={selectedRfq} onChange={e => setSelectedRfq(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-lg border font-medium h-9"
          style={{ borderColor: "#E8EDF5", color: "#0B1E3D" }}>
          {rfqRefs.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </SearchFilter>

      <SectionCard title="Quotation Comparison" icon={ClipboardList} noPadding count={filtered.length}>
        <Table>
          <DataTableHead columns={["QT ID", "RFQ Ref", "Supplier", "Submitted", "Amount (ETB)", "Lead Time", "Technical %", "Commercial %", "Total Score", "Payment Terms", "Warranty", "Status", "Actions"]} />
          <TableBody>
            {filtered.map(qt => (
              <TableRow key={qt.id} className="hover:bg-slate-50">
                <TableCell className="font-mono text-xs font-bold" style={{ color: "#1D4ED8" }}>{qt.id}</TableCell>
                <TableCell className="font-mono text-xs" style={{ color: "#4F6FAF" }}>{qt.rfqRef}</TableCell>
                <TableCell>
                  <p className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{qt.supplier}</p>
                  {qt.status === "Awarded" && (
                    <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#16A34A" }}>
                      <Trophy className="h-3 w-3" /> Winner
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{qt.submittedDate}</TableCell>
                <TableCell className="text-sm font-bold" style={{ color: "#0B1E3D" }}>{qt.totalAmount.toLocaleString()}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{qt.leadTimeDays} days</TableCell>
                <TableCell className="min-w-24"><ScoreBar score={qt.technicalScore}   color="#2563EB" /></TableCell>
                <TableCell className="min-w-24"><ScoreBar score={qt.commercialScore}  color="#D97706" /></TableCell>
                <TableCell>
                  <span className="text-sm font-bold" style={{ color: qt.totalScore >= 85 ? "#16A34A" : "#D97706" }}>
                    {qt.totalScore}%
                  </span>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{qt.paymentTerms}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{qt.warranty}</TableCell>
                <TableCell><StatusBadge status={qt.status} /></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {qt.status === "Pending Evaluation" && (
                      <Button size="sm" className="h-7 text-xs text-white gap-1" style={{ background: "#16A34A" }}>
                        <Trophy className="h-3 w-3" /> Award
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
