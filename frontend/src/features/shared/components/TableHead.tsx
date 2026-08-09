import { TableHead, TableHeader, TableRow } from "@/features/shared/components/ui/table"

export function DataTableHead({ columns }: { columns: string[] }) {
  return (
    <TableHeader>
      <TableRow style={{ background: "#F8FAFC" }}>
        {columns.map((col, i) => (
          <TableHead key={i} className="text-xs font-semibold whitespace-nowrap" style={{ color: "#64748B" }}>
            {col}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  )
}
