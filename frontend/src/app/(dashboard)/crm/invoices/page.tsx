import Link from "next/link";
import { listCustomers } from "@/features/crm/api/customers";
import { CrmApiError, crmBaseUrl } from "@/features/crm/api/crm-client";
import { listInvoices } from "@/features/crm/api/invoices";
import { loadCrmOverview } from "@/features/crm/api/overview";
import CrmKpiRow from "@/features/crm/components/CrmKpiRow";
import CrmModuleHeader from "@/features/crm/components/CrmModuleHeader";
import CrmPipeline from "@/features/crm/components/CrmPipeline";
import InvoicesTable from "@/features/crm/components/InvoicesTable";
import type { InvoiceStatus } from "@/features/crm/types/invoice";
import { AlertBanner } from "@/features/shared/components";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;

  let error: string | null = null;
  let invoices = [] as Awaited<ReturnType<typeof listInvoices>>["content"];
  const customerNames: Record<number, string> = {};

  const overview = await loadCrmOverview().catch(() => null);

  try {
    const page = await listInvoices({
      q,
      status: status as InvoiceStatus | undefined,
      page: 0,
      size: 50,
    });
    invoices = page.content;

    const customers = await listCustomers({ page: 0, size: 100 });
    for (const c of customers.content) {
      customerNames[c.id] =
        c.companyName || c.contactName || c.customerNumber;
    }
  } catch (err) {
    error =
      err instanceof CrmApiError
        ? err.message
        : `Could not reach CRM at ${crmBaseUrl()}. Is the backend running?`;
  }

  const pipeline = [
    {
      key: "DRAFT",
      label: "Draft",
      count: invoices.filter((x) => x.status === "DRAFT").length,
      tone: "slate" as const,
    },
    {
      key: "PENDING",
      label: "Pending",
      count: invoices.filter((x) => x.status === "PENDING").length,
      tone: "amber" as const,
    },
    {
      key: "SENT",
      label: "Sent",
      count: invoices.filter((x) => x.status === "SENT").length,
      tone: "blue" as const,
    },
    {
      key: "PAID",
      label: "Paid",
      count: invoices.filter((x) => x.status === "PAID").length,
      tone: "green" as const,
    },
    {
      key: "OVERDUE",
      label: "Overdue",
      count: invoices.filter((x) => x.status === "OVERDUE").length,
      tone: "red" as const,
    },
    {
      key: "CANCELLED",
      label: "Cancelled",
      count: invoices.filter((x) => x.status === "CANCELLED").length,
      tone: "pink" as const,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <CrmModuleHeader
        section="Invoices"
        action={
          <Button asChild variant="outline">
            <Link href="/crm/sales-orders">From sales orders</Link>
          </Button>
        }
      />

      {overview ? <CrmKpiRow items={overview.kpis} /> : null}
      <CrmPipeline stages={pipeline} />

      <form method="get" className="flex flex-wrap items-center gap-2">
        <Input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search invoices..."
          className="min-w-[220px] flex-1"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">DRAFT</option>
          <option value="PENDING">PENDING</option>
          <option value="SENT">SENT</option>
          <option value="PAID">PAID</option>
          <option value="OVERDUE">OVERDUE</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
        <Button type="submit" variant="outline">
          Filter
        </Button>
      </form>

      {error ? (
        <AlertBanner
          type="warning"
          message={`Could not load invoices. ${error}`}
        />
      ) : (
        <InvoicesTable invoices={invoices} customerNames={customerNames} />
      )}
    </div>
  );
}
