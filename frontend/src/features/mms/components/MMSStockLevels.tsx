import { SectionCard, DataTableHead, StatusBadge } from "@/features/shared/components"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { TrendingDown } from "lucide-react"
import { items } from "./mms.data"

export function MMSStockLevels() {
  const sorted = [...items].sort((a, b) => (a.onHand / a.reorderLevel) - (b.onHand / b.reorderLevel))

  return (
    <div className="space-y-4">
      {/* Alert strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Normal Stock",    count: items.filter(i => i.status === "Normal").length,        color: "#16A34A", bg: "#F0FDF4" },
          { label: "Low Stock",       count: items.filter(i => i.status === "Low Stock").length,      color: "#D97706", bg: "#FFFBEB" },
          { label: "Out of Stock",    count: items.filter(i => i.status === "Out of Stock").length,   color: "#C8102E", bg: "#FFF1F3" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5" }}>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.count}</p>
            <p className="text-xs font-semibold mt-0.5" style={{ color: s.color }}>{s.label}</p>
          </div>
        ))}
      </div>

      <SectionCard title="Stock Levels — All Items" icon={TrendingDown} noPadding>
        <Table>
          <DataTableHead columns={["Item ID", "Item Name", "Category", "UOM", "On Hand", "Reserved", "Available", "Reorder Level", "Stock Level %", "Status"]} />
          <TableBody>
            {sorted.map(item => {
              const available = item.onHand - item.reserved
              const stockPct  = Math.round((item.onHand / item.reorderLevel) * 100)
              const barColor  = item.onHand === 0 ? "#C8102E" : item.onHand <= item.reorderLevel ? "#D97706" : "#16A34A"
              return (
                <TableRow key={item.id} className="hover:bg-slate-50">
                  <TableCell className="font-mono text-xs font-semibold" style={{ color: "#2563EB" }}>{item.id}</TableCell>
                  <TableCell className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{item.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{item.category}</TableCell>
                  <TableCell className="text-xs font-mono">{item.uom}</TableCell>
                  <TableCell className="text-sm font-bold" style={{ color: item.onHand <= item.reorderLevel ? "#C8102E" : "#0B1E3D" }}>{item.onHand}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{item.reserved}</TableCell>
                  <TableCell className="text-sm font-semibold" style={{ color: available > 0 ? "#16A34A" : "#C8102E" }}>{available}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{item.reorderLevel}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full overflow-hidden" style={{ background: "#E8EDF5" }}>
                        <div className="h-2 rounded-full" style={{ width: `${Math.min(stockPct, 100)}%`, background: barColor }} />
                      </div>
                      <span className="text-xs font-bold" style={{ color: barColor }}>{stockPct}%</span>
                    </div>
                  </TableCell>
                  <TableCell><StatusBadge status={item.status} /></TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  )
}
