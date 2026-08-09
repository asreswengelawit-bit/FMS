import Link from "next/link";
import { CrmApiError, crmBaseUrl } from "@/features/crm/api/crm-client";
import { loadCrmOverview } from "@/features/crm/api/overview";
import CrmKpiRow from "@/features/crm/components/CrmKpiRow";
import CrmModuleHeader from "@/features/crm/components/CrmModuleHeader";
import CrmPipeline from "@/features/crm/components/CrmPipeline";
import LeadsTable from "@/features/crm/components/LeadsTable";
import { theme } from "@/styles/theme";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;
  let error: string | null = null;
  let overview = await loadCrmOverview(q).catch((err) => {
    error =
      err instanceof CrmApiError
        ? err.message
        : `Could not reach CRM at ${crmBaseUrl()}. Is the backend running?`;
    return null;
  });

  const filtered =
    overview && status
      ? overview.leads.filter((l) => l.status === status)
      : overview?.leads ?? [];

  return (
    <div>
      <CrmModuleHeader
        section="Leads"
        action={
          <Link
            href="/crm/leads/new"
            style={{
              background: `linear-gradient(180deg, ${theme.red2}, ${theme.red})`,
              color: "#fff",
              padding: "0.55rem 1rem",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: "0.9rem",
            }}
          >
            New Lead
          </Link>
        }
      />

      {overview ? (
        <>
          <CrmKpiRow items={overview.kpis} />
          <CrmPipeline stages={overview.pipeline} />
        </>
      ) : null}

      <form
        method="get"
        style={{
          display: "flex",
          gap: "0.6rem",
          marginBottom: "0.9rem",
          flexWrap: "wrap",
        }}
      >
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search leads..."
          style={{
            flex: "1 1 260px",
            border: "1px solid #e2e6ee",
            background: "#fff",
            borderRadius: 8,
            padding: "0.6rem 0.85rem",
            fontSize: "0.92rem",
          }}
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          style={{
            border: "1px solid #e2e6ee",
            background: "#fff",
            borderRadius: 8,
            padding: "0.6rem 0.85rem",
            fontSize: "0.92rem",
          }}
        >
          <option value="">All Stages</option>
          <option value="NEW">NEW</option>
          <option value="CONTACTED">CONTACTED</option>
          <option value="QUALIFIED">QUALIFIED</option>
          <option value="UNQUALIFIED">UNQUALIFIED</option>
          <option value="CONVERTED">CONVERTED</option>
          <option value="LOST">LOST</option>
        </select>
        <button
          type="submit"
          style={{
            border: "1px solid #e2e6ee",
            background: "#fff",
            borderRadius: 8,
            padding: "0.6rem 0.9rem",
            fontWeight: 700,
            color: theme.navy,
          }}
        >
          Filter
        </button>
      </form>

      {error ? (
        <div
          style={{
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            color: "#9a3412",
            borderRadius: 12,
            padding: "1rem 1.1rem",
          }}
        >
          <strong>Could not load leads.</strong>
          <div style={{ marginTop: 6 }}>{error}</div>
        </div>
      ) : (
        <LeadsTable leads={filtered} />
      )}
    </div>
  );
}
