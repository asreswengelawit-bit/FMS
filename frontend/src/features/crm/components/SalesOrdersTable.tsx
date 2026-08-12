"use client";

import Link from "next/link";
import { useTransition } from "react";
import { confirmSalesOrderAction } from "@/features/crm/actions/sales-orders";
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
import type { SalesOrder } from "@/features/crm/types/sales-order";

function money(n: number | null | undefined, currency?: string | null): string {
  if (n == null || Number.isNaN(Number(n))) return "—";
  const cur = currency || "ETB";
  return `${cur} ${Number(n).toLocaleString()}`;
}

export default function SalesOrdersTable({
  orders,
  customerNames,
}: {
  orders: SalesOrder[];
  customerNames: Record<number, string>;
}) {
  const [pending, start] = useTransition();

  if (orders.length === 0) {
    return (
      <AlertBanner
        type="info"
        message="No sales orders yet. Accept a quotation to create the first order."
      />
    );
  }

  return (
    <SectionCard title="Sales Order Registry" count={orders.length} noPadding>
      <div className="overflow-x-auto px-5 pb-4 pt-3">
        <Table>
          <DataTableHead
            columns={[
              "Order #",
              "Customer",
              "Order date",
              "Total",
              "Status",
              "Actions",
            ]}
          />
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id} className="hover:bg-slate-50">
                <TableCell>
                  <Link
                    href={`/crm/sales-orders/${o.id}`}
                    className="text-xs font-bold"
                    style={{ color: "#C8102E" }}
                  >
                    {o.orderNumber}
                  </Link>
                </TableCell>
                <TableCell className="text-sm">
                  {customerNames[o.customerId] || `Customer #${o.customerId}`}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {o.orderDate || "—"}
                </TableCell>
                <TableCell className="text-sm font-bold">
                  {money(o.totalAmount, o.currency)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={o.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {o.status === "DRAFT" || o.status === "PENDING" ? (
                      <Button
                        type="button"
                        size="sm"
                        disabled={pending}
                        onClick={() =>
                          start(async () => {
                            await confirmSalesOrderAction(o.id);
                          })
                        }
                      >
                        Confirm
                      </Button>
                    ) : o.quotationId ? (
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/crm/quotations/${o.quotationId}`}>
                          Quotation
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
