import Link from "next/link";
import { listCustomers } from "@/features/crm/api/customers";
import { CrmApiError, crmBaseUrl } from "@/features/crm/api/crm-client";
import { loadCrmOverview } from "@/features/crm/api/overview";
import CrmKpiRow from "@/features/crm/components/CrmKpiRow";
import CrmModuleHeader from "@/features/crm/components/CrmModuleHeader";
import CrmPipeline from "@/features/crm/components/CrmPipeline";
import CustomersCards from "@/features/crm/components/CustomersCards";
import { theme } from "@/styles/theme";

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
    <div>
      <CrmModuleHeader
        section="Customers"
        action={
          <Link
            href="/crm/customers/new"
            style={{
              background: `linear-gradient(180deg, ${theme.red2}, ${theme.red})`,
              color: "#fff",
              width: 42,
              height: 42,
              borderRadius: 10,
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              fontSize: "1.35rem",
              lineHeight: 1,
            }}
            aria-label="Add customer"
          >
            +
          </Link>
        }
      />

      {overview ? (
        <>
          <CrmKpiRow items={overview.kpis} />
          <CrmPipeline stages={overview.pipeline} />
        </>
      ) : null}

      <form method="get" style={{ marginBottom: "0.9rem" }}>
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search customers..."
          style={{
            width: "min(420px, 100%)",
            border: "1px solid #e2e6ee",
            background: "#fff",
            borderRadius: 8,
            padding: "0.6rem 0.85rem",
            fontSize: "0.92rem",
          }}
        />
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
          <strong>Could not load customers.</strong>
          <div style={{ marginTop: 6 }}>{error}</div>
        </div>
      ) : (
        <CustomersCards customers={customers} />
      )}
    </div>
  );
}
