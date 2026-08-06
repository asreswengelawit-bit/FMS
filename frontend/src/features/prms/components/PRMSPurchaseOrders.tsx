import { useState } from "react"
import { Button } from "@/features/shared/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { ShoppingCart, Plus, Eye, Package } from "lucide-react"
import { SearchFilter, SectionCard, DataTableHead } from "@/features/shared/components"
import { purchaseOrders, statusConfig } from "./prms.data"

function Badge({ label }: { label: string }) {
  const s = statusConfig[label] ?? { color: "#64748B", bg: "#F1F5F9" }
  return <span className="text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap" style={{ color: s.color, background: s.bg }}>{label}</span>
}

export function PRMSPurchaseOrders() {
  const [search, setSearch] = useState("")
  const filtered = purchaseOrders.filter(po =>
    po.id.toLowerCase().includes(search.toLowerCase()) ||
    po.supplier.toLowerCase().includes(search.toLowerCase()) ||
    po.pr.toLowerCase().includes(search.toLowerCase())
  )
  const totalValue = purchaseOrders.reduce((s, po) => s + po.amount, 0)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total POs",   value: String(purchaseOrders.length),                                         color: "#4F6FAF" },
          { label: "Delivered",   value: String(purchaseOrders.filter(p => p.status === "Delivered").length),   color: "#16A34A" },
          { label: "In Transit",  value: String(purchaseOrders.filter(p => p.status === "In Transit").length),  color: "#2563EB" },
          { label: "Total Value", value: `ETB ${(totalValue / 1000).toFixed(0)}K`,                             color: "#0B1E3D" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5", borderLeftWidth: 3, borderLeftColor: s.color }}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold mt-0.5" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <SearchFilter value={search} onChange={setSearch} placeholder="Search by PO ID, supplier, or linked PR…">
        <Button className="gap-1.5 text-xs h-9 text-white whitespace-nowrap" style={{ background: "#4F6FAF" }}>
          <Plus className="h-3.5 w-3.5" /> Create PO
        </Button>
      </SearchFilter>

      <SectionCard title="Purchase Orders" icon={ShoppingCart} noPadding count={filtered.length}>
        <Table>
          <DataTableHead columns={["PO ID", "Linked PR", "Supplier", "PO Date", "Expected Delivery", "Items", "Amount (ETB)", "Delivery Status", "Payment Status", "Received By", ""]} />
          <TableBody>
            {filtered.map(po => (
              <TableRow key={po.id} className="hover:bg-slate-50">
                <TableCell className="font-mono text-xs font-bold" style={{ color: "#4F6FAF" }}>{po.id}</TableCell>
                <TableCell className="font-mono text-xs" style={{ color: "#C8102E" }}>{po.pr}</TableCell>
                <TableCell className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{po.supplier}</TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{po.date}</TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{po.deliveryDate}</TableCell>
                <TableCell className="text-sm text-center font-bold" style={{ color: "#4F6FAF" }}>{po.items}</TableCell>
                <TableCell className="text-sm font-bold" style={{ color: "#0B1E3D" }}>{po.amount.toLocaleString()}</TableCell>
                <TableCell><Badge label={po.status} /></TableCell>
                <TableCell><Badge label={po.paymentStatus} /></TableCell>
                <TableCell className="text-xs">
                  {po.receivedBy ? (
                    <div>
                      <p className="font-medium" style={{ color: "#0B1E3D" }}>{po.receivedBy}</p>
                      <p className="text-muted-foreground">{po.receivedDate}</p>
                    </div>
                  ) : <span className="text-muted-foreground">—</span>}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0"><Eye className="h-3.5 w-3.5" /></Button>
                    {(po.status === "In Transit" || po.status === "Confirmed") && (
                      <Button size="sm" className="h-7 text-xs text-white gap-1" style={{ background: "#16A34A" }}>
                        <Package className="h-3 w-3" /> Receive
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  )
}
