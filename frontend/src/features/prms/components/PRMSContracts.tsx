import { Button } from "@/features/shared/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { FileText, AlertTriangle, Plus, Eye, RefreshCw } from "lucide-react"
import { AlertBanner, SectionCard, DataTableHead } from "@/features/shared/components"
import { contracts, statusConfig } from "./prms.data"

function Badge({ label }: { label: string }) {
  const s = statusConfig[label] ?? { color: "#64748B", bg: "#F1F5F9" }
  return <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: s.color, background: s.bg }}>{label}</span>
}

export function PRMSContracts() {
  const expiring = contracts.filter(c => c.renewalAlert)
  const expired  = contracts.filter(c => c.status === "Expired")

  return (
    <div className="space-y-4">
      {expiring.length > 0 && (
        <AlertBanner
          type="warning"
          message={`<strong>${expiring.length} contract${expiring.length > 1 ? "s" : ""}</strong> expiring soon — renewal action required to avoid service disruption.`}
        />
      )}

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Contracts", value: String(contracts.length),                                       color: "#4F6FAF" },
          { label: "Active",          value: String(contracts.filter(c => c.status === "Active").length),    color: "#16A34A" },
          { label: "Expiring Soon",   value: String(expiring.length),                                        color: "#D97706" },
          { label: "Expired",         value: String(expired.length),                                         color: "#64748B" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5", borderLeftWidth: 3, borderLeftColor: s.color }}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold mt-0.5" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <SectionCard
        title="Contracts Register"
        icon={FileText}
        noPadding
        count={contracts.length}
        action={
          <Button className="text-white gap-2 text-xs h-8" style={{ background: "#4F6FAF" }}>
            <Plus className="h-3.5 w-3.5" /> New Contract
          </Button>
        }
      >
        <Table>
          <DataTableHead columns={["Contract ID", "Supplier", "Type", "Value (ETB)", "Start Date", "End Date", "Signed By", "Status", ""]} />
          <TableBody>
            {contracts.map(c => (
              <TableRow key={c.id} className="hover:bg-slate-50">
                <TableCell className="font-mono text-xs font-bold" style={{ color: "#4F6FAF" }}>{c.id}</TableCell>
                <TableCell className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{c.supplier}</TableCell>
                <TableCell>
                  <div>
                    <p className="text-xs font-medium" style={{ color: "#0B1E3D" }}>{c.type}</p>
                    <p className="text-xs text-muted-foreground truncate" style={{ maxWidth: 180 }}>{c.description}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-bold" style={{ color: "#0B1E3D" }}>{c.value.toLocaleString()}</TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{c.startDate}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {c.renewalAlert && <AlertTriangle className="h-3 w-3 flex-shrink-0" style={{ color: "#D97706" }} />}
                    <span className="text-xs whitespace-nowrap" style={{ color: c.renewalAlert ? "#D97706" : c.status === "Expired" ? "#64748B" : "#0B1E3D" }}>
                      {c.endDate}
                    </span>
                    {c.renewalDays && (
                      <span className="text-xs font-bold" style={{ color: "#D97706" }}>({c.renewalDays}d left)</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{c.signedBy}</TableCell>
                <TableCell><Badge label={c.status} /></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0"><Eye className="h-3.5 w-3.5" /></Button>
                    {c.renewalAlert && (
                      <Button size="sm" className="h-7 text-xs gap-1 text-white" style={{ background: "#D97706" }}>
                        <RefreshCw className="h-3 w-3" /> Renew
                      </Button>
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
