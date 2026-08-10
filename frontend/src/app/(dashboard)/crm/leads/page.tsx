import Link from "next/link";
import { Plus } from "lucide-react";
import { CrmApiError, crmBaseUrl } from "@/features/crm/api/crm-client";
import { loadCrmOverview } from "@/features/crm/api/overview";
import CrmKpiRow from "@/features/crm/components/CrmKpiRow";
import CrmModuleHeader from "@/features/crm/components/CrmModuleHeader";
import CrmPipeline from "@/features/crm/components/CrmPipeline";
import LeadsTable from "@/features/crm/components/LeadsTable";
import { AlertBanner } from "@/features/shared/components";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;
  let error: string | null = null;
  const overview = await loadCrmOverview(q).catch((err) => {
    error =
      err instanceof CrmApiError
        ? err.message
        : `Could not reach CRM at ${crmBaseUrl()}. Is the backend running?`;
    return null;
  });

  const filtered =
    overview && status
      ? overview.leads.filter((l) => l.status === status)
      : (overview?.leads ?? []);

  return (
    <div className="flex flex-col gap-4">
      <CrmModuleHeader
        section="Leads"
        action={
          <Button asChild>
            <Link href="/crm/leads/new">
              <Plus data-icon="inline-start" />
              New Lead
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
          placeholder="Search leads..."
          className="min-w-[220px] flex-1"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
        >
          <option value="">All Stages</option>
          <option value="NEW">NEW</option>
          <option value="CONTACTED">CONTACTED</option>
          <option value="QUALIFIED">QUALIFIED</option>
          <option value="UNQUALIFIED">UNQUALIFIED</option>
          <option value="CONVERTED">CONVERTED</option>
          <option value="LOST">LOST</option>
        </select>
        <Button type="submit" variant="outline">
          Filter
        </Button>
      </form>

      {error ? (
        <AlertBanner
          type="warning"
          message={`Could not load leads. ${error}`}
        />
      ) : (
        <LeadsTable leads={filtered} />
      )}
    </div>
  );
}
