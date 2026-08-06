import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { PieChart, BarChart2 } from "lucide-react"
import { SectionCard, DataTableHead } from "@/features/shared/components"
import { budgets, monthlySpendData } from "./prms.data"

export function PRMSBudget() {
  const totalAlloc    = budgets.reduce((s, b) => s + b.allocated, 0)
  const totalCommitted= budgets.reduce((s, b) => s + b.committed, 0)
  const totalSpent    = budgets.reduce((s, b) => s + b.spent, 0)
  const totalRemaining= totalAlloc - totalSpent

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Budget Allocated", value: `ETB ${(totalAlloc / 1000000).toFixed(2)}M`,    color: "#4F6FAF" },
          { label: "Committed",              value: `ETB ${(totalCommitted / 1000000).toFixed(2)}M`, color: "#7C3AED" },
          { label: "Actual Spend",           value: `ETB ${(totalSpent / 1000000).toFixed(2)}M`,     color: "#D97706" },
          { label: "Remaining",              value: `ETB ${(totalRemaining / 1000000).toFixed(2)}M`, color: "#16A34A" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5", borderLeftWidth: 3, borderLeftColor: s.color }}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold mt-0.5" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectionCard title="Monthly Procurement Spend" icon={BarChart2}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart id="prms-bar-spend" data={monthlySpendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E8EDF5" }} formatter={(v: any) => [`ETB ${v.toLocaleString()}`, ""]} />
              <Bar key="bar-spend" dataKey="spend" fill="#4F6FAF" radius={[4, 4, 0, 0]} name="Spend (ETB)" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Budget vs Actual by Department" icon={PieChart}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart id="prms-bar-dept" data={budgets} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 9, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} />
              <YAxis dataKey="department" type="category" tick={{ fontSize: 9, fill: "#64748B" }} axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E8EDF5" }} formatter={(v: any) => [`ETB ${v.toLocaleString()}`, ""]} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar key="bar-allocated" dataKey="allocated" fill="#4F6FAF" radius={[0, 3, 3, 0]} name="Allocated" />
              <Bar key="bar-spent" dataKey="spent" fill="#C8102E" radius={[0, 3, 3, 0]} name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <SectionCard title="Department Budget Utilization" noPadding>
        <div className="px-5 pb-4 pt-3">
          <Table>
            <DataTableHead columns={["Department", "Allocated (ETB)", "Committed (ETB)", "Spent (ETB)", "Remaining (ETB)", "Utilization", "Status"]} />
            <TableBody>
              {budgets.map(b => {
                const pct = Math.round((b.spent / b.allocated) * 100)
                const remaining = b.allocated - b.spent
                const barColor = pct > 90 ? "#C8102E" : pct > 70 ? "#D97706" : "#16A34A"
                const statusLabel = pct >= 100 ? "Over Budget" : pct > 90 ? "Critical" : pct > 70 ? "On Track" : "Under Budget"
                return (
                  <TableRow key={b.department} className="hover:bg-slate-50">
                    <TableCell className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{b.department}</TableCell>
                    <TableCell className="text-sm font-bold" style={{ color: "#4F6FAF" }}>{b.allocated.toLocaleString()}</TableCell>
                    <TableCell className="text-sm" style={{ color: "#7C3AED" }}>{b.committed.toLocaleString()}</TableCell>
                    <TableCell className="text-sm font-bold" style={{ color: "#D97706" }}>{b.spent.toLocaleString()}</TableCell>
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
                    <TableCell>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: barColor, background: barColor + "20" }}>
                        {statusLabel}
                      </span>
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
