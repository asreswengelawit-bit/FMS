import { Button } from "@/features/shared/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { Plus, ArrowLeftRight } from "lucide-react"
import { SectionCard, DataTableHead } from "@/features/shared/components"
import { movements, movementTypeConfig } from "./mms.data"

export function MMSMovements() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {Object.entries(movementTypeConfig).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: v.color }} />
              <span className="text-xs text-muted-foreground">{k} = {v.label}</span>
            </div>
          ))}
        </div>
        <Button className="text-white gap-2 text-xs h-8" style={{ background: "#2563EB" }}>
          <Plus className="h-3.5 w-3.5" /> Record Movement
        </Button>
      </div>

      <SectionCard title="Stock Movements" icon={ArrowLeftRight} noPadding count={movements.length}>
        <Table>
          <DataTableHead columns={["Movement ID", "Type", "Item", "Qty", "Warehouse", "Reference", "Date", "Recorded By", "Note"]} />
          <TableBody>
            {movements.map(mov => {
              const tc = movementTypeConfig[mov.type] ?? { label: mov.type, color: "#64748B", bg: "#F1F5F9" }
              return (
                <TableRow key={mov.id} className="hover:bg-slate-50">
                  <TableCell className="font-mono text-xs font-semibold" style={{ color: "#2563EB" }}>{mov.id}</TableCell>
                  <TableCell>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: tc.color, background: tc.bg }}>{mov.type}</span>
                  </TableCell>
                  <TableCell className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{mov.item}</TableCell>
                  <TableCell>
                    <span className="text-sm font-bold" style={{ color: mov.qty > 0 ? "#16A34A" : "#C8102E" }}>
                      {mov.qty > 0 ? "+" : ""}{mov.qty}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{mov.warehouse}</TableCell>
                  <TableCell className="font-mono text-xs" style={{ color: "#2563EB" }}>{mov.ref}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{mov.date}</TableCell>
                  <TableCell className="text-xs font-semibold" style={{ color: "#0B1E3D" }}>{mov.by}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-32 truncate">{mov.note}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  )
}
