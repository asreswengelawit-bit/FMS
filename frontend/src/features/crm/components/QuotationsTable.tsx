"use client";

import Link from "next/link";
import { useTransition } from "react";
import {
  acceptQuotationAction,
  sendQuotationAction,
} from "@/features/crm/actions/quotations";
import {
  AlertBanner,
  DataTableHead,
  SectionCard,
  StatusBadge,
} from "@/features/shared/components";
import { Button } from "@/features/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/features/shared/components/ui/table";
import type { Quotation } from "@/features/crm/types/quotation";

function money(n: number | null | undefined): string {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return `ETB ${Number(n).toLocaleString()}`;
}

export default function QuotationsTable({
  quotations,
  customerNames,
}: {
  quotations: Quotation[];
  customerNames: Record<number, string>;
}) {
  const [pending, start] = useTransition();

  if (quotations.length === 0) {
    return (
      <AlertBanner
        type="info"
        message='No quotations yet. <a href="/crm/quotations/new">Create the first quotation</a>.'
      />
    );
  }

  return (
    <SectionCard title="Quotation Registry" count={quotations.length} noPadding>
      <div className="overflow-x-auto px-5 pb-4 pt-3">
        <Table>
          <DataTableHead
            columns={[
              "Quote #",
              "Customer",
              "Issue",
              "Expiry",
              "Total",
              "Status",
              "Actions",
            ]}
          />
          <TableBody>
            {quotations.map((q) => (
              <TableRow key={q.id} className="hover:bg-slate-50">
                <TableCell>
                  <Link
                    href={`/crm/quotations/${q.id}`}
                    className="text-xs font-bold"
                    style={{ color: "#C8102E" }}
                  >
                    {q.quotationNumber}
                  </Link>
                </TableCell>
                <TableCell className="text-sm">
                  {customerNames[q.customerId] || `Customer #${q.customerId}`}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {q.issueDate}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {q.expiryDate}
                </TableCell>
                <TableCell className="text-sm font-bold">{money(q.totalAmount)}</TableCell>
                <TableCell>
                  <StatusBadge status={q.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {q.status === "DRAFT" ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={pending}
                        onClick={() =>
                          start(async () => {
                            await sendQuotationAction(q.id);
                          })
                        }
                      >
                        Send
                      </Button>
                    ) : null}
                    {q.status === "DRAFT" || q.status === "SENT" ? (
                      <Button
                        type="button"
                        size="sm"
                        disabled={pending}
                        onClick={() =>
                          start(async () => {
                            await acceptQuotationAction(q.id);
                          })
                        }
                      >
                        Accept
                      </Button>
                    ) : q.salesOrderId ? (
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/crm/sales-orders/${q.salesOrderId}`}>
                          Order
                        </Link>
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
}
