import { useState } from "react"
import { Search, Plus, Edit2, BarChart2, TrendingUp } from "lucide-react"
import { Button } from "@/features/shared/components/ui/button"
import { Input } from "@/features/shared/components/ui/input"
import { SectionCard } from "@/features/shared/components"
import { campaigns, statusConfig } from "./crm.data"

export function CRMCampaigns() {
  const [search, setSearch]     = useState("")
  const [filterStatus, setFilterStatus] = useState("All")

  const filtered = campaigns.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === "All" || c.status === filterStatus
    return matchSearch && matchStatus
  })

  const totalBudget = campaigns.reduce((s, c) => s + c.budget, 0)
  const totalSpent  = campaigns.reduce((s, c) => s + c.spent, 0)
  const totalLeads  = campaigns.reduce((s, c) => s + c.leads, 0)
  const totalRev    = campaigns.reduce((s, c) => s + c.revenue, 0)

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Campaigns",   value: String(campaigns.length),                        color: "#2563EB" },
          { label: "Total Budget",      value: `ETB ${(totalBudget / 1000).toFixed(0)}K`,        color: "#7C3AED" },
          { label: "Total Spend",       value: `ETB ${(totalSpent / 1000).toFixed(0)}K`,          color: "#D97706" },
          { label: "Revenue Generated", value: `ETB ${(totalRev / 1000000).toFixed(2)}M`,         color: "#16A34A" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5", borderLeftWidth: 3, borderLeftColor: s.color }}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold mt-0.5" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Leads Generated",   value: String(totalLeads),                              color: "#C8102E" },
          { label: "Total Conversions", value: String(campaigns.reduce((s, c) => s + c.conversions, 0)), color: "#16A34A" },
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
          <Input placeholder="Search campaigns..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-9 text-sm" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="h-9 text-sm border rounded-md px-3 bg-white" style={{ borderColor: "#E8EDF5", color: "#0B1E3D" }}>
          {["All", "Planned", "Running", "Paused", "Completed"].map(s => <option key={s}>{s}</option>)}
        </select>
        <Button className="h-9 gap-1.5 text-sm" style={{ background: "#C8102E", color: "#fff" }}>
          <Plus className="h-3.5 w-3.5" /> New Campaign
        </Button>
      </div>

      {/* Campaign Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(c => {
          const sc = statusConfig[c.status] ?? { color: "#64748B", bg: "#F1F5F9" }
          const budgetUsed = c.budget > 0 ? (c.spent / c.budget) * 100 : 0
          const roi = c.spent > 0 ? ((c.revenue - c.spent) / c.spent * 100) : 0
          const conversionRate = c.leads > 0 ? Math.round((c.conversions / c.leads) * 100) : 0
          return (
            <div key={c.id} className="bg-white rounded-xl border shadow-sm p-5" style={{ borderColor: "#E8EDF5" }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-semibold" style={{ color: "#2563EB" }}>{c.id}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: sc.color, background: sc.bg }}>{c.status}</span>
                  </div>
                  <p className="text-sm font-bold" style={{ color: "#0B1E3D" }}>{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.type} · {c.targetSegment}</p>
                </div>
                <button className="p-1 rounded hover:bg-slate-100">
                  <Edit2 className="h-3.5 w-3.5" style={{ color: "#C8102E" }} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Leads</p>
                  <p className="text-lg font-bold" style={{ color: "#C8102E" }}>{c.leads}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Conversions</p>
                  <p className="text-lg font-bold" style={{ color: "#16A34A" }}>{c.conversions}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Conv. Rate</p>
                  <p className="text-lg font-bold" style={{ color: conversionRate >= 25 ? "#16A34A" : "#D97706" }}>{conversionRate}%</p>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Budget Utilization</span>
                    <span className="text-xs font-bold" style={{ color: budgetUsed > 90 ? "#C8102E" : "#0B1E3D" }}>
                      ETB {c.spent.toLocaleString()} / {c.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "#E8EDF5" }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${Math.min(budgetUsed, 100)}%`, background: budgetUsed > 90 ? "#C8102E" : "#4F6FAF" }} />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: "#F1F5F9" }}>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" style={{ color: roi >= 0 ? "#16A34A" : "#C8102E" }} />
                  <span className="text-xs font-semibold" style={{ color: roi >= 0 ? "#16A34A" : "#C8102E" }}>
                    ROI: {c.spent > 0 ? `${roi.toFixed(0)}%` : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BarChart2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {c.startDate} → {c.endDate}
                  </span>
                </div>
              </div>

              <div className="mt-2">
                <p className="text-xs text-muted-foreground">
                  Revenue: <span className="font-semibold" style={{ color: "#16A34A" }}>{c.revenue > 0 ? `ETB ${c.revenue.toLocaleString()}` : "—"}</span>
                  {" · "} Assigned: <span className="font-semibold" style={{ color: "#2563EB" }}>{c.assignedTo}</span>
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
