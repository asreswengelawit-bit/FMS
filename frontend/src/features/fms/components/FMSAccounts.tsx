import { useState } from "react"
import { Button } from "@/features/shared/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { BookOpen, Plus, CheckCircle2, XCircle } from "lucide-react"
import { SearchFilter, SectionCard, DataTableHead } from "@/features/shared/components"
import { accounts, accountTypeConfig } from "./fms.data"

function TypeBadge({ type }: { type: string }) {
  const s = accountTypeConfig[type] ?? { color: "#64748B", bg: "#F1F5F9" }
  return <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: s.color, background: s.bg }}>{type}</span>
}

const totals = (type: string) => accounts.filter(a => a.type === type && a.balance > 0).reduce((s, a) => s + a.balance, 0)

export function FMSAccounts() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("All")
  const types = ["All", "Asset", "Liability", "Equity", "Revenue", "Expense"]

  const filtered = accounts.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.code.includes(search)
    const matchType = typeFilter === "All" || a.type === typeFilter
    return matchSearch && matchType
  })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-3">
        {["Asset", "Liability", "Equity", "Revenue", "Expense"].map(type => {
          const s = accountTypeConfig[type]
          const count = accounts.filter(a => a.type === type).length
          return (
            <div key={type} className="bg-white rounded-xl border shadow-sm p-4 cursor-pointer transition-all hover:shadow-md"
              style={{ borderColor: "#E8EDF5", borderLeftWidth: 3, borderLeftColor: s.color }}
              onClick={() => setTypeFilter(typeFilter === type ? "All" : type)}>
              <p className="text-xs text-muted-foreground">{type}s</p>
              <p className="text-lg font-bold mt-0.5" style={{ color: s.color }}>ETB {(totals(type) / 1000000).toFixed(2)}M</p>
              <p className="text-xs text-muted-foreground mt-0.5">{count} account{count !== 1 ? "s" : ""}</p>
            </div>
          )
        })}
      </div>

      <SearchFilter value={search} onChange={setSearch} placeholder="Search accounts by name or code…">
        <div className="flex gap-1">
          {types.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
              style={{ background: typeFilter === t ? "#0B1E3D" : "#F1F5F9", color: typeFilter === t ? "white" : "#64748B" }}>
              {t}
            </button>
          ))}
        </div>
        <Button className="gap-1.5 text-xs h-9 text-white" style={{ background: "#4F6FAF" }}>
          <Plus className="h-3.5 w-3.5" /> Add Account
        </Button>
      </SearchFilter>

      <SectionCard title="Chart of Accounts" icon={BookOpen} noPadding count={filtered.length}>
        <Table>
          <DataTableHead columns={["Code", "Account Name", "Type", "Normal Balance", "Balance (ETB)", "Status", "Posting Allowed", "Actions"]} />
          <TableBody>
            {filtered.map(a => (
              <TableRow key={a.code} className="hover:bg-slate-50">
                <TableCell className="font-mono text-xs font-bold" style={{ color: "#4F6FAF" }}>{a.code}</TableCell>
                <TableCell className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{a.name}</TableCell>
                <TableCell><TypeBadge type={a.type} /></TableCell>
                <TableCell>
                  <span className="text-xs font-medium" style={{ color: a.normalBal === "Debit" ? "#2563EB" : "#C8102E" }}>
                    {a.normalBal}
                  </span>
                </TableCell>
                <TableCell className="text-sm font-bold" style={{ color: a.balance < 0 ? "#C8102E" : "#0B1E3D" }}>
                  {a.balance < 0 ? `(${Math.abs(a.balance).toLocaleString()})` : `ETB ${a.balance.toLocaleString()}`}
                </TableCell>
                <TableCell>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ color: a.status === "Active" ? "#16A34A" : "#C8102E", background: a.status === "Active" ? "#F0FDF4" : "#FFF1F3" }}>
                    {a.status}
                  </span>
                </TableCell>
                <TableCell>
                  {a.postingAllowed
                    ? <CheckCircle2 className="h-4 w-4" style={{ color: "#16A34A" }} />
                    : <XCircle className="h-4 w-4" style={{ color: "#C8102E" }} />}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="h-7 text-xs">Ledger</Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs">Edit</Button>
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
