import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { listCustomers } from "@/features/crm/api/customers";
import { CrmApiError } from "@/features/crm/api/crm-client";
import { getInvoice } from "@/features/crm/api/invoices";
import CrmModuleHeader from "@/features/crm/components/CrmModuleHeader";
import InvoiceDetailActions from "@/features/crm/components/InvoiceDetailActions";
import {
  AlertBanner,
  SectionCard,
  StatusBadge,
} from "@/features/shared/components";
import { Button } from "@/features/shared/components/ui/button";

function money(n: number | null | undefined, currency?: string | null): string {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return `${currency || "ETB"} ${Number(n).toLocaleString()}`;
}

export default async function InvoiceDetailPage({
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
    const invoice = await getInvoice(numericId);
    let customerLabel = `Customer #${invoice.customerId}`;
    try {
      const customers = await listCustomers({ page: 0, size: 100 });
      const match = customers.content.find((c) => c.id === invoice.customerId);
      if (match) {
        customerLabel =
          match.companyName || match.contactName || match.customerNumber;
      }
    } catch {
      // keep fallback
    }

    const rows: [string, ReactNode][] = [
      ["Invoice #", invoice.invoiceNumber],
      ["Customer", customerLabel],
      [
        "Sales order",
        invoice.salesOrderId ? (
          <Button asChild variant="link" className="h-auto p-0">
            <Link href={`/crm/sales-orders/${invoice.salesOrderId}`}>
              Order #{invoice.salesOrderId}
            </Link>
          </Button>
        ) : (
          "—"
        ),
      ],
      ["Invoice date", invoice.invoiceDate || "—"],
      ["Due date", invoice.dueDate || "—"],
      ["Currency", invoice.currency || "ETB"],
      ["Subtotal", money(invoice.subtotal, invoice.currency)],
      ["Discount", money(invoice.discountAmount, invoice.currency)],
      ["Tax", money(invoice.taxAmount, invoice.currency)],
      ["Total", money(invoice.totalAmount, invoice.currency)],
      ["Paid", money(invoice.paidAmount, invoice.currency)],
      ["Balance", money(invoice.balanceAmount, invoice.currency)],
      ["Notes", invoice.notes || "—"],
    ];

    return (
      <div className="flex flex-col gap-4">
        <CrmModuleHeader section="Invoice Detail" />
        <Button asChild variant="ghost" className="w-fit px-0">
          <Link href="/crm/invoices">← Back to invoices</Link>
        </Button>

        {created ? (
          <AlertBanner
            type="success"
            message="Invoice created from sales order. Send it, then mark paid when collected."
          />
        ) : null}

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-extrabold" style={{ color: "#0B1E3D" }}>
              {invoice.invoiceNumber}
            </h2>
            <StatusBadge status={invoice.status} />
          </div>
          <InvoiceDetailActions invoice={invoice} />
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
      </div>
    );
  } catch (err) {
    if (err instanceof CrmApiError && err.status === 404) notFound();
    return (
      <AlertBanner
        type="warning"
        message={`Could not load invoice. ${
          err instanceof Error ? err.message : "Unknown error"
        }`}
      />
    );
  }
}
