import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { listCustomers } from "@/features/crm/api/customers";
import { CrmApiError } from "@/features/crm/api/crm-client";
import { getQuotation } from "@/features/crm/api/quotations";
import CrmModuleHeader from "@/features/crm/components/CrmModuleHeader";
import QuotationDetailActions from "@/features/crm/components/QuotationDetailActions";
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

function money(n: number | null | undefined): string {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return `ETB ${Number(n).toLocaleString()}`;
}

export default async function QuotationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  try {
    const quotation = await getQuotation(numericId);
    let customerLabel = `Customer #${quotation.customerId}`;
    try {
      const customers = await listCustomers({ page: 0, size: 100 });
      const match = customers.content.find((c) => c.id === quotation.customerId);
      if (match) {
        customerLabel =
          match.companyName || match.contactName || match.customerNumber;
      }
    } catch {
      // keep fallback label
    }

    const rows: [string, ReactNode][] = [
      ["Quote #", quotation.quotationNumber],
      ["Customer", customerLabel],
      ["Opportunity ID", String(quotation.opportunityId)],
      ["Issue date", quotation.issueDate],
      ["Expiry date", quotation.expiryDate],
      ["Subtotal", money(quotation.subtotal)],
      ["Discount", money(quotation.discount)],
      ["Tax", money(quotation.tax)],
      ["Total", money(quotation.totalAmount)],
      [
        "Sales order",
        quotation.salesOrderId ? (
          <Button asChild variant="link" className="h-auto p-0">
            <Link href={`/crm/sales-orders/${quotation.salesOrderId}`}>
              Order #{quotation.salesOrderId}
            </Link>
          </Button>
        ) : (
          "—"
        ),
      ],
    ];

    return (
      <div className="flex flex-col gap-4">
        <CrmModuleHeader section="Quotation Detail" />
        <Button asChild variant="ghost" className="w-fit px-0">
          <Link href="/crm/quotations">← Back to quotations</Link>
        </Button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-extrabold" style={{ color: "#0B1E3D" }}>
              {quotation.quotationNumber}
            </h2>
            <StatusBadge status={quotation.status} />
          </div>
          <QuotationDetailActions quotation={quotation} />
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
                {(quotation.items ?? []).map((item, idx) => (
                  <TableRow key={item.id ?? idx}>
                    <TableCell>{item.itemName || "—"}</TableCell>
                    <TableCell>{item.sku || "—"}</TableCell>
                    <TableCell>{item.quantity ?? "—"}</TableCell>
                    <TableCell>{money(item.unitPrice)}</TableCell>
                    <TableCell>{money(item.totalPrice)}</TableCell>
                  </TableRow>
                ))}
                {(quotation.items ?? []).length === 0 ? (
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
        message={`Could not load quotation. ${
          err instanceof Error ? err.message : "Unknown error"
        }`}
      />
    );
  }
}
