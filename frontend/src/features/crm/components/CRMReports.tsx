import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts"
import { Button } from "@/features/shared/components/ui/button"
import { BarChart2, TrendingUp, Download, Target } from "lucide-react"
import { SectionCard } from "@/features/shared/components"
import { salesTrendData, leads, stageConfig, opportunities, invoices, payments } from "./crm.data"

const stageOrder = ["New", "Qualified", "Proposal", "Negotiation", "Closed Won", "Lost"]
const stageCounts = stageOrder.map(stage => ({
  stage,
  count: leads.filter(l => l.stage === stage).length,
  value: leads.filter(l => l.stage === stage).reduce((s, l) => s + l.value, 0),
}))

const totalRevYTD    = salesTrendData.reduce((s, d) => s + d.sales, 0)
const totalTarget    = salesTrendData.reduce((s, d) => s + d.target, 0)
const vsTarget       = ((totalRevYTD - totalTarget) / totalTarget * 100).toFixed(1)
const winRate        = leads.length > 0 ? Math.round((leads.filter(l => l.stage === "Closed Won").length / leads.length) * 100) : 0
const collected      = payments.filter(p => p.status === "Completed").reduce((s, p) => s + p.amount, 0)

export function CRMReports() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>Sales Performance — July 2025</p>
        <Button variant="outline" className="gap-1.5 text-xs h-9" style={{ borderColor: "#C8102E", color: "#C8102E" }}>
          <Download className="h-3.5 w-3.5" /> Export PDF
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Revenue YTD",   value: `ETB ${(totalRevYTD / 1000000).toFixed(2)}M`, color: "#16A34A" },
          { label: "vs Target",           value: `${Number(vsTarget) >= 0 ? "+" : ""}${vsTarget}%`, color: Number(vsTarget) >= 0 ? "#16A34A" : "#C8102E" },
          { label: "Win Rate",            value: `${winRate}%`,                                   color: "#7C3AED" },
          { label: "Payments Collected",  value: `ETB ${(collected / 1000000).toFixed(2)}M`,      color: "#2563EB" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5", borderLeftWidth: 3, borderLeftColor: s.color }}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold mt-0.5" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectionCard title="Monthly Sales vs Target" icon={TrendingUp}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={salesTrendData}>
              <CartesianGrid key="rpt-line-grid" strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis key="rpt-line-xaxis" dataKey="month" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis key="rpt-line-yaxis" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} />
              <Tooltip key="rpt-line-tooltip" contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E8EDF5" }} formatter={(v: any) => [`ETB ${v.toLocaleString()}`, ""]} />
              <Legend key="rpt-line-legend" wrapperStyle={{ fontSize: 11 }} />
              <Line key="rpt-line-sales"  type="monotone" dataKey="sales"  stroke="#C8102E" strokeWidth={2} dot={{ r: 3 }} name="Sales" />
              <Line key="rpt-line-target" type="monotone" dataKey="target" stroke="#2563EB" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="4 2" name="Target" />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Pipeline by Stage" icon={BarChart2}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stageCounts} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid key="rpt-bar-grid" strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis key="rpt-bar-xaxis" type="number" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis key="rpt-bar-yaxis" dataKey="stage" type="category" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <Tooltip key="rpt-bar-tooltip" contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E8EDF5" }} />
              <Bar key="rpt-bar-count" dataKey="count" fill="#C8102E" radius={[0, 4, 4, 0]} name="Leads" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Opportunity Forecasting */}
      <SectionCard title="Opportunity Forecast by Stage" icon={Target}>
        <div className="grid grid-cols-3 gap-4">
          {["Negotiation", "Proposal", "Qualified"].map(stage => {
            const opps = opportunities.filter(o => o.stage === stage)
            const total = opps.reduce((s, o) => s + o.value, 0)
            const weighted = opps.reduce((s, o) => s + (o.value * o.probability / 100), 0)
            const cfg = stageConfig[stage]
            return (
              <div key={stage} className="rounded-xl p-4 border" style={{ background: cfg.bg, borderColor: cfg.color + "30" }}>
                <p className="text-xs font-bold mb-2" style={{ color: cfg.color }}>{stage}</p>
                <p className="text-sm font-bold" style={{ color: "#0B1E3D" }}>ETB {(total/1000000).toFixed(2)}M</p>
                <p className="text-xs text-muted-foreground">Weighted: ETB {(weighted/1000000).toFixed(2)}M</p>
                <p className="text-xs text-muted-foreground">{opps.length} opportunit{opps.length !== 1 ? "ies" : "y"}</p>
              </div>
            )
          })}
        </div>
      </SectionCard>
    </div>
  )
}
