import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { Button } from "@/features/shared/components/ui/button"
import { PieChart, TrendingDown, Plus, Lock, CheckCircle2 } from "lucide-react"
import { SectionCard, DataTableHead, AlertBanner } from "@/features/shared/components"
import { fmsBudgets, statusConfig } from "./fms.data"

function StatusBadge({ status }: { status: string }) {
  const s = statusConfig[status] ?? { color: "#64748B", bg: "#F1F5F9" }
  return <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: s.color, background: s.bg }}>{status}</span>
}

export function FMSBudget() {
  const totalAllocated = fmsBudgets.reduce((s, b) => s + b.allocated, 0)
  const totalActual    = fmsBudgets.reduce((s, b) => s + b.actual, 0)
  const totalRemaining = totalAllocated - totalActual
  const overallPct     = Math.round((totalActual / totalAllocated) * 100)

  return (
    <div className="space-y-5">
      <AlertBanner
        type="info"
        message="<strong>Budget Workflow:</strong> Draft → Submitted → Approved → Locked (version locked after Finance Manager/CFO approval). Budget Preparer creates; Finance Manager approves."
      />

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Budget Allocated", value: `ETB ${(totalAllocated / 1000000).toFixed(2)}M`, color: "#0B1E3D" },
          { label: "Spent to Date",          value: `ETB ${(totalActual / 1000000).toFixed(2)}M`,    color: "#D97706" },
          { label: "Remaining Budget",       value: `ETB ${(totalRemaining / 1000000).toFixed(2)}M`, color: "#16A34A" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5", borderLeftWidth: 3, borderLeftColor: color }}>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-xl font-bold mt-0.5" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      <SectionCard
        title="Budget Utilization by Category — FY2025"
        icon={PieChart}
        noPadding
        action={
          <Button className="text-white gap-1.5 text-xs h-8" style={{ background: "#4F6FAF" }}>
            <Plus className="h-3.5 w-3.5" /> New Budget Line
          </Button>
        }
      >
        <div className="px-5 pb-4 pt-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted-foreground">Overall utilization</p>
            <span className="text-xs font-bold" style={{ color: overallPct > 90 ? "#C8102E" : overallPct > 70 ? "#D97706" : "#16A34A" }}>
              {overallPct}%
            </span>
          </div>
          <div className="h-2.5 rounded-full w-full" style={{ background: "#F1F5F9" }}>
            <div className="h-2.5 rounded-full transition-all" style={{
              width: `${overallPct}%`,
              background: overallPct > 90 ? "#C8102E" : overallPct > 70 ? "#D97706" : "#4F6FAF"
            }} />
          </div>
        </div>
        <Table>
          <DataTableHead columns={["Budget Category", "Account", "Fiscal Year", "Allocated (ETB)", "Actual Spend (ETB)", "Remaining (ETB)", "Utilization", "Status", "Actions"]} />
          <TableBody>
            {fmsBudgets.map(b => {
              const pct = b.allocated > 0 ? Math.round((b.actual / b.allocated) * 100) : 0
              const remaining = b.allocated - b.actual
              const barColor = pct > 90 ? "#C8102E" : pct > 70 ? "#D97706" : "#16A34A"
              return (
                <TableRow key={b.category} className="hover:bg-slate-50">
                  <TableCell className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{b.category}</TableCell>
                  <TableCell className="font-mono text-xs" style={{ color: "#4F6FAF" }}>{b.account}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{b.fiscalYear}</TableCell>
                  <TableCell className="text-sm font-bold" style={{ color: "#0B1E3D" }}>{b.allocated.toLocaleString()}</TableCell>
                  <TableCell className="text-sm font-bold" style={{ color: "#D97706" }}>{b.actual > 0 ? b.actual.toLocaleString() : "—"}</TableCell>
                  <TableCell className="text-sm font-bold" style={{ color: remaining > 0 ? "#16A34A" : "#C8102E" }}>
                    {remaining.toLocaleString()}
                  </TableCell>
                  <TableCell style={{ minWidth: 140 }}>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full" style={{ background: "#F1F5F9" }}>
                        <div className="h-2 rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: barColor }} />
                      </div>
                      <span className="text-xs font-bold w-8 text-right" style={{ color: barColor }}>{pct}%</span>
                    </div>
                  </TableCell>
                  <TableCell><StatusBadge status={b.status} /></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {b.status === "Approved" && (
                        <Button size="sm" className="h-7 text-xs gap-1 text-white" style={{ background: "#7C3AED" }}>
                          <Lock className="h-3 w-3" /> Lock
                        </Button>
                      )}
                      {b.status === "Locked" && (
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                          <CheckCircle2 className="h-3 w-3" /> View
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="h-7 text-xs">Edit</Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </SectionCard>

      <div className="bg-white rounded-xl border shadow-sm p-5" style={{ borderColor: "#E8EDF5" }}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="h-4 w-4" style={{ color: "#4F6FAF" }} />
          <p className="text-sm font-bold" style={{ color: "#0B1E3D" }}>Budget Variance Summary</p>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {fmsBudgets.map(b => {
            const pct = b.allocated > 0 ? Math.round((b.actual / b.allocated) * 100) : 0
            const barColor = pct > 90 ? "#C8102E" : pct > 70 ? "#D97706" : "#4F6FAF"
            return (
              <div key={b.category} className="text-center">
                <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
                  <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F1F5F9" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke={barColor} strokeWidth="3"
                      strokeDasharray={`${pct} ${100 - pct}`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute text-xs font-bold" style={{ color: barColor }}>{pct}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-tight">{b.category.split(" ")[0]}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
