import Link from "next/link";
import { listCustomers } from "@/features/crm/api/customers";
import { CrmApiError, crmBaseUrl } from "@/features/crm/api/crm-client";
import { loadCrmOverview } from "@/features/crm/api/overview";
import { listSalesOrders } from "@/features/crm/api/sales-orders";
import CrmKpiRow from "@/features/crm/components/CrmKpiRow";
import CrmModuleHeader from "@/features/crm/components/CrmModuleHeader";
import CrmPipeline from "@/features/crm/components/CrmPipeline";
import SalesOrdersTable from "@/features/crm/components/SalesOrdersTable";
import type {
  OrderStatus,
  SalesOrder,
} from "@/features/crm/types/sales-order";
import { AlertBanner } from "@/features/shared/components";
import { Button } from "@/features/shared/components/ui/button";

export default async function SalesOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  let error: string | null = null;
  let allOrders: SalesOrder[] = [];
  const customerNames: Record<number, string> = {};

  const overview = await loadCrmOverview().catch(() => null);

  try {
    const page = await listSalesOrders({ page: 0, size: 50 });
    allOrders = page.content;

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

  const orders = status
    ? allOrders.filter((o) => o.status === (status as OrderStatus))
    : allOrders;

  const pipeline = [
    {
      key: "DRAFT",
      label: "Draft",
      count: allOrders.filter((x) => x.status === "DRAFT").length,
      tone: "slate" as const,
    },
    {
      key: "PENDING",
      label: "Pending",
      count: allOrders.filter((x) => x.status === "PENDING").length,
      tone: "amber" as const,
    },
    {
      key: "APPROVED",
      label: "Approved",
      count: allOrders.filter((x) => x.status === "APPROVED").length,
      tone: "green" as const,
    },
    {
      key: "PROCESSING",
      label: "Processing",
      count: allOrders.filter((x) => x.status === "PROCESSING").length,
      tone: "blue" as const,
    },
    {
      key: "COMPLETED",
      label: "Completed",
      count: allOrders.filter((x) => x.status === "COMPLETED").length,
      tone: "pink" as const,
    },
    {
      key: "CANCELLED",
      label: "Cancelled",
      count: allOrders.filter((x) => x.status === "CANCELLED").length,
      tone: "red" as const,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <CrmModuleHeader
        section="Sales Orders"
        action={
          <Button asChild variant="outline">
            <Link href="/crm/quotations">From quotations</Link>
          </Button>
        }
      />

      {overview ? <CrmKpiRow items={overview.kpis} /> : null}
      <CrmPipeline stages={pipeline} />

      <form method="get" className="flex flex-wrap items-center gap-2">
        <select
          name="status"
          defaultValue={status ?? ""}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">DRAFT</option>
          <option value="PENDING">PENDING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="PROCESSING">PROCESSING</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
        <Button type="submit" variant="outline">
          Filter
        </Button>
      </form>

      {error ? (
        <AlertBanner
          type="warning"
          message={`Could not load sales orders. ${error}`}
        />
      ) : (
        <SalesOrdersTable orders={orders} customerNames={customerNames} />
      )}
    </div>
  );
}
