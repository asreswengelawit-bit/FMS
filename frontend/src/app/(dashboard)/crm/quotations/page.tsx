import Link from "next/link";
import { Plus } from "lucide-react";
import { listCustomers } from "@/features/crm/api/customers";
import { CrmApiError, crmBaseUrl } from "@/features/crm/api/crm-client";
import { loadCrmOverview } from "@/features/crm/api/overview";
import { listQuotations } from "@/features/crm/api/quotations";
import CrmKpiRow from "@/features/crm/components/CrmKpiRow";
import CrmModuleHeader from "@/features/crm/components/CrmModuleHeader";
import CrmPipeline from "@/features/crm/components/CrmPipeline";
import QuotationsTable from "@/features/crm/components/QuotationsTable";
import type { QuotationStatus } from "@/features/crm/types/quotation";
import { AlertBanner } from "@/features/shared/components";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";

export default async function QuotationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;

  let error: string | null = null;
  let quotations = [] as Awaited<ReturnType<typeof listQuotations>>["content"];
  const customerNames: Record<number, string> = {};

  const overview = await loadCrmOverview().catch(() => null);

  try {
    const page = await listQuotations({
      q,
      status: status as QuotationStatus | undefined,
      page: 0,
      size: 50,
    });
    quotations = page.content;

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
      count: quotations.filter((x) => x.status === "DRAFT").length,
      tone: "slate" as const,
    },
    {
      key: "SENT",
      label: "Sent",
      count: quotations.filter((x) => x.status === "SENT").length,
      tone: "blue" as const,
    },
    {
      key: "ACCEPTED",
      label: "Accepted",
      count: quotations.filter((x) => x.status === "ACCEPTED").length,
      tone: "green" as const,
    },
    {
      key: "REJECTED",
      label: "Rejected",
      count: quotations.filter((x) => x.status === "REJECTED").length,
      tone: "red" as const,
    },
    {
      key: "EXPIRED",
      label: "Expired",
      count: quotations.filter((x) => x.status === "EXPIRED").length,
      tone: "amber" as const,
    },
    {
      key: "CANCELLED",
      label: "Cancelled",
      count: quotations.filter((x) => x.status === "CANCELLED").length,
      tone: "pink" as const,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <CrmModuleHeader
        section="Quotations"
        action={
          <Button asChild>
            <Link href="/crm/quotations/new">
              <Plus data-icon="inline-start" />
              New Quotation
            </Link>
          </Button>
        }
      />

      {overview ? <CrmKpiRow items={overview.kpis} /> : null}
      <CrmPipeline stages={pipeline} />

      <form method="get" className="flex flex-wrap items-center gap-2">
        <Input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search quotations..."
          className="min-w-[220px] flex-1"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">DRAFT</option>
          <option value="SENT">SENT</option>
          <option value="ACCEPTED">ACCEPTED</option>
          <option value="REJECTED">REJECTED</option>
          <option value="EXPIRED">EXPIRED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
        <Button type="submit" variant="outline">
          Filter
        </Button>
      </form>

      {error ? (
        <AlertBanner
          type="warning"
          message={`Could not load quotations. ${error}`}
        />
      ) : (
        <QuotationsTable
          quotations={quotations}
          customerNames={customerNames}
        />
      )}
    </div>
  );
}
