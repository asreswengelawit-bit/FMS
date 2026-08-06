import { useState } from "react"
import { Search, Plus, Phone, Edit2, Mail, LayoutGrid, List } from "lucide-react"
import { Button } from "@/features/shared/components/ui/button"
import { Input } from "@/features/shared/components/ui/input"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { SectionCard, DataTableHead } from "@/features/shared/components"
import { leads, stageConfig } from "./crm.data"

const stageOrder = ["New", "Qualified", "Proposal", "Negotiation", "Closed Won", "Lost"]

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? "#16A34A" : score >= 50 ? "#D97706" : "#C8102E"
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full" style={{ background: "#E8EDF5" }}>
        <div className="h-1.5 rounded-full" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="text-xs font-bold w-7 text-right" style={{ color }}>{score}</span>
    </div>
  )
}

export function CRMLeads() {
  const [search, setSearch]     = useState("")
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list")
  const [filterStage, setFilterStage] = useState("All")

  const filtered = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.contact.toLowerCase().includes(search.toLowerCase()) ||
      l.id.toLowerCase().includes(search.toLowerCase())
    const matchStage  = filterStage === "All" || l.stage === filterStage
    return matchSearch && matchStage
  })

  const pipeline = leads.filter(l => l.stage !== "Closed Won" && l.stage !== "Lost")
    .reduce((s, l) => s + l.value, 0)

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Leads",    value: String(leads.length), color: "#2563EB" },
          { label: "Active Leads",   value: String(leads.filter(l => l.stage !== "Closed Won" && l.stage !== "Lost").length), color: "#D97706" },
          { label: "Closed Won",     value: String(leads.filter(l => l.stage === "Closed Won").length), color: "#16A34A" },
          { label: "Pipeline Value", value: `ETB ${(pipeline / 1000000).toFixed(2)}M`, color: "#7C3AED" },
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
          <Input placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-9 text-sm" />
        </div>
        <select value={filterStage} onChange={e => setFilterStage(e.target.value)}
          className="h-9 text-sm border rounded-md px-3 bg-white" style={{ borderColor: "#E8EDF5", color: "#0B1E3D" }}>
          {["All", ...stageOrder].map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="flex border rounded-md overflow-hidden" style={{ borderColor: "#E8EDF5" }}>
          <button onClick={() => setViewMode("list")} className="px-3 h-9 flex items-center gap-1.5 text-xs font-semibold transition-colors"
            style={{ background: viewMode === "list" ? "#C8102E" : "white", color: viewMode === "list" ? "white" : "#64748B" }}>
            <List className="h-3.5 w-3.5" /> List
          </button>
          <button onClick={() => setViewMode("kanban")} className="px-3 h-9 flex items-center gap-1.5 text-xs font-semibold transition-colors"
            style={{ background: viewMode === "kanban" ? "#C8102E" : "white", color: viewMode === "kanban" ? "white" : "#64748B" }}>
            <LayoutGrid className="h-3.5 w-3.5" /> Kanban
          </button>
        </div>
        <Button className="h-9 gap-1.5 text-sm" style={{ background: "#C8102E", color: "#fff" }}>
          <Plus className="h-3.5 w-3.5" /> Add Lead
        </Button>
      </div>

      {/* List View */}
      {viewMode === "list" && (
        <SectionCard title={`Lead Pipeline (${filtered.length})`} noPadding>
          <div className="px-5 pb-4 pt-3 overflow-x-auto">
            <Table>
              <DataTableHead columns={["Lead ID", "Company", "Contact", "Source", "Stage", "Score", "Value (ETB)", "Date", "Assigned To", "Actions"]} />
              <TableBody>
                {filtered.map(lead => {
                  const sc = stageConfig[lead.stage] ?? { color: "#64748B", bg: "#F1F5F9" }
                  return (
                    <TableRow key={lead.id} className="hover:bg-slate-50">
                      <TableCell className="text-xs font-mono font-semibold" style={{ color: "#C8102E" }}>{lead.id}</TableCell>
                      <TableCell>
                        <p className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{lead.name}</p>
                        <p className="text-xs text-muted-foreground">{lead.email}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm" style={{ color: "#0B1E3D" }}>{lead.contact}</p>
                        <p className="text-xs text-muted-foreground font-mono">{lead.phone}</p>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#F0F4FF", color: "#0B1E3D" }}>{lead.source}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: sc.color, background: sc.bg }}>{lead.stage}</span>
                      </TableCell>
                      <TableCell style={{ minWidth: 100 }}>
                        <ScoreBar score={lead.score} />
                      </TableCell>
                      <TableCell className="text-sm font-bold" style={{ color: "#0B1E3D" }}>
                        ETB {lead.value.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{lead.date}</TableCell>
                      <TableCell className="text-xs font-semibold" style={{ color: "#2563EB" }}>{lead.assignedTo}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <button className="p-1 rounded hover:bg-slate-100" title="Call">
                            <Phone className="h-3.5 w-3.5" style={{ color: "#2563EB" }} />
                          </button>
                          <button className="p-1 rounded hover:bg-slate-100" title="Email">
                            <Mail className="h-3.5 w-3.5" style={{ color: "#16A34A" }} />
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
      )}

      {/* Kanban View */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {stageOrder.map(stage => {
            const sc = stageConfig[stage]
            const stageLeads = leads.filter(l => l.stage === stage &&
              (search === "" || l.name.toLowerCase().includes(search.toLowerCase()) || l.contact.toLowerCase().includes(search.toLowerCase()))
            )
            const stageValue = stageLeads.reduce((s, l) => s + l.value, 0)
            return (
              <div key={stage} className="rounded-xl border" style={{ borderColor: "#E8EDF5", background: "#F8FAFC" }}>
                <div className="p-3 border-b" style={{ borderColor: "#E8EDF5" }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold" style={{ color: sc.color }}>{stage}</span>
                    <span className="text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full text-white" style={{ background: sc.color, fontSize: 10 }}>{stageLeads.length}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">ETB {(stageValue / 1000).toFixed(0)}K</p>
                </div>
                <div className="p-2 space-y-2 min-h-[120px]">
                  {stageLeads.map(l => (
                    <div key={l.id} className="bg-white rounded-lg p-2.5 border shadow-sm cursor-pointer hover:shadow-md transition-shadow" style={{ borderColor: "#E8EDF5" }}>
                      <p className="text-xs font-bold" style={{ color: "#0B1E3D" }}>{l.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{l.contact}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-bold" style={{ color: "#C8102E" }}>ETB {(l.value / 1000).toFixed(0)}K</span>
                        <span className="text-xs text-muted-foreground">Score: {l.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
