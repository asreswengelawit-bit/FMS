import { useState } from "react"
import { Search, Download, Shield, Eye } from "lucide-react"
import { Button } from "@/features/shared/components/ui/button"
import { Input } from "@/features/shared/components/ui/input"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { SectionCard, DataTableHead } from "@/features/shared/components"
import { auditLog } from "./crm.data"

const actionConfig: Record<string, { color: string; bg: string }> = {
  CREATE:  { color: "#16A34A", bg: "#F0FDF4" },
  UPDATE:  { color: "#2563EB", bg: "#EEF2FF" },
  DELETE:  { color: "#C8102E", bg: "#FFF1F3" },
  VIEW:    { color: "#64748B", bg: "#F1F5F9" },
  EXPORT:  { color: "#7C3AED", bg: "#F5F3FF" },
  APPROVE: { color: "#16A34A", bg: "#F0FDF4" },
  REJECT:  { color: "#C8102E", bg: "#FFF1F3" },
}

const classificationConfig: Record<string, { color: string; bg: string }> = {
  PUBLIC:       { color: "#16A34A", bg: "#F0FDF4" },
  INTERNAL:     { color: "#2563EB", bg: "#EEF2FF" },
  CONFIDENTIAL: { color: "#D97706", bg: "#FFFBEB" },
  SECRET:       { color: "#C8102E", bg: "#FFF1F3" },
}

export function CRMAuditLog() {
  const [search, setSearch]     = useState("")
  const [filterAction, setFilterAction] = useState("All")
  const [filterClass, setFilterClass]   = useState("All")

  const filtered = auditLog.filter(a => {
    const matchSearch = a.user.toLowerCase().includes(search.toLowerCase()) ||
      a.entity.toLowerCase().includes(search.toLowerCase()) ||
      a.entityId.toLowerCase().includes(search.toLowerCase()) ||
      a.details.toLowerCase().includes(search.toLowerCase())
    const matchAction = filterAction === "All" || a.action === filterAction
    const matchClass  = filterClass === "All" || a.classification === filterClass
    return matchSearch && matchAction && matchClass
  })

  const actionCounts = ["CREATE", "UPDATE", "DELETE", "VIEW", "EXPORT", "APPROVE", "REJECT"].map(action => ({
    action,
    count: auditLog.filter(a => a.action === action).length,
  }))

  return (
    <div className="space-y-5">
      {/* Action Summary */}
      <div className="grid grid-cols-3 lg:grid-cols-7 gap-2">
        {actionCounts.map(a => {
          const cfg = actionConfig[a.action]
          return (
            <div key={a.action} className="bg-white rounded-xl border shadow-sm p-3 text-center" style={{ borderColor: "#E8EDF5" }}>
              <p className="text-xs font-semibold" style={{ color: cfg.color }}>{a.action}</p>
              <p className="text-xl font-bold mt-0.5" style={{ color: cfg.color }}>{a.count}</p>
            </div>
          )
        })}
      </div>

      {/* Classification Notice */}
      <div className="flex items-center gap-3 p-3 rounded-lg border" style={{ background: "#FFFBEB", borderColor: "#D9770620" }}>
        <Shield className="h-4 w-4 flex-shrink-0" style={{ color: "#D97706" }} />
        <p className="text-xs" style={{ color: "#D97706" }}>
          <strong>Data Classification Active.</strong> Audit entries are classified by sensitivity level. SECRET and CONFIDENTIAL entries are restricted to authorized auditors only. All access is logged.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search audit log..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-9 text-sm" />
        </div>
        <select value={filterAction} onChange={e => setFilterAction(e.target.value)}
          className="h-9 text-sm border rounded-md px-3 bg-white" style={{ borderColor: "#E8EDF5", color: "#0B1E3D" }}>
          {["All", "CREATE", "UPDATE", "DELETE", "VIEW", "EXPORT", "APPROVE", "REJECT"].map(a => <option key={a}>{a}</option>)}
        </select>
        <select value={filterClass} onChange={e => setFilterClass(e.target.value)}
          className="h-9 text-sm border rounded-md px-3 bg-white" style={{ borderColor: "#E8EDF5", color: "#0B1E3D" }}>
          {["All", "PUBLIC", "INTERNAL", "CONFIDENTIAL", "SECRET"].map(c => <option key={c}>{c}</option>)}
        </select>
        <Button variant="outline" className="h-9 gap-1.5 text-sm" style={{ borderColor: "#2563EB", color: "#2563EB" }}>
          <Download className="h-3.5 w-3.5" /> Export Log
        </Button>
      </div>

      {/* Table */}
      <SectionCard title={`Audit Trail (${filtered.length} entries)`} noPadding>
        <div className="px-5 pb-4 pt-3 overflow-x-auto">
          <Table>
            <DataTableHead columns={["Audit ID", "Timestamp", "User / Role", "Action", "Entity", "Entity ID", "IP Address", "Classification", "Details", ""]} />
            <TableBody>
              {filtered.map(a => {
                const ac = actionConfig[a.action]
                const cc = classificationConfig[a.classification]
                return (
                  <TableRow key={a.id} className="hover:bg-slate-50">
                    <TableCell className="text-xs font-mono" style={{ color: "#2563EB" }}>{a.id}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground whitespace-nowrap">{a.timestamp}</TableCell>
                    <TableCell>
                      <p className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{a.user}</p>
                      <p className="text-xs text-muted-foreground">{a.role}</p>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: ac.color, background: ac.bg }}>{a.action}</span>
                    </TableCell>
                    <TableCell className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{a.entity}</TableCell>
                    <TableCell className="text-xs font-mono" style={{ color: "#7C3AED" }}>{a.entityId}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{a.ipAddress}</TableCell>
                    <TableCell>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit" style={{ color: cc.color, background: cc.bg }}>
                        <Shield className="h-2.5 w-2.5" /> {a.classification}
                      </span>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs text-muted-foreground max-w-xs truncate" title={a.details}>{a.details}</p>
                    </TableCell>
                    <TableCell>
                      <button className="p-1 rounded hover:bg-slate-100" title="View full details">
                        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  )
}
