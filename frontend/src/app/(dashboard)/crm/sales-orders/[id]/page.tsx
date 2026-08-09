import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { listCustomers } from "@/features/crm/api/customers";
import { CrmApiError } from "@/features/crm/api/crm-client";
import { getSalesOrder } from "@/features/crm/api/sales-orders";
import CrmModuleHeader from "@/features/crm/components/CrmModuleHeader";
import SalesOrderDetailActions from "@/features/crm/components/SalesOrderDetailActions";
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
  const cur = currency || "ETB";
  return `${cur} ${Number(n).toLocaleString()}`;
}

export default async function SalesOrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { id } = await params;
  const { created } = await searchParams;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  try {
    const order = await getSalesOrder(numericId);
    let customerLabel = `Customer #${order.customerId}`;
    try {
      const customers = await listCustomers({ page: 0, size: 100 });
      const match = customers.content.find((c) => c.id === order.customerId);
      if (match) {
        customerLabel =
          match.companyName || match.contactName || match.customerNumber;
      }
    } catch {
      // keep fallback label
    }

    const rows: [string, ReactNode][] = [
      ["Order #", order.orderNumber],
      ["Customer", customerLabel],
      [
        "Quotation",
        order.quotationId ? (
          <Button asChild variant="link" className="h-auto p-0">
            <Link href={`/crm/quotations/${order.quotationId}`}>
              Quote #{order.quotationId}
            </Link>
          </Button>
        ) : (
          "—"
        ),
      ],
      [
        "Opportunity",
        order.opportunityId ? String(order.opportunityId) : "—",
      ],
      ["Order date", order.orderDate || "—"],
      ["Delivery date", order.deliveryDate || "—"],
      ["Type", order.type || "—"],
      ["Currency", order.currency || "ETB"],
      ["Subtotal", money(order.subtotal, order.currency)],
      ["Discount", money(order.discountAmount, order.currency)],
      ["Tax", money(order.taxAmount, order.currency)],
      ["Total", money(order.totalAmount, order.currency)],
      ["Notes", order.notes || "—"],
    ];

    return (
      <div className="flex flex-col gap-4">
        <CrmModuleHeader section="Sales Order Detail" />
        <Button asChild variant="ghost" className="w-fit px-0">
          <Link href="/crm/sales-orders">← Back to sales orders</Link>
        </Button>

        {created ? (
          <AlertBanner
            type="success"
            message="Created from an accepted quotation. Confirm when ready to publish."
          />
        ) : null}

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-extrabold" style={{ color: "#0B1E3D" }}>
              {order.orderNumber}
            </h2>
            <StatusBadge status={order.status} />
          </div>
          <SalesOrderDetailActions order={order} />
        </div>

        <SectionCard title="Details">
          <div className="flex flex-col">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[180px_1fr] gap-4 border-b border-border py-3 text-sm last:border-b-0"
              >
                <span className="font-semibold text-muted-foreground">
                  {label}
                </span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Line items" noPadding>
          <div className="overflow-x-auto px-5 pb-4 pt-3">
            <Table>
              <DataTableHead
                columns={["Item", "SKU", "Qty", "Unit price", "Total"]}
              />
              <TableBody>
                {(order.items ?? []).map((item, idx) => (
                  <TableRow key={item.id ?? idx}>
                    <TableCell>{item.itemName || "—"}</TableCell>
                    <TableCell>{item.sku || "—"}</TableCell>
                    <TableCell>{item.quantity ?? "—"}</TableCell>
                    <TableCell>{money(item.unitPrice, order.currency)}</TableCell>
                    <TableCell>
                      {money(item.totalPrice, order.currency)}
                    </TableCell>
                  </TableRow>
                ))}
                {(order.items ?? []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>No line items</TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </SectionCard>
      </div>
    );
  } catch (err) {
    if (err instanceof CrmApiError && err.status === 404) notFound();
    return (
      <AlertBanner
        type="warning"
        message={`Could not load sales order. ${
          err instanceof Error ? err.message : "Unknown error"
        }`}
      />
    );
  }
}
