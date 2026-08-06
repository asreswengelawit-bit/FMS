import { useState } from "react"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { Button } from "@/features/shared/components/ui/button"
import { Calendar, Lock, CheckCircle2, RefreshCw, AlertTriangle, Info } from "lucide-react"
import { SectionCard, DataTableHead, AlertBanner, SearchFilter } from "@/features/shared/components"
import { accountingPeriods, periodStatusConfig } from "./fms.data"

function PeriodBadge({ status }: { status: string }) {
  const s = periodStatusConfig[status] ?? { color: "#64748B", bg: "#F1F5F9" }
  return <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: s.color, background: s.bg }}>{status}</span>
}

const ROLE_PERMS: Record<string, string[]> = {
  FINANCE_ADMINISTRATOR: ["open", "soft-close", "close", "reopen"],
  FINANCE_MANAGER:       ["soft-close", "close", "reopen"],
  GENERAL_ACCOUNTANT:    ["view"],
  AP_OFFICER:            ["view"],
  AR_OFFICER:            ["view"],
}

export function FMSPeriods() {
  const [search, setSearch] = useState("")
  const openCount     = accountingPeriods.filter(p => p.status === "Open").length
  const closedCount   = accountingPeriods.filter(p => p.status === "Closed").length
  const softCount     = accountingPeriods.filter(p => p.status === "Soft Closed").length
  const draftCount    = accountingPeriods.filter(p => p.status === "Draft").length

  const filtered = accountingPeriods.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.status.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <AlertBanner
        type="info"
        message="<strong>Period Close — Maker/Checker:</strong> Accountant initiates soft-close. Finance Manager / Controller approves final close. Checklist and audit note required."
      />

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Open",        count: openCount,   color: "#16A34A", icon: CheckCircle2 },
          { label: "Soft Closed", count: softCount,   color: "#D97706", icon: AlertTriangle },
          { label: "Closed",      count: closedCount, color: "#64748B", icon: Lock },
          { label: "Draft",       count: draftCount,  color: "#2563EB", icon: Info },
        ].map(({ label, count, color, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl border shadow-sm p-4 flex items-center gap-3" style={{ borderColor: "#E8EDF5", borderLeftWidth: 3, borderLeftColor: color }}>
            <div className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: color + "18" }}>
              <Icon className="h-4 w-4" style={{ color }} />
            </div>
            <div>
              <p className="text-xl font-bold" style={{ color }}>{count}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Role permissions reference */}
      <div className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5" }}>
        <p className="text-xs font-bold mb-3" style={{ color: "#0B1E3D" }}>Role Permissions — Period Management</p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(ROLE_PERMS).map(([role, perms]) => (
            <div key={role} className="text-xs">
              <span className="font-semibold" style={{ color: "#0B1E3D" }}>{role.replace("_", " ")}: </span>
              <span className="text-muted-foreground">{perms.join(", ")}</span>
            </div>
          ))}
        </div>
      </div>

      <SearchFilter value={search} onChange={setSearch} placeholder="Search period by name or status…">
        <Button className="gap-1.5 text-xs h-9 text-white" style={{ background: "#0B1E3D" }}>
          <Calendar className="h-3.5 w-3.5" /> Open Next Period
        </Button>
      </SearchFilter>

      <SectionCard title="Accounting Periods — FY2025" icon={Calendar} noPadding count={filtered.length}>
        <Table>
          <DataTableHead columns={["Period ID", "Period Name", "Fiscal Year", "Start Date", "End Date", "Status", "Closed By", "Closed At", "Actions"]} />
          <TableBody>
            {filtered.map(p => (
              <TableRow key={p.id} className="hover:bg-slate-50">
                <TableCell className="font-mono text-xs font-bold" style={{ color: "#4F6FAF" }}>{p.id}</TableCell>
                <TableCell className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{p.name}</TableCell>
                <TableCell className="text-xs font-medium" style={{ color: "#4F6FAF" }}>{p.fiscalYear}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{p.startDate}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{p.endDate}</TableCell>
                <TableCell><PeriodBadge status={p.status} /></TableCell>
                <TableCell className="text-xs text-muted-foreground">{p.closedBy || "—"}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{p.closedAt || "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {p.status === "Open" && (
                      <Button size="sm" className="h-7 text-xs text-white gap-1" style={{ background: "#D97706" }}>
                        <Lock className="h-3 w-3" /> Soft Close
                      </Button>
                    )}
                    {p.status === "Soft Closed" && (
                      <Button size="sm" className="h-7 text-xs text-white gap-1" style={{ background: "#64748B" }}>
                        <Lock className="h-3 w-3" /> Close
                      </Button>
                    )}
                    {p.status === "Closed" && (
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                        <RefreshCw className="h-3 w-3" /> Reopen
                      </Button>
                    )}
                    {(p.status === "Draft" || p.status === "Open") && (
                      <Button size="sm" variant="outline" className="h-7 text-xs">View</Button>
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
