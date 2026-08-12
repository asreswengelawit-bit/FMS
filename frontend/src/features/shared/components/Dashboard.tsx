import { Card, CardContent, CardHeader, CardTitle } from "@/features/shared/components/ui/card"
import { Button } from "@/features/shared/components/ui/button"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  LineChart, Line, Tooltip, Legend, AreaChart, Area
} from "recharts"
import {
  Users, ShoppingCart, Warehouse, Handshake, Landmark,
  ArrowUpRight, ArrowDownRight, AlertTriangle, Clock, CheckCircle2,
  TrendingUp, Eye
} from "lucide-react"

const revenueData = [
  { month: "Jan", revenue: 320000, expenses: 210000 },
  { month: "Feb", revenue: 380000, expenses: 240000 },
  { month: "Mar", revenue: 350000, expenses: 225000 },
  { month: "Apr", revenue: 420000, expenses: 270000 },
  { month: "May", revenue: 460000, expenses: 290000 },
  { month: "Jun", revenue: 440000, expenses: 280000 },
  { month: "Jul", revenue: 510000, expenses: 310000 },
]

const stockMovement = [
  { month: "Jan", receipt: 240, issue: 180 },
  { month: "Feb", receipt: 310, issue: 220 },
  { month: "Mar", receipt: 280, issue: 200 },
  { month: "Apr", receipt: 350, issue: 260 },
  { month: "May", receipt: 390, issue: 300 },
  { month: "Jun", receipt: 360, issue: 280 },
  { month: "Jul", receipt: 410, issue: 320 },
]

const moduleKPIs = [
  {
    module: "HRM",
    label: "Total Employees",
    value: "284",
    sub: "12 on leave today",
    change: "+3.2%",
    positive: true,
    icon: Users,
    color: "#2563EB",
    bg: "#EEF2FF",
  },
  {
    module: "PRMS",
    label: "Purchase Requests",
    value: "47",
    sub: "5 pending approval",
    change: "+12.5%",
    positive: true,
    icon: ShoppingCart,
    color: "#C8102E",
    bg: "#FFF1F3",
  },
  {
    module: "MMS",
    label: "Stock Items",
    value: "1,842",
    sub: "23 below reorder level",
    change: "-1.8%",
    positive: false,
    icon: Warehouse,
    color: "#0B1E3D",
    bg: "#F0F4FF",
  },
  {
    module: "CRM",
    label: "Active Sales Orders",
    value: "138",
    sub: "ETB 4.2M pipeline",
    change: "+8.7%",
    positive: true,
    icon: Handshake,
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    module: "FMS",
    label: "Accounts Receivable",
    value: "ETB 2.8M",
    sub: "14 overdue invoices",
    change: "+5.1%",
    positive: true,
    icon: Landmark,
    color: "#16A34A",
    bg: "#F0FDF4",
  },
]

const pendingApprovals = [
  { id: "PR-2025-047", type: "Purchase Request", requester: "Procurement Dept", amount: "ETB 45,000", urgency: "High", module: "PRMS" },
  { id: "LV-2025-118", type: "Leave Request", requester: "Abebe Girma", amount: "5 Days", urgency: "Normal", module: "HRM" },
  { id: "PO-2025-033", type: "Purchase Order", requester: "Store Dept", amount: "ETB 128,000", urgency: "High", module: "PRMS" },
  { id: "JE-2025-221", type: "Journal Entry", requester: "Finance Dept", amount: "ETB 78,500", urgency: "Normal", module: "FMS" },
  { id: "SQ-2025-089", type: "Sales Quotation", requester: "Sales Team", amount: "ETB 320,000", urgency: "High", module: "CRM" },
]

const urgencyColors: Record<string, { color: string; bg: string }> = {
  High: { color: "#C8102E", bg: "#FFF1F3" },
  Normal: { color: "#2563EB", bg: "#EEF2FF" },
  Low: { color: "#16A34A", bg: "#F0FDF4" },
}

const moduleColors: Record<string, string> = {
  PRMS: "#C8102E",
  HRM: "#2563EB",
  FMS: "#16A34A",
  CRM: "#7C3AED",
  MMS: "#0B1E3D",
}

export function Dashboard() {
  return (
    <div className="p-6 space-y-6 h-full overflow-auto bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#0B1E3D", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            ERP System Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Cross-module overview — HRM · PRMS · MMS · CRM · FMS
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Fiscal Period</p>
            <p className="text-sm font-semibold text-foreground">July 2025</p>
          </div>
          <div className="w-2 h-8 rounded-full" style={{ background: "linear-gradient(180deg, #C8102E, #2563EB)" }} />
        </div>
      </div>

      {/* Module KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {moduleKPIs.map((k, i) => {
          const Icon = k.icon
          return (
            <Card key={i} className="border-0 shadow-sm overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: `${k.color}15`, color: k.color }}>
                    {k.module}
                  </span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: k.bg }}>
                    <Icon className="h-4 w-4" style={{ color: k.color }} />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <p className="text-xl font-bold mt-0.5" style={{ color: "#0B1E3D" }}>{k.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{k.sub}</p>
                <div className="flex items-center gap-1 mt-2">
                  {k.positive
                    ? <ArrowUpRight className="h-3 w-3 text-green-600" />
                    : <ArrowDownRight className="h-3 w-3 text-red-600" />}
                  <span className={`text-xs font-semibold ${k.positive ? "text-green-600" : "text-red-600"}`}>{k.change}</span>
                </div>
              </CardContent>
              <div className="h-0.5" style={{ background: k.color }} />
            </Card>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Revenue vs Expenses — FMS */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base" style={{ color: "#0B1E3D" }}>Revenue vs Expenses</CardTitle>
                <p className="text-xs text-muted-foreground">FMS — Monthly (ETB)</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded font-semibold" style={{ background: "#F0FDF4", color: "#16A34A" }}>FMS</span>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData}>
                <CartesianGrid key="dash-area-grid"    strokeDasharray="3 3" stroke="#E8EDF5" vertical={false} />
                <XAxis        key="dash-area-xaxis"    dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <YAxis        key="dash-area-yaxis"    tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip      key="dash-area-tooltip"  contentStyle={{ borderRadius: 8, border: "1px solid #E8EDF5", fontSize: 12 }} formatter={(v: any) => [`ETB ${v.toLocaleString()}`, ""]} />
                <Legend       key="dash-area-legend"   wrapperStyle={{ fontSize: 11 }} />
                <Area key="dash-area-revenue"  type="monotone" dataKey="revenue"  stroke="#1D4ED8" strokeWidth={2} fill="#1D4ED8" fillOpacity={0.1} name="Revenue" />
                <Area key="dash-area-expenses" type="monotone" dataKey="expenses" stroke="#C8102E" strokeWidth={2} fill="#C8102E" fillOpacity={0.08} name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stock Movement — MMS */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base" style={{ color: "#0B1E3D" }}>Stock Movement</CardTitle>
                <p className="text-xs text-muted-foreground">MMS — Goods Receipt vs Issue</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded font-semibold" style={{ background: "#F0F4FF", color: "#0B1E3D" }}>MMS</span>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stockMovement} barSize={18} barGap={4}>
                <CartesianGrid key="dash-bar-grid"    strokeDasharray="3 3" stroke="#E8EDF5" vertical={false} />
                <XAxis        key="dash-bar-xaxis"    dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <YAxis        key="dash-bar-yaxis"    tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <Tooltip      key="dash-bar-tooltip"  contentStyle={{ borderRadius: 8, border: "1px solid #E8EDF5", fontSize: 12 }} />
                <Legend       key="dash-bar-legend"   wrapperStyle={{ fontSize: 11 }} />
                <Bar key="dash-bar-receipt" dataKey="receipt" fill="#2563EB" radius={[3, 3, 0, 0]} name="Goods Receipt" />
                <Bar key="dash-bar-issue"   dataKey="issue"   fill="#C8102E" radius={[3, 3, 0, 0]} name="Goods Issue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals & Module Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Pending Approvals */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2" style={{ color: "#0B1E3D" }}>
                <Clock className="h-4 w-4" style={{ color: "#C8102E" }} />
                Pending Approvals
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-xs h-7 gap-1" style={{ color: "#2563EB" }}>
                <Eye className="h-3 w-3" /> View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingApprovals.map((item) => {
              const urg = urgencyColors[item.urgency]
              return (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "#F8FAFC" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-10 rounded-full" style={{ background: moduleColors[item.module] }} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold" style={{ color: "#2563EB" }}>{item.id}</span>
                        <span className="text-xs px-1.5 py-0 rounded font-semibold" style={{ background: `${moduleColors[item.module]}15`, color: moduleColors[item.module] }}>
                          {item.module}
                        </span>
                      </div>
                      <p className="text-sm font-medium" style={{ color: "#0B1E3D" }}>{item.type}</p>
                      <p className="text-xs text-muted-foreground">{item.requester}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="text-sm font-bold" style={{ color: "#0B1E3D" }}>{item.amount}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: urg.color, background: urg.bg }}>
                      {item.urgency}
                    </span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Module Health */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base" style={{ color: "#0B1E3D" }}>Module Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { module: "HRM", label: "Human Resources", status: "Operational", icon: Users, color: "#2563EB", bg: "#EEF2FF", info: "284 employees active" },
              { module: "PRMS", label: "Procurement", status: "Needs Action", icon: ShoppingCart, color: "#C8102E", bg: "#FFF1F3", info: "5 pending approvals" },
              { module: "MMS", label: "Materials", status: "Warning", icon: Warehouse, color: "#D97706", bg: "#FFFBEB", info: "23 low stock items" },
              { module: "CRM", label: "Sales & CRM", status: "Operational", icon: Handshake, color: "#7C3AED", bg: "#F5F3FF", info: "138 open orders" },
              { module: "FMS", label: "Finance", status: "Operational", icon: Landmark, color: "#16A34A", bg: "#F0FDF4", info: "14 overdue invoices" },
            ].map((m, i) => {
              const Icon = m.icon
              const statusIcon = m.status === "Operational"
                ? <CheckCircle2 className="h-3 w-3 text-green-600" />
                : m.status === "Needs Action"
                ? <AlertTriangle className="h-3 w-3" style={{ color: "#C8102E" }} />
                : <AlertTriangle className="h-3 w-3 text-amber-500" />
              return (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background: "#F8FAFC" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: m.bg }}>
                    <Icon className="h-4 w-4" style={{ color: m.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold" style={{ color: m.color }}>{m.module}</span>
                      {statusIcon}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{m.info}</p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
