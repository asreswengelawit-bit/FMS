import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { History } from "lucide-react"
import { StatusBadge, UserAvatar, SectionCard, DataTableHead } from "@/features/shared/components"
import { assignmentHistory } from "./hrm.data"

export function HRMAssignmentHistory() {
  return (
    <SectionCard title="Assignment History" icon={History} noPadding count={assignmentHistory.length}>
      <Table>
        <DataTableHead columns={["Record ID", "Employee", "From Role", "To Role", "Department", "Date", "Change Type"]} />
        <TableBody>
          {assignmentHistory.map(a => (
            <TableRow key={a.id} className="hover:bg-slate-50">
              <TableCell className="font-mono text-xs font-bold" style={{ color: "#4F6FAF" }}>{a.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <UserAvatar name={a.employee} size={26} />
                  <span className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{a.employee}</span>
                </div>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">{a.from || "—"}</TableCell>
              <TableCell className="text-xs font-medium" style={{ color: "#0B1E3D" }}>{a.to}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{a.dept}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{a.date}</TableCell>
              <TableCell><StatusBadge status={a.type} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </SectionCard>
  )
}
