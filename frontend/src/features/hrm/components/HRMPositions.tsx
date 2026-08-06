import { Button } from "@/features/shared/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { Briefcase, Plus } from "lucide-react"
import { SectionCard, DataTableHead } from "@/features/shared/components"
import { positions } from "./hrm.data"

const levelStyle: Record<string, { color: string; bg: string }> = {
  Management: { color: "#C8102E", bg: "#FFF1F3" },
  Senior:     { color: "#4F6FAF", bg: "#EEF2FF" },
  "Mid-Level":{ color: "#7C3AED", bg: "#F5F3FF" },
  Entry:      { color: "#64748B", bg: "#F1F5F9" },
}

export function HRMPositions() {
  return (
    <SectionCard
      title="Positions"
      icon={Briefcase}
      noPadding
      count={positions.length}
      action={
        <Button className="text-white gap-2 text-xs h-8" style={{ background: "#4F6FAF" }}>
          <Plus className="h-3.5 w-3.5" /> Create Position
        </Button>
      }
    >
      <Table>
        <DataTableHead columns={["Position ID", "Title", "Department", "Level", "Grade", "Headcount", ""]} />
        <TableBody>
          {positions.map(p => {
            const ls = levelStyle[p.level] ?? { color: "#64748B", bg: "#F1F5F9" }
            return (
              <TableRow key={p.id} className="hover:bg-slate-50">
                <TableCell className="font-mono text-xs font-bold" style={{ color: "#4F6FAF" }}>{p.id}</TableCell>
                <TableCell className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{p.title}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{p.dept}</TableCell>
                <TableCell>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: ls.color, background: ls.bg }}>
                    {p.level}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-xs font-bold" style={{ color: "#0B1E3D" }}>{p.grade}</TableCell>
                <TableCell className="text-sm font-bold" style={{ color: "#4F6FAF" }}>{p.headcount}</TableCell>
                <TableCell><Button variant="outline" size="sm" className="h-7 text-xs">Edit</Button></TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </SectionCard>
  )
}
