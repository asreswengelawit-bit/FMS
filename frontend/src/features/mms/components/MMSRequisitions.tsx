import { Button } from "@/features/shared/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { Plus, ClipboardList, CheckCircle2, XCircle } from "lucide-react"
import { StatusBadge, SectionCard, DataTableHead } from "@/features/shared/components"
import { requisitions } from "./mms.data"

const priorityConfig: Record<string, { color: string; bg: string }> = {
  Normal: { color: "#0B1E3D", bg: "#F0F4FF" },
  High:   { color: "#D97706", bg: "#FFFBEB" },
  Urgent: { color: "#C8102E", bg: "#FFF1F3" },
}

export function MMSRequisitions() {
  return (
    <SectionCard
      title="Material Requisitions"
      icon={ClipboardList}
      noPadding
      count={requisitions.length}
      action={
        <Button className="text-white gap-1.5 text-xs h-8" style={{ background: "#2563EB" }}>
          <Plus className="h-3.5 w-3.5" /> New Requisition
        </Button>
      }
    >
      <Table>
        <DataTableHead columns={["Req. ID", "Requested By", "Department", "Item", "Qty", "Date", "Priority", "Status", "Actions"]} />
        <TableBody>
          {requisitions.map(req => {
            const pc = priorityConfig[req.priority] ?? { color: "#64748B", bg: "#F1F5F9" }
            return (
              <TableRow key={req.id} className="hover:bg-slate-50">
                <TableCell className="font-mono text-xs font-semibold" style={{ color: "#2563EB" }}>{req.id}</TableCell>
                <TableCell className="text-xs font-semibold" style={{ color: "#0B1E3D" }}>{req.requestedBy}</TableCell>
                <TableCell className="text-xs">{req.department}</TableCell>
                <TableCell className="text-sm font-medium" style={{ color: "#0B1E3D" }}>{req.item}</TableCell>
                <TableCell className="text-sm font-bold" style={{ color: "#2563EB" }}>{req.qty}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{req.date}</TableCell>
                <TableCell>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: pc.color, background: pc.bg }}>{req.priority}</span>
                </TableCell>
                <TableCell><StatusBadge status={req.status} /></TableCell>
                <TableCell>
                  {req.status === "Pending" && (
                    <div className="flex gap-1">
                      <Button size="sm" className="h-7 text-xs px-2 text-white gap-1" style={{ background: "#16A34A" }}>
                        <CheckCircle2 className="h-3 w-3" /> Issue
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs px-2 hover:text-red-500 gap-1">
                        <XCircle className="h-3 w-3" /> Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </SectionCard>
  )
}
