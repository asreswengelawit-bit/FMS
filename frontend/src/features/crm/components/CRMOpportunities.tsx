import { useState } from "react"
import { Search, Plus, Edit2, TrendingUp } from "lucide-react"
import { Button } from "@/features/shared/components/ui/button"
import { Input } from "@/features/shared/components/ui/input"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { SectionCard, DataTableHead } from "@/features/shared/components"
import { opportunities, stageConfig } from "./crm.data"

export function CRMOpportunities() {
  const [search, setSearch] = useState("")
  const [filterStage, setFilterStage] = useState("All")

  const filtered = opportunities.filter(o => {
    const matchSearch = o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())
    const matchStage  = filterStage === "All" || o.stage === filterStage
    return matchSearch && matchStage
  })

  const openOpps  = opportunities.filter(o => o.stage !== "Won" && o.stage !== "Lost")
  const weighted  = openOpps.reduce((s, o) => s + (o.value * o.probability / 100), 0)
  const totalPipe = openOpps.reduce((s, o) => s + o.value, 0)
  const wonValue  = opportunities.filter(o => o.stage === "Won").reduce((s, o) => s + o.value, 0)

  const stages = ["All", "New", "Qualified", "Proposal", "Negotiation", "Won", "Lost"]

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Open Opportunities", value: String(openOpps.length),                                   color: "#2563EB" },
          { label: "Pipeline Total",      value: `ETB ${(totalPipe / 1000000).toFixed(2)}M`,               color: "#7C3AED" },
          { label: "Weighted Forecast",   value: `ETB ${(weighted / 1000000).toFixed(2)}M`,                color: "#D97706" },
          { label: "Won This Period",      value: `ETB ${(wonValue / 1000000).toFixed(2)}M`,               color: "#16A34A" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5", borderLeftWidth: 3, borderLeftColor: s.color }}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold mt-0.5" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search opportunities..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-9 text-sm" />
        </div>
        <select value={filterStage} onChange={e => setFilterStage(e.target.value)}
          className="h-9 text-sm border rounded-md px-3 bg-white" style={{ borderColor: "#E8EDF5", color: "#0B1E3D" }}>
          {stages.map(s => <option key={s}>{s}</option>)}
        </select>
        <Button className="h-9 gap-1.5 text-sm" style={{ background: "#C8102E", color: "#fff" }}>
          <Plus className="h-3.5 w-3.5" /> New Opportunity
        </Button>
      </div>

      {/* Table */}
      <SectionCard title={`Opportunities (${filtered.length})`} noPadding>
        <div className="px-5 pb-4 pt-3 overflow-x-auto">
          <Table>
            <DataTableHead columns={["ID", "Opportunity", "Customer", "Stage", "Value", "Probability", "Weighted", "Expected Close", "Competitor", "Assigned To", "Actions"]} />
            <TableBody>
              {filtered.map(o => {
                const sc = stageConfig[o.stage === "Won" ? "Closed Won" : o.stage] ?? { color: "#64748B", bg: "#F1F5F9" }
                const probColor = o.probability >= 75 ? "#16A34A" : o.probability >= 40 ? "#D97706" : "#C8102E"
                return (
                  <TableRow key={o.id} className="hover:bg-slate-50">
                    <TableCell className="text-xs font-mono font-semibold" style={{ color: "#2563EB" }}>{o.id}</TableCell>
                    <TableCell>
                      <p className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{o.name}</p>
                      <p className="text-xs text-muted-foreground">{o.notes.slice(0, 45)}{o.notes.length > 45 ? "…" : ""}</p>
                    </TableCell>
                    <TableCell className="text-sm" style={{ color: "#0B1E3D" }}>{o.customer}</TableCell>
                    <TableCell>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: sc.color, background: sc.bg }}>{o.stage}</span>
                    </TableCell>
                    <TableCell className="text-sm font-bold" style={{ color: "#0B1E3D" }}>
                      ETB {o.value.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full" style={{ background: "#E8EDF5" }}>
                          <div className="h-1.5 rounded-full" style={{ width: `${o.probability}%`, background: probColor }} />
                        </div>
                        <span className="text-xs font-bold w-8" style={{ color: probColor }}>{o.probability}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-semibold" style={{ color: "#7C3AED" }}>
                      ETB {Math.round(o.value * o.probability / 100).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{o.expectedClose}</TableCell>
                    <TableCell>
                      {o.competitor !== "None" && o.competitor !== "Unknown" ? (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#FFF1F3", color: "#C8102E" }}>{o.competitor}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">{o.competitor}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs font-semibold" style={{ color: "#2563EB" }}>{o.assignedTo}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <button className="p-1 rounded hover:bg-slate-100" title="View forecast">
                          <TrendingUp className="h-3.5 w-3.5" style={{ color: "#7C3AED" }} />
                        </button>
                        <button className="p-1 rounded hover:bg-slate-100" title="Edit">
                          <Edit2 className="h-3.5 w-3.5" style={{ color: "#C8102E" }} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  )
}
