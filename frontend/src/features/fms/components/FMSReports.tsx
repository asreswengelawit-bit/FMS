import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Button } from "@/features/shared/components/ui/button"
import { TrendingUp, BarChart2, Download, FileText } from "lucide-react"
import { SectionCard } from "@/features/shared/components"
import { revenueData, accounts, fmsBudgets, arInvoices, apInvoices } from "./fms.data"

const totalRevenue  = accounts.filter(a => a.type === "Revenue").reduce((s, a) => s + a.balance, 0)
const totalExpense  = accounts.filter(a => a.type === "Expense").reduce((s, a) => s + a.balance, 0)
const netIncome     = totalRevenue - totalExpense
const totalAssets   = accounts.filter(a => a.type === "Asset").reduce((s, a) => s + Math.max(a.balance, 0), 0)
const totalLiabEq   = accounts.filter(a => a.type === "Liability" || a.type === "Equity").reduce((s, a) => s + a.balance, 0)

const arAgingData = [
  { bucket: "0–30d",  amount: arInvoices.filter(i => i.status !== "Overdue" && i.outstanding > 0).reduce((s, i) => s + i.outstanding, 0) },
  { bucket: "31–60d", amount: arInvoices.filter(i => i.status === "Overdue").slice(0, 1).reduce((s, i) => s + i.outstanding, 0) },
  { bucket: "61–90d", amount: arInvoices.filter(i => i.status === "Overdue").slice(1).reduce((s, i) => s + i.outstanding, 0) },
  { bucket: ">90d",   amount: 0 },
]

const apAgingData = [
  { bucket: "0–30d",  amount: apInvoices.filter(i => i.status !== "Overdue" && i.outstanding > 0).reduce((s, i) => s + i.outstanding, 0) },
  { bucket: "31–60d", amount: 0 },
  { bucket: "61–90d", amount: apInvoices.filter(i => i.status === "Overdue").reduce((s, i) => s + i.outstanding, 0) },
  { bucket: ">90d",   amount: 0 },
]

const reportTypes = [
  { label: "Trial Balance",        perm: "fms.report.trial_balance",     role: "All finance roles" },
  { label: "Income Statement",     perm: "fms.report.financial_statements", role: "Finance Manager" },
  { label: "Balance Sheet",        perm: "fms.report.financial_statements", role: "Finance Manager" },
  { label: "AP Aging Report",      perm: "fms.report.aging",             role: "AP Officer, Finance Manager" },
  { label: "AR Aging Report",      perm: "fms.report.aging",             role: "AR Officer, Finance Manager" },
  { label: "Journal Register",     perm: "fms.report.trial_balance",     role: "General Accountant" },
  { label: "Budget vs Actual",     perm: "fms.budget.read",              role: "Finance Manager, Finance Admin" },
  { label: "Cash Flow Proxy",      perm: "fms.report.financial_statements", role: "Finance Manager" },
]

export function FMSReports() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>Financial Reports — Fiscal Year 2025</p>
        <Button variant="outline" className="gap-1.5 text-xs h-9" style={{ borderColor: "#4F6FAF", color: "#4F6FAF" }}>
          <Download className="h-3.5 w-3.5" /> Export PDF
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Revenue",  value: `ETB ${(totalRevenue / 1000000).toFixed(2)}M`,  color: "#16A34A" },
          { label: "Total Expenses", value: `ETB ${(totalExpense / 1000000).toFixed(2)}M`,  color: "#C8102E" },
          { label: "Net Income",     value: `ETB ${(netIncome / 1000000).toFixed(2)}M`,     color: netIncome >= 0 ? "#16A34A" : "#C8102E" },
          { label: "Total Assets",   value: `ETB ${(totalAssets / 1000000).toFixed(2)}M`,   color: "#4F6FAF" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5", borderLeftWidth: 3, borderLeftColor: color }}>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-xl font-bold mt-0.5" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Report catalogue */}
      <div className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5" }}>
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-4 w-4" style={{ color: "#4F6FAF" }} />
          <p className="text-sm font-bold" style={{ color: "#0B1E3D" }}>Available Reports — Permission Controlled</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {reportTypes.map(r => (
            <button key={r.label} className="text-left p-3 rounded-lg border hover:border-blue-300 transition-colors"
              style={{ borderColor: "#E8EDF5" }}>
              <p className="text-xs font-semibold" style={{ color: "#0B1E3D" }}>{r.label}</p>
              <p className="text-[10px] font-mono mt-1" style={{ color: "#4F6FAF" }}>{r.perm}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{r.role}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectionCard title="Revenue vs Expenses (Monthly)" icon={TrendingUp}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false}
                tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E8EDF5" }}
                formatter={(v: any) => [`ETB ${v.toLocaleString()}`, ""]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line key="rev-line" type="monotone" dataKey="revenue"  stroke="#16A34A" strokeWidth={2} dot={{ r: 3 }} name="Revenue" />
              <Line key="exp-line" type="monotone" dataKey="expenses" stroke="#C8102E" strokeWidth={2} dot={{ r: 3 }} name="Expenses" strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Budget vs Actual Spend" icon={BarChart2}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={fmsBudgets} margin={{ left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="category" tick={{ fontSize: 9, fill: "#64748B" }} axisLine={false} tickLine={false}
                tickFormatter={v => v.split(" ")[0]} />
              <YAxis tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false}
                tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E8EDF5" }}
                formatter={(v: any) => [`ETB ${v.toLocaleString()}`, ""]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar key="alloc-bar" dataKey="allocated" fill="#4F6FAF" radius={[3, 3, 0, 0]} name="Allocated" />
              <Bar key="actual-bar" dataKey="actual" fill="#C8102E" radius={[3, 3, 0, 0]} name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectionCard title="AR Aging (Outstanding Receivables)" icon={BarChart2}>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={arAgingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="bucket" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false}
                tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E8EDF5" }}
                formatter={(v: any) => [`ETB ${v.toLocaleString()}`, "Outstanding"]} />
              <Bar key="ar-bar" dataKey="amount" fill="#16A34A" radius={[4, 4, 0, 0]} name="AR Outstanding" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="AP Aging (Outstanding Payables)" icon={BarChart2}>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={apAgingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="bucket" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false}
                tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E8EDF5" }}
                formatter={(v: any) => [`ETB ${v.toLocaleString()}`, "Outstanding"]} />
              <Bar key="ap-bar" dataKey="amount" fill="#D97706" radius={[4, 4, 0, 0]} name="AP Outstanding" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border shadow-sm p-5" style={{ borderColor: "#E8EDF5" }}>
          <p className="text-sm font-bold mb-4" style={{ color: "#0B1E3D" }}>Condensed Income Statement</p>
          <div className="space-y-2.5">
            {[
              { label: "Service Revenue",         value: accounts.find(a => a.code === "4000")?.balance ?? 0, indent: true },
              { label: "Training & Licensing",    value: accounts.find(a => a.code === "4100")?.balance ?? 0, indent: true },
              { label: "Total Revenue",           value: totalRevenue,   bold: true, color: "#16A34A" },
              { label: "Salaries & Benefits",     value: -(accounts.find(a => a.code === "5000")?.balance ?? 0), indent: true },
              { label: "Procurement & Supplies",  value: -(accounts.find(a => a.code === "5100")?.balance ?? 0), indent: true },
              { label: "Utilities & Maintenance", value: -(accounts.find(a => a.code === "5200")?.balance ?? 0), indent: true },
              { label: "Depreciation",            value: -(accounts.find(a => a.code === "5300")?.balance ?? 0), indent: true },
              { label: "Total Expenses",          value: -totalExpense,  bold: true, color: "#C8102E" },
              { label: "Net Income / Surplus",    value: netIncome,      bold: true, color: netIncome >= 0 ? "#16A34A" : "#C8102E", border: true },
            ].map((row, i) => (
              <div key={i} className={`flex justify-between items-center py-1 ${row.border ? "border-t-2 mt-1 pt-2" : ""}`}
                style={row.border ? { borderColor: "#E8EDF5" } : {}}>
                <span className={`text-xs ${row.indent ? "pl-4 text-muted-foreground" : ""} ${row.bold ? "font-bold" : ""}`}
                  style={{ color: row.color ?? (row.bold ? "#0B1E3D" : undefined) }}>
                  {row.label}
                </span>
                <span className={`text-xs font-mono ${row.bold ? "font-bold" : "font-medium"}`}
                  style={{ color: row.color ?? "#0B1E3D" }}>
                  {row.value < 0 ? `(${Math.abs(row.value).toLocaleString()})` : `ETB ${row.value.toLocaleString()}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-5" style={{ borderColor: "#E8EDF5" }}>
          <p className="text-sm font-bold mb-4" style={{ color: "#0B1E3D" }}>Condensed Balance Sheet</p>
          <div className="space-y-2.5">
            {[
              { label: "Cash & Equivalents",         value: accounts.find(a => a.code === "1000")?.balance ?? 0, indent: true },
              { label: "Accounts Receivable",        value: accounts.find(a => a.code === "1100")?.balance ?? 0, indent: true },
              { label: "Inventory",                  value: accounts.find(a => a.code === "1200")?.balance ?? 0, indent: true },
              { label: "Fixed Assets (Net)",         value: (accounts.find(a => a.code === "1500")?.balance ?? 0) + (accounts.find(a => a.code === "1510")?.balance ?? 0), indent: true },
              { label: "Total Assets",               value: totalAssets, bold: true, color: "#4F6FAF" },
              { label: "Accounts Payable",           value: accounts.find(a => a.code === "2000")?.balance ?? 0, indent: true },
              { label: "Long-Term Loans",            value: accounts.find(a => a.code === "2500")?.balance ?? 0, indent: true },
              { label: "Government Capital Fund",    value: accounts.find(a => a.code === "3000")?.balance ?? 0, indent: true },
              { label: "Total Liabilities + Equity", value: totalLiabEq, bold: true, color: "#4F6FAF", border: true },
            ].map((row, i) => (
              <div key={i} className={`flex justify-between items-center py-1 ${row.border ? "border-t-2 mt-1 pt-2" : ""}`}
                style={row.border ? { borderColor: "#E8EDF5" } : {}}>
                <span className={`text-xs ${row.indent ? "pl-4 text-muted-foreground" : ""} ${row.bold ? "font-bold" : ""}`}
                  style={{ color: row.color ?? (row.bold ? "#0B1E3D" : undefined) }}>
                  {row.label}
                </span>
                <span className="text-xs font-mono font-medium" style={{ color: row.color ?? "#0B1E3D" }}>
                  ETB {Math.abs(row.value).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
