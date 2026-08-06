import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { ShieldCheck } from "lucide-react"
import { SectionCard, DataTableHead } from "@/features/shared/components"
import { auditLog, auditColors } from "./hrm.data"

export function HRMAuditLog() {
  return (
    <SectionCard title="Audit Log" icon={ShieldCheck} noPadding count={auditLog.length}>
      <Table>
        <DataTableHead columns={["Log ID", "User", "Action", "Module", "Record", "Timestamp"]} />
        <TableBody>
          {auditLog.map(a => {
            const s = auditColors[a.action] ?? { color: "#64748B", bg: "#F1F5F9" }
            return (
              <TableRow key={a.id} className="hover:bg-slate-50">
                <TableCell className="font-mono text-xs font-bold" style={{ color: "#4F6FAF" }}>{a.id}</TableCell>
                <TableCell className="font-mono text-xs" style={{ color: "#0B1E3D" }}>{a.user}</TableCell>
                <TableCell>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: s.color, background: s.bg }}>
                    {a.action}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{a.module}</TableCell>
                <TableCell className="text-xs" style={{ color: "#0B1E3D", maxWidth: 200 }}>
                  <p className="truncate">{a.record}</p>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{a.timestamp}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </SectionCard>
  )
}
