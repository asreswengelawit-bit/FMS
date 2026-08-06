import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingDown, Info } from "lucide-react"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { AlertBanner, SectionCard, DataTableHead } from "@/features/shared/components"
import { items } from "@/features/mms/components/mms.data"

export function PRMSStockLevels() {
  const sorted = [...items].sort((a, b) => {
    const pctA = a.onHand / a.reorderLevel
    const pctB = b.onHand / b.reorderLevel
    return pctA - pctB
  })

  const criticalItems = items.filter(i => i.onHand <= i.reorderLevel)
  const chartData = items.map(i => ({
    name: i.name.split(" ").slice(0, 2).join(" "),
    onHand: i.onHand,
    reorderLevel: i.reorderLevel,
    available: Math.max(0, i.onHand - i.reserved),
  }))

  return (
    <div className="space-y-4">
      <AlertBanner
        type="info"
        message="<strong>Read-only view</strong> — Stock level data is managed by Materials Management. Initiate a Purchase Request to replenish critical items."
      />
      {criticalItems.length > 0 && (
        <AlertBanner
          type="warning"
          message={`<strong>${criticalItems.length} item${criticalItems.length > 1 ? "s" : ""}</strong> at or below reorder level — procurement action recommended.`}
        />
      )}

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Items Tracked", value: String(items.length),                                         color: "#4F6FAF" },
          { label: "At/Below Reorder",    value: String(criticalItems.length),                                 color: "#D97706" },
          { label: "Out of Stock",        value: String(items.filter(i => i.onHand === 0).length),             color: "#C8102E" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5", borderLeftWidth: 3, borderLeftColor: s.color }}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold mt-0.5" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <SectionCard title="Stock Level Overview" icon={TrendingDown}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart id="prms-bar-stock" data={chartData} margin={{ left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#64748B" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E8EDF5" }} />
            <Bar key="bar-onhand" dataKey="onHand" fill="#4F6FAF" radius={[3, 3, 0, 0]} name="On Hand" />
            <Bar key="bar-reorder" dataKey="reorderLevel" fill="#FCA5A5" radius={[3, 3, 0, 0]} name="Reorder Level" />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard title="Item Stock Availability" noPadding>
        <div className="flex items-center gap-2 px-5 py-2 text-xs border-b" style={{ background: "#FFFBEB", borderColor: "#FDE68A", color: "#D97706" }}>
          <Info className="h-3.5 w-3.5 flex-shrink-0" />
          Sorted by stock level (critical items first). Contact MMS to update stock records.
        </div>
        <Table>
          <DataTableHead columns={["Item ID", "Name", "Category", "On Hand", "Reserved", "Available", "Reorder Level", "Stock Level", "Status"]} />
          <TableBody>
            {sorted.map(item => {
              const available = item.onHand - item.reserved
              const pct = item.reorderLevel > 0 ? Math.min(100, Math.round((item.onHand / item.reorderLevel) * 100)) : 100
              const barColor = pct <= 50 ? "#C8102E" : pct <= 100 ? "#D97706" : "#16A34A"
              const statusMap: Record<string, { color: string; bg: string }> = {
                "Normal":       { color: "#16A34A", bg: "#F0FDF4" },
                "Low Stock":    { color: "#D97706", bg: "#FFFBEB" },
                "Out of Stock": { color: "#C8102E", bg: "#FFF1F3" },
              }
              const st = statusMap[item.status] ?? { color: "#64748B", bg: "#F1F5F9" }
              return (
                <TableRow key={item.id} className="hover:bg-slate-50">
                  <TableCell className="font-mono text-xs font-bold" style={{ color: "#4F6FAF" }}>{item.id}</TableCell>
                  <TableCell className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{item.name}</TableCell>
                  <TableCell>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#EEF2FF", color: "#4F6FAF" }}>{item.category}</span>
                  </TableCell>
                  <TableCell className="text-sm font-bold" style={{ color: item.onHand <= item.reorderLevel ? "#C8102E" : "#0B1E3D" }}>{item.onHand}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.reserved}</TableCell>
                  <TableCell className="text-sm font-bold" style={{ color: available <= 0 ? "#C8102E" : "#16A34A" }}>{available}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.reorderLevel}</TableCell>
                  <TableCell style={{ minWidth: 130 }}>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full" style={{ background: "#F1F5F9" }}>
                        <div className="h-2 rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: barColor }} />
                      </div>
                      <span className="text-xs font-bold w-8 text-right" style={{ color: barColor }}>{pct}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: st.color, background: st.bg }}>{item.status}</span>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  )
}
