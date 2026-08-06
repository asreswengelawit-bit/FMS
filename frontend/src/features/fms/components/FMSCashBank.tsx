import { useState } from "react"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { Button } from "@/features/shared/components/ui/button"
import { Banknote, ArrowDownLeft, ArrowUpRight, CheckCircle2, AlertCircle } from "lucide-react"
import { SectionCard, DataTableHead, AlertBanner } from "@/features/shared/components"
import { bankAccounts, bankTransactions, statusConfig } from "./fms.data"

function MatchBadge({ matched }: { matched: boolean }) {
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit"
      style={{ color: matched ? "#16A34A" : "#D97706", background: matched ? "#F0FDF4" : "#FFFBEB" }}>
      {matched ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
      {matched ? "Matched" : "Unmatched"}
    </span>
  )
}

export function FMSCashBank() {
  const [selectedBank, setSelectedBank] = useState("BNK-001")

  const account = bankAccounts.find(b => b.id === selectedBank)
  const txns     = bankTransactions.filter(t => t.bankAccount === selectedBank)
  const unmatched = txns.filter(t => !t.matched)
  const variance  = account ? account.bankBalance - account.bookBalance : 0

  return (
    <div className="space-y-4">
      {unmatched.length > 0 && (
        <AlertBanner
          type="warning"
          message={`<strong>${unmatched.length} unmatched transaction${unmatched.length > 1 ? "s" : ""}</strong> on this account require bank reconciliation attention.`}
        />
      )}

      {/* Bank Account Cards */}
      <div className="grid grid-cols-3 gap-3">
        {bankAccounts.map(b => (
          <button
            key={b.id}
            onClick={() => setSelectedBank(b.id)}
            className="bg-white rounded-xl border shadow-sm p-4 text-left transition-all"
            style={{
              borderColor: selectedBank === b.id ? "#0B1E3D" : "#E8EDF5",
              borderWidth: selectedBank === b.id ? 2 : 1,
              boxShadow: selectedBank === b.id ? "0 0 0 2px #0B1E3D20" : undefined,
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: "#EEF2FF" }}>
                <Banknote className="h-4 w-4" style={{ color: "#4F6FAF" }} />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: "#16A34A", background: "#F0FDF4" }}>
                {b.status}
              </span>
            </div>
            <p className="text-sm font-bold" style={{ color: "#0B1E3D" }}>{b.name}</p>
            <p className="text-xs text-muted-foreground">{b.bank} · {b.accountNo}</p>
            <div className="mt-3 pt-3 border-t" style={{ borderColor: "#F1F5F9" }}>
              <div className="flex justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground">Book Balance</p>
                  <p className="text-sm font-bold" style={{ color: "#0B1E3D" }}>{b.currency} {b.bookBalance.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground">Bank Balance</p>
                  <p className="text-sm font-bold" style={{ color: "#2563EB" }}>{b.currency} {b.bankBalance.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Reconciliation summary */}
      {account && (
        <div className="bg-white rounded-xl border shadow-sm p-5" style={{ borderColor: "#E8EDF5" }}>
          <p className="text-sm font-bold mb-4" style={{ color: "#0B1E3D" }}>
            Reconciliation — {account.name}
          </p>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-3 rounded-lg" style={{ background: "#F8FAFC", border: "1px solid #E8EDF5" }}>
              <p className="text-xs text-muted-foreground">Book Balance (GL)</p>
              <p className="text-xl font-bold" style={{ color: "#0B1E3D" }}>ETB {account.bookBalance.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Account {account.glAccount}</p>
            </div>
            <div className="text-center p-3 rounded-lg" style={{ background: "#F8FAFC", border: "1px solid #E8EDF5" }}>
              <p className="text-xs text-muted-foreground">Bank Statement Balance</p>
              <p className="text-xl font-bold" style={{ color: "#2563EB" }}>ETB {account.bankBalance.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">As per bank statement</p>
            </div>
            <div className="text-center p-3 rounded-lg" style={{
              background: Math.abs(variance) === 0 ? "#F0FDF4" : "#FFF1F3",
              border: `1px solid ${Math.abs(variance) === 0 ? "#16A34A" : "#C8102E"}30`
            }}>
              <p className="text-xs text-muted-foreground">Variance</p>
              <p className="text-xl font-bold" style={{ color: Math.abs(variance) === 0 ? "#16A34A" : "#C8102E" }}>
                ETB {Math.abs(variance).toLocaleString()}
              </p>
              <p className="text-xs" style={{ color: Math.abs(variance) === 0 ? "#16A34A" : "#C8102E" }}>
                {Math.abs(variance) === 0 ? "Fully reconciled" : `${unmatched.length} unmatched item${unmatched.length !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cash flow summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Credits",   value: txns.filter(t => t.type === "Credit").reduce((s, t) => s + t.amount, 0), color: "#16A34A", icon: ArrowDownLeft },
          { label: "Total Debits",    value: txns.filter(t => t.type === "Debit").reduce((s, t) => s + t.amount, 0),  color: "#C8102E", icon: ArrowUpRight  },
          { label: "Unmatched Items", value: unmatched.length,                                                          color: "#D97706", isCount: true, icon: AlertCircle },
        ].map(({ label, value, color, isCount, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl border shadow-sm p-4 flex items-center gap-3" style={{ borderColor: "#E8EDF5", borderLeftWidth: 3, borderLeftColor: color }}>
            <div className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: color + "18" }}>
              <Icon className="h-4 w-4" style={{ color }} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-lg font-bold" style={{ color }}>
                {isCount ? String(value) : `ETB ${(value as number).toLocaleString()}`}
              </p>
            </div>
          </div>
        ))}
      </div>

      <SectionCard title="Bank Statement Transactions" icon={Banknote} noPadding count={txns.length}
        action={
          <Button className="text-white gap-2 text-xs h-8" style={{ background: "#4F6FAF" }}>
            Import Statement
          </Button>
        }
      >
        <Table>
          <DataTableHead columns={["TXN ID", "Date", "Description", "Reference", "Type", "Amount (ETB)", "Match Status", "Journal Ref", "Actions"]} />
          <TableBody>
            {txns.map(t => (
              <TableRow key={t.id} className="hover:bg-slate-50">
                <TableCell className="font-mono text-xs font-bold" style={{ color: "#4F6FAF" }}>{t.id}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{t.date}</TableCell>
                <TableCell className="text-sm" style={{ color: "#0B1E3D", maxWidth: 200 }}>
                  <p className="truncate">{t.description}</p>
                </TableCell>
                <TableCell className="font-mono text-xs" style={{ color: "#2563EB" }}>{t.reference}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: t.type === "Credit" ? "#16A34A" : "#C8102E" }}>
                    {t.type === "Credit" ? <ArrowDownLeft className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                    {t.type}
                  </span>
                </TableCell>
                <TableCell className="text-sm font-bold" style={{ color: t.type === "Credit" ? "#16A34A" : "#C8102E" }}>
                  {t.type === "Credit" ? "+" : "-"}ETB {t.amount.toLocaleString()}
                </TableCell>
                <TableCell><MatchBadge matched={t.matched} /></TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{t.journalRef || "—"}</TableCell>
                <TableCell>
                  {!t.matched ? (
                    <Button size="sm" className="h-7 text-xs text-white gap-1" style={{ background: "#D97706" }}>
                      <CheckCircle2 className="h-3 w-3" /> Match
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="h-7 text-xs">View</Button>
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
