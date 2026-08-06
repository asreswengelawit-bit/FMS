import { useState } from "react"
import { Package, Info } from "lucide-react"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { SearchFilter, SectionCard, DataTableHead, AlertBanner } from "@/features/shared/components"
import { items } from "@/features/mms/components/mms.data"

function StockBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; bg: string }> = {
    "Normal":        { color: "#16A34A", bg: "#F0FDF4" },
    "Low Stock":     { color: "#D97706", bg: "#FFFBEB" },
    "Out of Stock":  { color: "#C8102E", bg: "#FFF1F3" },
  }
  const s = map[status] ?? { color: "#64748B", bg: "#F1F5F9" }
  return <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: s.color, background: s.bg }}>{status}</span>
}

export function PRMSItemMaster() {
  const [search, setSearch] = useState("")

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.id.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  )

  const lowStock = items.filter(i => i.status === "Low Stock" || i.status === "Out of Stock").length

  return (
    <div className="space-y-4">
      <AlertBanner
        type="info"
        message="<strong>Read-only view</strong> — You are viewing the Item Master from Materials Management. To make changes, contact the Inventory team."
      />

      {lowStock > 0 && (
        <AlertBanner
          type="warning"
          message={`<strong>${lowStock} item${lowStock > 1 ? "s" : ""}</strong> are at or below reorder level — consider initiating a Purchase Request.`}
        />
      )}

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Items",    value: String(items.length),                                              color: "#4F6FAF" },
          { label: "In Stock",       value: String(items.filter(i => i.status === "Normal").length),           color: "#16A34A" },
          { label: "Low / Out",      value: String(lowStock),                                                  color: "#D97706" },
          { label: "Out of Stock",   value: String(items.filter(i => i.status === "Out of Stock").length),     color: "#C8102E" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5", borderLeftWidth: 3, borderLeftColor: s.color }}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold mt-0.5" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <SearchFilter value={search} onChange={setSearch} placeholder="Search items by name, ID or category…" />

      <SectionCard title="Item Master (View Only)" icon={Package} noPadding count={filtered.length}>
        <div className="flex items-center gap-2 px-5 py-2 text-xs border-b" style={{ background: "#FFFBEB", borderColor: "#FDE68A", color: "#D97706" }}>
          <Info className="h-3.5 w-3.5 flex-shrink-0" />
          This is a read-only view. Contact Materials Management to update items.
        </div>
        <Table>
          <DataTableHead columns={["Item ID", "Name", "Category", "UOM", "On Hand", "Reserved", "Available", "Reorder Level", "Unit Cost (ETB)", "Warehouse", "Status"]} />
          <TableBody>
            {filtered.map(item => {
              const available = item.onHand - item.reserved
              const isBelowReorder = item.onHand <= item.reorderLevel
              return (
                <TableRow key={item.id} className="hover:bg-slate-50">
                  <TableCell className="font-mono text-xs font-bold" style={{ color: "#4F6FAF" }}>{item.id}</TableCell>
                  <TableCell className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{item.name}</TableCell>
                  <TableCell>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#EEF2FF", color: "#4F6FAF" }}>{item.category}</span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{item.uom}</TableCell>
                  <TableCell className="text-sm font-bold" style={{ color: isBelowReorder ? "#C8102E" : "#0B1E3D" }}>{item.onHand}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.reserved}</TableCell>
                  <TableCell className="text-sm font-bold" style={{ color: available <= 0 ? "#C8102E" : available < item.reorderLevel ? "#D97706" : "#16A34A" }}>
                    {available}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.reorderLevel}</TableCell>
                  <TableCell className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{item.unitCost.toLocaleString()}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{item.warehouse}</TableCell>
                  <TableCell><StockBadge status={item.status} /></TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  )
}
