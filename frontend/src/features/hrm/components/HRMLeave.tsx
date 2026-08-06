import { Button } from "@/features/shared/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { CalendarDays, CheckCircle2, XCircle } from "lucide-react"
import { StatusBadge, SectionCard, DataTableHead } from "@/features/shared/components"
import { leaveTypes, leaveRequests } from "./hrm.data"

export function HRMLeave() {
  return (
    <div className="space-y-5">
      <SectionCard title="Leave Types" icon={CalendarDays} noPadding count={leaveTypes.length}>
        <Table>
          <DataTableHead columns={["ID", "Leave Type", "Max Days/Year", "Paid", "Carry Over (days)", ""]} />
          <TableBody>
            {leaveTypes.map(lt => (
              <TableRow key={lt.id} className="hover:bg-slate-50">
                <TableCell className="font-mono text-xs font-bold" style={{ color: "#4F6FAF" }}>{lt.id}</TableCell>
                <TableCell className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{lt.name}</TableCell>
                <TableCell className="text-sm font-bold" style={{ color: "#0B1E3D" }}>{lt.days}</TableCell>
                <TableCell>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: lt.paid ? "#16A34A" : "#C8102E", background: lt.paid ? "#F0FDF4" : "#FFF1F3" }}>
                    {lt.paid ? "Paid" : "Unpaid"}
                  </span>
                </TableCell>
                <TableCell className="text-sm" style={{ color: "#0B1E3D" }}>{lt.carryOver}</TableCell>
                <TableCell><Button variant="outline" size="sm" className="h-7 text-xs">Edit</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <SectionCard title="Leave Requests" icon={CalendarDays} noPadding count={leaveRequests.length}>
        <Table>
          <DataTableHead columns={["Request ID", "Employee", "Type", "From", "To", "Days", "Reason", "Status", ""]} />
          <TableBody>
            {leaveRequests.map(lr => (
              <TableRow key={lr.id} className="hover:bg-slate-50">
                <TableCell className="font-mono text-xs font-bold" style={{ color: "#4F6FAF" }}>{lr.id}</TableCell>
                <TableCell className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{lr.employee}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{lr.type}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{lr.from}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{lr.to}</TableCell>
                <TableCell className="text-sm font-bold" style={{ color: "#4F6FAF" }}>{lr.days}</TableCell>
                <TableCell className="text-xs text-muted-foreground" style={{ maxWidth: 160 }}>
                  <p className="truncate">{lr.reason}</p>
                </TableCell>
                <TableCell><StatusBadge status={lr.status} /></TableCell>
                <TableCell>
                  {lr.status === "PENDING" && (
                    <div className="flex gap-1">
                      <Button size="sm" className="h-7 w-7 p-0" style={{ background: "#16A34A" }}>
                        <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 w-7 p-0" style={{ borderColor: "#C8102E", color: "#C8102E" }}>
                        <XCircle className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  )
}
