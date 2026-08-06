import { useState } from "react"
import { Button } from "@/features/shared/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { Plus, Edit, Package } from "lucide-react"
import { StatusBadge, SearchFilter, SectionCard, DataTableHead } from "@/features/shared/components"
import { items } from "./mms.data"

export function MMSItems() {
  const [search, setSearch] = useState("")
  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.id.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  )

  const totalValue = items.reduce((s, i) => s + i.onHand * i.unitCost, 0)
  const lowStock   = items.filter(i => i.status === "Low Stock" || i.status === "Out of Stock").length

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Items",    value: String(items.length), color: "#2563EB" },
          { label: "Low / No Stock", value: String(lowStock),     color: "#C8102E" },
          { label: "Warehouses",     value: "3",                  color: "#0B1E3D" },
          { label: "Inventory Value",value: `ETB ${(totalValue / 1000000).toFixed(1)}M`, color: "#16A34A" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5", borderLeftWidth: 3, borderLeftColor: s.color }}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold mt-0.5" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <SearchFilter value={search} onChange={setSearch} placeholder="Search by item name, ID or category…">
        <Button className="gap-1.5 text-xs h-9 text-white" style={{ background: "#2563EB" }}>
          <Plus className="h-3.5 w-3.5" /> Add Item
        </Button>
      </SearchFilter>

      <SectionCard title="Item Master" icon={Package} noPadding count={filtered.length}>
        <Table>
          <DataTableHead columns={["Item ID", "Item Name", "Category", "UOM", "On Hand", "Reserved", "Available", "Reorder Level", "Unit Cost (ETB)", "Warehouse", "Status", ""]} />
          <TableBody>
            {filtered.map(item => {
              const available = item.onHand - item.reserved
              const belowReorder = item.onHand <= item.reorderLevel
              return (
                <TableRow key={item.id} className="hover:bg-slate-50">
                  <TableCell className="font-mono text-xs font-semibold" style={{ color: "#2563EB" }}>{item.id}</TableCell>
                  <TableCell className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{item.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{item.category}</TableCell>
                  <TableCell className="text-xs font-mono">{item.uom}</TableCell>
                  <TableCell>
                    <span className="text-sm font-bold" style={{ color: belowReorder ? "#C8102E" : "#0B1E3D" }}>{item.onHand}</span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{item.reserved}</TableCell>
                  <TableCell className="text-sm font-semibold" style={{ color: available > 0 ? "#16A34A" : "#C8102E" }}>{available}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{item.reorderLevel}</TableCell>
                  <TableCell className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{item.unitCost.toLocaleString()}</TableCell>
                  <TableCell className="text-xs">{item.warehouse}</TableCell>
                  <TableCell><StatusBadge status={item.status} /></TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0"><Edit className="h-3.5 w-3.5" /></Button>
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
