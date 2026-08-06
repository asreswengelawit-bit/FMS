import { useState } from "react"
import { Button } from "@/features/shared/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { Clock } from "lucide-react"
import { StatusBadge, UserAvatar, SearchFilter, SectionCard, DataTableHead } from "@/features/shared/components"
import { dailyAttendance, departments } from "./hrm.data"

export function HRMAttendance() {
  const [search, setSearch] = useState("")
  const filtered = dailyAttendance.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.dept.toLowerCase().includes(search.toLowerCase())
  )

  const counts = {
    PRESENT:   dailyAttendance.filter(a => a.status === "PRESENT").length,
    ABSENT:    dailyAttendance.filter(a => a.status === "ABSENT").length,
    LATE:      dailyAttendance.filter(a => a.status === "LATE").length,
    "HALF DAY":dailyAttendance.filter(a => a.status === "HALF DAY").length,
    "ON LEAVE":dailyAttendance.filter(a => a.status === "ON LEAVE").length,
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-2">
        {(Object.entries(counts) as [string, number][]).map(([label, count]) => {
          const color = label === "PRESENT" ? "#16A34A" : label === "ABSENT" ? "#C8102E" : label === "LATE" ? "#D97706" : label === "HALF DAY" ? "#7C3AED" : "#64748B"
          return (
            <div key={label} className="bg-white rounded-xl border shadow-sm p-3 text-center" style={{ borderColor: "#E8EDF5", borderTopWidth: 3, borderTopColor: color }}>
              <p className="text-2xl font-bold" style={{ color }}>{count}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          )
        })}
      </div>

      <SearchFilter value={search} onChange={setSearch} placeholder="Search by name or department…">
        <select className="text-xs border rounded-lg px-3 py-2 bg-white" style={{ borderColor: "#E8EDF5" }}>
          <option>All Departments</option>
          {departments.map(d => <option key={d.id}>{d.name}</option>)}
        </select>
        <input type="date" defaultValue="2025-07-22"
          className="text-xs border rounded-lg px-3 py-2 bg-white" style={{ borderColor: "#E8EDF5" }} />
      </SearchFilter>

      <SectionCard title="Attendance Log — 22 Jul 2025" icon={Clock} noPadding count={filtered.length}>
        <Table>
          <DataTableHead columns={["Employee", "Name", "Department", "Check In", "Check Out", "Status", ""]} />
          <TableBody>
            {filtered.map(a => (
              <TableRow key={a.id} className="hover:bg-slate-50">
                <TableCell className="font-mono text-xs font-bold" style={{ color: "#4F6FAF" }}>{a.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <UserAvatar name={a.name} size={26} />
                    <span className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{a.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{a.dept}</TableCell>
                <TableCell className="font-mono text-xs" style={{ color: a.checkIn !== "—" ? "#16A34A" : "#94A3B8" }}>{a.checkIn}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{a.checkOut}</TableCell>
                <TableCell><StatusBadge status={a.status} /></TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="h-7 text-xs">Adjust</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  )
}
