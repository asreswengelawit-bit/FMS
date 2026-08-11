"use client";

import Link from "next/link";
import { useTransition } from "react";
import {
  markInvoicePaidAction,
  sendInvoiceAction,
} from "@/features/crm/actions/invoices";
import type { Invoice } from "@/features/crm/types/invoice";
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

function money(n: number | null | undefined, currency?: string | null): string {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return `${currency || "ETB"} ${Number(n).toLocaleString()}`;
}

export default function InvoicesTable({
  invoices,
  customerNames,
}: {
  invoices: Invoice[];
  customerNames: Record<number, string>;
}) {
  const [pending, start] = useTransition();

  if (invoices.length === 0) {
    return (
      <AlertBanner
        type="info"
        message="No invoices yet. Confirm a sales order, then create an invoice from the order detail."
      />
    );
  }

  return (
    <SectionCard title="Invoice Registry" count={invoices.length} noPadding>
      <div className="overflow-x-auto px-5 pb-4 pt-3">
        <Table>
          <DataTableHead
            columns={[
              "Invoice #",
              "Customer",
              "Invoice date",
              "Due date",
              "Total",
              "Balance",
              "Status",
              "Actions",
            ]}
          />
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id} className="hover:bg-slate-50">
                <TableCell>
                  <Link
                    href={`/crm/invoices/${inv.id}`}
                    className="text-xs font-bold"
                    style={{ color: "#C8102E" }}
                  >
                    {inv.invoiceNumber}
                  </Link>
                </TableCell>
                <TableCell className="text-sm">
                  {customerNames[inv.customerId] ||
                    `Customer #${inv.customerId}`}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {inv.invoiceDate || "—"}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {inv.dueDate || "—"}
                </TableCell>
                <TableCell className="text-sm font-bold">
                  {money(inv.totalAmount, inv.currency)}
                </TableCell>
                <TableCell className="text-sm font-bold">
                  {money(inv.balanceAmount, inv.currency)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={inv.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {inv.status === "DRAFT" || inv.status === "PENDING" ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={pending}
                        onClick={() =>
                          start(async () => {
                            await sendInvoiceAction(inv.id);
                          })
                        }
                      >
                        Send
                      </Button>
                    ) : null}
                    {inv.status !== "PAID" &&
                    inv.status !== "CANCELLED" &&
                    (inv.totalAmount ?? 0) > 0 ? (
                      <Button
                        type="button"
                        size="sm"
                        disabled={pending}
                        onClick={() =>
                          start(async () => {
                            await markInvoicePaidAction(
                              inv.id,
                              Number(inv.totalAmount),
                            );
                          })
                        }
                      >
                        Mark paid
                      </Button>
                    ) : inv.salesOrderId ? (
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/crm/sales-orders/${inv.salesOrderId}`}>
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
