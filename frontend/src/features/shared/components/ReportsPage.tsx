import { Card, CardContent, CardHeader, CardTitle } from "@/features/shared/components/ui/card"
import { Button } from "@/features/shared/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/features/shared/components/ui/tabs"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Tooltip, Legend, AreaChart, Area
} from "recharts"
import { Download, TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart } from "lucide-react"

const monthlySales = [
  { month: "Jan", revenue: 65000, cost: 42000, profit: 23000 },
  { month: "Feb", revenue: 72000, cost: 46000, profit: 26000 },
  { month: "Mar", revenue: 68000, cost: 44000, profit: 24000 },
  { month: "Apr", revenue: 84000, cost: 52000, profit: 32000 },
  { month: "May", revenue: 91000, cost: 56000, profit: 35000 },
  { month: "Jun", revenue: 87000, cost: 54000, profit: 33000 },
  { month: "Jul", revenue: 95000, cost: 58000, profit: 37000 },
]

const topProducts = [
  { name: "All-Purpose Cleaner", units: 1240, revenue: 4947 },
  { name: "Hand Soap 250ml", units: 980, revenue: 2440 },
  { name: "Laundry Detergent", units: 760, revenue: 11020 },
  { name: "Instant Coffee 200g", units: 640, revenue: 5113 },
  { name: "Paper Towels 6-pk", units: 520, revenue: 6754 },
]

const categoryRevenue = [
  { name: "Cleaning Supplies", value: 42, color: "#1D4ED8" },
  { name: "Personal Care", value: 28, color: "#C8102E" },
  { name: "Food & Beverages", value: 18, color: "#0B1E3D" },
  { name: "Household Items", value: 12, color: "#2563EB" },
]

const customerGrowth = [
  { month: "Jan", customers: 310, newCust: 12 },
  { month: "Feb", customers: 325, newCust: 15 },
  { month: "Mar", customers: 338, newCust: 13 },
  { month: "Apr", customers: 352, newCust: 14 },
  { month: "May", customers: 369, newCust: 17 },
  { month: "Jun", customers: 378, newCust: 9 },
  { month: "Jul", customers: 387, newCust: 9 },
]

const kpis = [
  { label: "Total Revenue (YTD)", value: "ETB 562,000", change: "+14.2%", positive: true, icon: DollarSign, color: "#1D4ED8", bg: "#EEF2FF" },
  { label: "Net Profit (YTD)", value: "ETB 210,000", change: "+9.8%", positive: true, icon: TrendingUp, color: "#16A34A", bg: "#F0FDF4" },
  { label: "Total Orders", value: "2,341", change: "+11.3%", positive: true, icon: ShoppingCart, color: "#C8102E", bg: "#FFF1F3" },
  { label: "Product SKUs", value: "247", change: "-2.1%", positive: false, icon: Package, color: "#7C3AED", bg: "#F5F3FF" },
]

export function ReportsPage() {
  return (
    <div className="p-6 space-y-6 h-full overflow-auto bg-background">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#0B1E3D", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Reports & Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Business performance insights and trends</p>
        </div>
        <Button variant="outline" className="gap-2 text-sm" style={{ borderColor: "#1D4ED8", color: "#1D4ED8" }}>
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((k, i) => {
          const Icon = k.icon
          return (
            <Card key={i} className="border-0 shadow-sm overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{k.label}</p>
                    <p className="text-xl font-bold mt-1" style={{ color: "#0B1E3D" }}>{k.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {k.positive
                        ? <TrendingUp className="h-3 w-3 text-green-600" />
                        : <TrendingDown className="h-3 w-3 text-red-600" />}
                      <span className={`text-xs font-semibold ${k.positive ? "text-green-600" : "text-red-600"}`}>{k.change}</span>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: k.bg }}>
                    <Icon className="h-4 w-4" style={{ color: k.color }} />
                  </div>
                </div>
              </CardContent>
              <div className="h-0.5" style={{ background: k.color }} />
            </Card>
          )
        })}
      </div>

      {/* Tabbed Reports */}
      <Tabs defaultValue="revenue">
        <TabsList className="border-b rounded-none bg-transparent p-0 h-auto gap-6 w-full justify-start" style={{ borderColor: "#E8EDF5" }}>
          {[
            { value: "revenue", label: "Revenue Analysis" },
            { value: "products", label: "Top Products" },
            { value: "categories", label: "Category Mix" },
            { value: "customers", label: "Customer Growth" },
          ].map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C8102E] data-[state=active]:text-[#C8102E] pb-3 pt-1 px-0 text-sm font-medium bg-transparent shadow-none"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="revenue" className="mt-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base" style={{ color: "#0B1E3D" }}>Revenue vs Cost vs Profit — Monthly (ETB)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart id="rpt-area-sales" data={monthlySales}>
                  <defs>
                    <linearGradient id="rpt-rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="rpt-profit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16A34A" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF5" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E8EDF5", fontSize: 12 }} formatter={(v: any) => [`ETB ${v.toLocaleString()}`, ""]} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="revenue" stroke="#1D4ED8" strokeWidth={2} fill="url(#rpt-rev)" name="Revenue" />
                  <Area type="monotone" dataKey="profit" stroke="#16A34A" strokeWidth={2} fill="url(#rpt-profit)" name="Profit" />
                  <Line type="monotone" dataKey="cost" stroke="#C8102E" strokeWidth={2} dot={false} name="Cost" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base" style={{ color: "#0B1E3D" }}>Top 5 Products by Revenue (ETB)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart id="rpt-bar-products" data={topProducts} layout="vertical" barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF5" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} width={140} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E8EDF5", fontSize: 12 }} formatter={(v: any) => [`ETB ${v.toLocaleString()}`, "Revenue"]} />
                  <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                    {topProducts.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? "#C8102E" : i === 1 ? "#1D4ED8" : "#2563EB"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base" style={{ color: "#0B1E3D" }}>Revenue by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart id="rpt-pie-cat">
                    <Pie data={categoryRevenue} cx="50%" cy="50%" innerRadius={65} outerRadius={105} paddingAngle={3} dataKey="value">
                      {categoryRevenue.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: any) => [`${v}%`, ""]} contentStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base" style={{ color: "#0B1E3D" }}>Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryRevenue.map((cat, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: cat.color }} />
                        <span className="font-medium" style={{ color: "#0B1E3D" }}>{cat.name}</span>
                      </div>
                      <span className="font-bold" style={{ color: cat.color }}>{cat.value}%</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: "#E8EDF5" }}>
                      <div className="h-2 rounded-full" style={{ width: `${cat.value}%`, background: cat.color }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="mt-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base" style={{ color: "#0B1E3D" }}>Customer Growth Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart id="rpt-line-customers" data={customerGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF5" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E8EDF5", fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="customers" stroke="#1D4ED8" strokeWidth={2.5} dot={{ fill: "#1D4ED8", r: 4 }} name="Total Customers" />
                  <Line type="monotone" dataKey="newCust" stroke="#C8102E" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: "#C8102E", r: 3 }} name="New Customers" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
