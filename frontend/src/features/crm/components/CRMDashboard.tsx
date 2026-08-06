import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { TrendingUp, Users, Target, DollarSign, FileText, BarChart2, Activity } from "lucide-react"
import { SectionCard } from "@/features/shared/components"
import { salesTrendData, pipelineByStage, leads, customers, invoices, opportunities, salesOrders, stageConfig } from "./crm.data"

const wonLeads = leads.filter(l => l.stage === "Closed Won").length
const totalLeads = leads.length
const winRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0
const pipelineValue = opportunities
  .filter(o => o.stage !== "Won" && o.stage !== "Lost")
  .reduce((s, o) => s + o.value, 0)
const overdueCount = invoices.filter(i => i.status === "Overdue").length
const recentOrders = salesOrders.slice(0, 5)
const topCustomers = customers.filter(c => c.outstanding > 0).slice(0, 5)

export function CRMDashboard() {
  return (
    <div className="space-y-5">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Pipeline Value",    value: `ETB ${(pipelineValue / 1000000).toFixed(2)}M`, sub: `${opportunities.filter(o => o.stage !== "Won" && o.stage !== "Lost").length} open opportunities`, color: "#C8102E", bg: "#FFF1F3", icon: Target },
          { label: "Win Rate",          value: `${winRate}%`,        sub: `${wonLeads} of ${totalLeads} leads won`,       color: "#16A34A", bg: "#F0FDF4", icon: TrendingUp },
          { label: "Active Customers",  value: String(customers.filter(c => c.status === "Active").length), sub: `${customers.filter(c => c.status === "Prospect").length} prospects`, color: "#2563EB", bg: "#EEF2FF", icon: Users },
          { label: "Overdue Invoices",  value: String(overdueCount), sub: `ETB ${invoices.filter(i => i.status === "Overdue").reduce((s, i) => s + (i.amount - i.paid), 0).toLocaleString()} outstanding`, color: overdueCount > 0 ? "#C8102E" : "#16A34A", bg: overdueCount > 0 ? "#FFF1F3" : "#F0FDF4", icon: FileText },
        ].map((k, i) => {
          const Icon = k.icon
          return (
            <div key={i} className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5", borderLeftWidth: 3, borderLeftColor: k.color }}>
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: k.bg }}>
                  <Icon className="h-3.5 w-3.5" style={{ color: k.color }} />
                </div>
              </div>
              <p className="text-xl font-bold" style={{ color: k.color }}>{k.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{k.sub}</p>
            </div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectionCard title="Monthly Sales vs Target" icon={TrendingUp}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={salesTrendData}>
              <CartesianGrid key="crmdb-grid" strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis key="crmdb-xaxis" dataKey="month" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis key="crmdb-yaxis" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} />
              <Tooltip key="crmdb-tooltip" contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E8EDF5" }} formatter={(v: any) => [`ETB ${v.toLocaleString()}`, ""]} />
              <Legend key="crmdb-legend" wrapperStyle={{ fontSize: 11 }} />
              <Line key="crmdb-line-sales"  type="monotone" dataKey="sales"  stroke="#C8102E" strokeWidth={2} dot={{ r: 3 }} name="Sales" />
              <Line key="crmdb-line-target" type="monotone" dataKey="target" stroke="#2563EB" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="4 2" name="Target" />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Pipeline by Stage" icon={BarChart2}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={pipelineByStage} layout="vertical" margin={{ left: 16 }}>
              <CartesianGrid key="crmdb-bar-grid" strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis key="crmdb-bar-xaxis" type="number" tick={{ fontSize: 9, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis key="crmdb-bar-yaxis" dataKey="stage" type="category" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} width={80} />
              <Tooltip key="crmdb-bar-tooltip" contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E8EDF5" }} formatter={(v: any) => [`ETB ${v.toLocaleString()}`, ""]} />
              <Bar key="crmdb-bar-value" dataKey="value" fill="#C8102E" radius={[0, 4, 4, 0]} name="Pipeline Value (ETB)" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Orders */}
        <SectionCard title="Recent Sales Orders" icon={Activity}>
          <div className="space-y-2">
            {recentOrders.map(o => (
              <div key={o.id} className="flex items-center justify-between p-2.5 rounded-lg" style={{ background: "#F8FAFC" }}>
                <div>
                  <p className="text-xs font-mono font-semibold" style={{ color: "#2563EB" }}>{o.id}</p>
                  <p className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{o.customer}</p>
                  <p className="text-xs text-muted-foreground">{o.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: "#0B1E3D" }}>ETB {o.amount.toLocaleString()}</p>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ color: o.status === "Delivered" ? "#16A34A" : o.status === "Processing" ? "#D97706" : o.status === "Pending Approval" ? "#C8102E" : "#2563EB", background: o.status === "Delivered" ? "#F0FDF4" : o.status === "Processing" ? "#FFFBEB" : o.status === "Pending Approval" ? "#FFF1F3" : "#EEF2FF" }}>
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Top Customers by Outstanding */}
        <SectionCard title="Accounts Receivable Summary" icon={DollarSign}>
          <div className="space-y-2">
            {topCustomers.map(c => (
              <div key={c.id} className="p-2.5 rounded-lg" style={{ background: "#F8FAFC" }}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.type}</p>
                  </div>
                  <p className="text-sm font-bold" style={{ color: c.outstanding > 1000000 ? "#C8102E" : "#D97706" }}>
                    ETB {c.outstanding.toLocaleString()}
                  </p>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "#E8EDF5" }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${Math.min((c.outstanding / c.creditLimit) * 100, 100)}%`, background: c.outstanding / c.creditLimit > 0.7 ? "#C8102E" : "#D97706" }} />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{Math.round((c.outstanding / c.creditLimit) * 100)}% of credit limit used</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Opportunity Funnel */}
      <SectionCard title="Opportunity Stage Breakdown" icon={Target}>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {["New", "Qualified", "Proposal", "Negotiation", "Won", "Lost"].map(stage => {
            const opps = opportunities.filter(o => o.stage === stage)
            const cfg = stageConfig[stage === "Won" ? "Closed Won" : stage] ?? { color: "#64748B", bg: "#F1F5F9" }
            const totalVal = opps.reduce((s, o) => s + o.value, 0)
            return (
              <div key={stage} className="rounded-xl p-3 text-center border" style={{ background: cfg.bg, borderColor: cfg.color + "30" }}>
                <p className="text-xs font-semibold" style={{ color: cfg.color }}>{stage}</p>
                <p className="text-2xl font-bold mt-1" style={{ color: cfg.color }}>{opps.length}</p>
                <p className="text-xs font-medium mt-0.5" style={{ color: cfg.color }}>
                  {totalVal > 0 ? `ETB ${(totalVal / 1000000).toFixed(1)}M` : "—"}
                </p>
              </div>
            )
          })}
        </div>
      </SectionCard>
    </div>
  )
}
