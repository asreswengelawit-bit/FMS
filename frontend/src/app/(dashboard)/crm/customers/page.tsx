import Link from "next/link";
import { Plus } from "lucide-react";
import { listCustomers } from "@/features/crm/api/customers";
import { CrmApiError, crmBaseUrl } from "@/features/crm/api/crm-client";
import { loadCrmOverview } from "@/features/crm/api/overview";
import CrmKpiRow from "@/features/crm/components/CrmKpiRow";
import CrmModuleHeader from "@/features/crm/components/CrmModuleHeader";
import CrmPipeline from "@/features/crm/components/CrmPipeline";
import CustomersCards from "@/features/crm/components/CustomersCards";
import { AlertBanner } from "@/features/shared/components";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  let customers = [] as Awaited<ReturnType<typeof listCustomers>>["content"];
  let error: string | null = null;
  let overview: Awaited<ReturnType<typeof loadCrmOverview>> | null = null;

  try {
    overview = await loadCrmOverview();
  } catch {
    overview = null;
  }

  try {
    const page = await listCustomers({ q, page: 0, size: 50 });
    customers = page.content;
  } catch (err) {
    if (err instanceof CrmApiError) {
      error = err.message;
    } else {
      error = `Could not reach CRM at ${crmBaseUrl()}. Is the backend running?`;
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <CrmModuleHeader
        section="Customers"
        action={
          <Button asChild size="icon" aria-label="Add customer">
            <Link href="/crm/customers/new">
              <Plus />
            </Link>
          </Button>
        }
      />

      {overview ? (
        <>
          <CrmKpiRow items={overview.kpis} />
          <CrmPipeline stages={overview.pipeline} />
        </>
      ) : null}

      <form method="get" className="flex flex-wrap items-center gap-2">
        <Input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search customers..."
          className="max-w-md flex-1"
        />
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>

      {error ? (
        <AlertBanner
          type="warning"
          message={`Could not load customers. ${error}`}
        />
      ) : (
        <CustomersCards customers={customers} />
      )}
    </div>
  );
}
