import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { DollarSign } from "lucide-react"
import { StatusBadge, UserAvatar, SectionCard, DataTableHead } from "@/features/shared/components"
import { payrollProfiles } from "./hrm.data"

export function HRMPayroll() {
  const totalGross = payrollProfiles.reduce((s, p) => s + p.basic + p.allowances, 0)
  const eligible   = payrollProfiles.filter(p => p.status !== "Hold").length

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Gross Payroll", value: `ETB ${totalGross.toLocaleString()}`, color: "#0B1E3D" },
          { label: "Eligible Employees",  value: String(eligible),                      color: "#16A34A" },
          { label: "On Hold",             value: String(payrollProfiles.filter(p => p.status === "Hold").length), color: "#C8102E" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5", borderLeftWidth: 3, borderLeftColor: s.color }}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold mt-0.5" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <SectionCard title="Payroll Profiles" icon={DollarSign} noPadding count={payrollProfiles.length}>
        <Table>
          <DataTableHead columns={["Employee", "Name", "Grade", "Basic (ETB)", "Allowances", "Deductions", "Net Pay (ETB)", "Method", "Status"]} />
          <TableBody>
            {payrollProfiles.map(p => (
              <TableRow key={p.id} className="hover:bg-slate-50">
                <TableCell className="font-mono text-xs font-bold" style={{ color: "#4F6FAF" }}>{p.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <UserAvatar name={p.name} size={26} />
                    <span className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{p.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#EEF2FF", color: "#4F6FAF" }}>{p.grade}</span>
                </TableCell>
                <TableCell className="text-sm font-bold" style={{ color: "#0B1E3D" }}>{p.basic.toLocaleString()}</TableCell>
                <TableCell className="text-sm" style={{ color: "#16A34A" }}>+{p.allowances.toLocaleString()}</TableCell>
                <TableCell className="text-sm" style={{ color: "#C8102E" }}>-{p.deductions.toLocaleString()}</TableCell>
                <TableCell className="text-sm font-bold" style={{ color: "#0B1E3D" }}>{p.net.toLocaleString()}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{p.method}</TableCell>
                <TableCell><StatusBadge status={p.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  )
}
