import { useState } from "react"
import { Button } from "@/features/shared/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { Users, Plus, Edit } from "lucide-react"
import { StatusBadge, UserAvatar, SearchFilter, SectionCard, DataTableHead } from "@/features/shared/components"
import { employees, departments } from "./hrm.data"

export function HRMEmployees() {
  const [search, setSearch]   = useState("")
  const [dept,   setDept]     = useState("All")
  const [status, setStatus]   = useState("All")

  const filtered = employees.filter(e => {
    const q = search.toLowerCase()
    return (
      (e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q)) &&
      (dept   === "All" || e.dept === dept) &&
      (status === "All" || e.status === status)
    )
  })

  return (
    <div className="space-y-4">
      <SearchFilter value={search} onChange={setSearch} placeholder="Search employees…">
        <select value={dept} onChange={e => setDept(e.target.value)}
          className="text-xs border rounded-lg px-3 py-2 bg-white" style={{ borderColor: "#E8EDF5" }}>
          <option>All</option>
          {departments.map(d => <option key={d.id}>{d.name}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)}
          className="text-xs border rounded-lg px-3 py-2 bg-white" style={{ borderColor: "#E8EDF5" }}>
          {["All", "ACTIVE", "INACTIVE", "On Leave"].map(s => <option key={s}>{s}</option>)}
        </select>
        <Button className="gap-1.5 text-xs h-9 text-white" style={{ background: "#4F6FAF" }}>
          <Plus className="h-3.5 w-3.5" /> Register Employee
        </Button>
      </SearchFilter>

      <SectionCard title="Employee Directory" icon={Users} noPadding count={filtered.length}>
        <Table>
          <DataTableHead columns={["Employee #", "Name", "Department", "Position", "Join Date", "Phone", "Salary (ETB)", "Status", ""]} />
          <TableBody>
            {filtered.map(emp => (
              <TableRow key={emp.id} className="hover:bg-slate-50">
                <TableCell className="font-mono text-xs font-bold" style={{ color: "#4F6FAF" }}>{emp.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <UserAvatar name={emp.name} size={28} />
                    <span className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{emp.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{emp.dept}</TableCell>
                <TableCell className="text-xs" style={{ color: "#0B1E3D" }}>{emp.position}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{emp.joinDate}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{emp.phone}</TableCell>
                <TableCell className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{emp.salary.toLocaleString()}</TableCell>
                <TableCell><StatusBadge status={emp.status} /></TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="h-7 w-7 p-0"><Edit className="h-3.5 w-3.5" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  )
}
