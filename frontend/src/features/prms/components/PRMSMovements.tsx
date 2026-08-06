import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { Activity } from "lucide-react"
import { AlertBanner, SectionCard, DataTableHead, SearchFilter } from "@/features/shared/components"
import { movements, movementTypeConfig } from "@/features/mms/components/mms.data"
import { useState } from "react"

export function PRMSMovements() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("All")

  const types = ["All", "GR", "GI", "TR", "ADJ"]

  const filtered = movements.filter(m => {
    const q = search.toLowerCase()
    return (
      (m.id.toLowerCase().includes(q) || m.item.toLowerCase().includes(q) || m.by.toLowerCase().includes(q) || m.ref.toLowerCase().includes(q)) &&
      (typeFilter === "All" || m.type === typeFilter)
    )
  })

  const grCount  = movements.filter(m => m.type === "GR").length
  const giCount  = movements.filter(m => m.type === "GI").length
  const adjCount = movements.filter(m => m.type === "ADJ").length

  return (
    <div className="space-y-4">
      <AlertBanner
        type="info"
        message="<strong>Read-only view</strong> — Stock movement records are managed by Materials Management. Contact MMS to correct any discrepancies."
      />

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Movements",  value: String(movements.length), color: "#4F6FAF" },
          { label: "Goods Receipts",   value: String(grCount),          color: "#16A34A" },
          { label: "Goods Issues",     value: String(giCount),          color: "#C8102E" },
          { label: "Adjustments",      value: String(adjCount),         color: "#D97706" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5", borderLeftWidth: 3, borderLeftColor: s.color }}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold mt-0.5" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <SearchFilter value={search} onChange={setSearch} placeholder="Search by movement ID, item, or reference…">
        <div className="flex gap-1.5">
          {types.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap"
              style={{
                background: typeFilter === t ? "#0B1E3D" : "#F1F5F9",
                color: typeFilter === t ? "white" : "#64748B"
              }}>
              {t === "All" ? "All Types" : movementTypeConfig[t]?.label ?? t}
            </button>
          ))}
        </div>
      </SearchFilter>

      <SectionCard title="Stock Movement History" icon={Activity} noPadding count={filtered.length}>
        <Table>
          <DataTableHead columns={["Movement ID", "Type", "Item", "Qty", "Warehouse", "Reference", "Date", "Performed By", "Note"]} />
          <TableBody>
            {filtered.map(m => {
              const tc = movementTypeConfig[m.type] ?? { label: m.type, color: "#64748B", bg: "#F1F5F9" }
              const isNeg = m.qty < 0
              return (
                <TableRow key={m.id} className="hover:bg-slate-50">
                  <TableCell className="font-mono text-xs font-bold" style={{ color: "#4F6FAF" }}>{m.id}</TableCell>
                  <TableCell>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: tc.color, background: tc.bg }}>
                      {tc.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{m.item}</TableCell>
                  <TableCell className="text-sm font-bold" style={{ color: isNeg ? "#C8102E" : "#16A34A" }}>
                    {isNeg ? "" : "+"}{m.qty}
                  </TableCell>
                  <TableCell className="text-xs font-mono" style={{ color: "#4F6FAF" }}>{m.warehouse}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{m.ref}</TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{m.date}</TableCell>
                  <TableCell className="text-xs" style={{ color: "#0B1E3D" }}>{m.by}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[160px] truncate">{m.note}</TableCell>
                </TableRow>
              )
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground text-sm py-8">No movements found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  )
}
