import { Button } from "@/features/shared/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/features/shared/components/ui/table"
import { Plus, FileText } from "lucide-react"
import { SectionCard, DataTableHead } from "@/features/shared/components"
import { quotations, statusConfig } from "./crm.data"

function Badge({ status }: { status: string }) {
  const s = statusConfig[status] ?? { color: "#64748B", bg: "#F1F5F9" }
  return <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: s.color, background: s.bg }}>{status}</span>
}

export function CRMQuotations() {
  return (
    <SectionCard
      title={`Sales Quotations (${quotations.length})`}
      icon={FileText}
      noPadding
      action={
        <Button className="text-white gap-2 text-xs h-8" style={{ background: "#C8102E" }}>
          <Plus className="h-3.5 w-3.5" /> New Quotation
        </Button>
      }
    >
      <Table>
        <DataTableHead columns={["Quotation ID", "Customer", "Date", "Valid Until", "Items", "Amount (ETB)", "Discount", "Status", ""]} />
        <TableBody>
          {quotations.map(q => (
            <TableRow key={q.id} className="hover:bg-slate-50">
              <TableCell className="font-mono text-xs font-semibold" style={{ color: "#C8102E" }}>{q.id}</TableCell>
              <TableCell className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{q.customer}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{q.date}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{q.validUntil}</TableCell>
              <TableCell className="text-sm">{q.items}</TableCell>
              <TableCell className="text-sm font-bold" style={{ color: "#0B1E3D" }}>{q.amount.toLocaleString()}</TableCell>
              <TableCell>
                <span className="text-xs font-semibold" style={{ color: q.discount > 0 ? "#16A34A" : "#94A3B8" }}>
                  {q.discount > 0 ? `${q.discount}%` : "—"}
                </span>
              </TableCell>
              <TableCell><Badge status={q.status} /></TableCell>
              <TableCell><Button variant="outline" size="sm" className="h-7 text-xs">View</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </SectionCard>
  )
}
