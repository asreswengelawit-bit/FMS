import { useState } from "react"
import { Search, Plus, Edit2, Users, Filter, RefreshCw } from "lucide-react"
import { Button } from "@/features/shared/components/ui/button"
import { Input } from "@/features/shared/components/ui/input"
import { segments } from "./crm.data"

export function CRMSegments() {
  const [search, setSearch] = useState("")

  const filtered = segments.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Segments",      value: String(segments.length),                                      color: "#2563EB" },
          { label: "Total Customers",     value: String(segments.reduce((s, sg) => s + sg.customerCount, 0)), color: "#7C3AED" },
          { label: "Avg Segment Size",    value: String(Math.round(segments.reduce((s, sg) => s + sg.customerCount, 0) / (segments.length || 1))), color: "#D97706" },
          { label: "Active Campaigns",    value: "2",                                                           color: "#16A34A" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5", borderLeftWidth: 3, borderLeftColor: s.color }}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold mt-0.5" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search segments..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-9 text-sm" />
        </div>
        <Button className="h-9 gap-1.5 text-sm" style={{ background: "#C8102E", color: "#fff" }}>
          <Plus className="h-3.5 w-3.5" /> New Segment
        </Button>
      </div>

      {/* Segment Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((seg, idx) => {
          const colors = ["#C8102E", "#2563EB", "#7C3AED", "#16A34A", "#D97706"]
          const color = colors[idx % colors.length]
          return (
            <div key={seg.id} className="bg-white rounded-xl border shadow-sm p-5" style={{ borderColor: "#E8EDF5" }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + "15" }}>
                    <Users className="h-5 w-5" style={{ color }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "#0B1E3D" }}>{seg.name}</p>
                    <p className="text-xs font-mono" style={{ color: "#64748B" }}>{seg.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded hover:bg-slate-100" title="Refresh">
                    <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  <button className="p-1.5 rounded hover:bg-slate-100" title="Edit">
                    <Edit2 className="h-3.5 w-3.5" style={{ color: "#C8102E" }} />
                  </button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-3">{seg.description}</p>

              <div className="p-3 rounded-lg mb-3" style={{ background: "#F8FAFC", border: "1px solid #E8EDF5" }}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Filter className="h-3 w-3" style={{ color }} />
                  <span className="text-xs font-semibold" style={{ color: "#0B1E3D" }}>Filter Criteria</span>
                </div>
                <p className="text-xs font-mono" style={{ color: "#64748B" }}>{seg.criteria}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: color }}>
                    {seg.customerCount}
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "#0B1E3D" }}>Customers</p>
                    <p className="text-xs text-muted-foreground">in this segment</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Created by {seg.createdBy}</p>
                  <p className="text-xs text-muted-foreground">Updated {seg.lastUpdated}</p>
                </div>
              </div>
            </div>
          )
        })}

        {/* Add Segment Placeholder */}
        <button className="bg-white rounded-xl border-2 border-dashed p-5 flex flex-col items-center justify-center gap-2 transition-colors hover:border-[#C8102E] hover:bg-[#FFF1F3] group" style={{ borderColor: "#E8EDF5", minHeight: 180 }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-[#C8102E]" style={{ background: "#F1F5F9" }}>
            <Plus className="h-5 w-5 text-muted-foreground group-hover:text-white" />
          </div>
          <p className="text-sm font-semibold text-muted-foreground group-hover:text-[#C8102E]">Create New Segment</p>
          <p className="text-xs text-muted-foreground text-center">Define criteria to dynamically group customers for targeted campaigns</p>
        </button>
      </div>
    </div>
  )
}
