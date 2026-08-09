import Link from "next/link";
import { listCustomers } from "@/features/crm/api/customers";
import { CrmApiError, crmBaseUrl } from "@/features/crm/api/crm-client";
import CustomersTable from "@/features/crm/components/CustomersTable";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  let customers = [] as Awaited<ReturnType<typeof listCustomers>>["content"];
  let total = 0;
  let error: string | null = null;

  try {
    const page = await listCustomers({ q, page: 0, size: 50 });
    customers = page.content;
    total = page.totalElements;
  } catch (err) {
    if (err instanceof CrmApiError) {
      error = err.message;
    } else {
      error = `Could not reach CRM at ${crmBaseUrl()}. Is the backend running?`;
    }
  }

  return (
    <div>
      <header
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "1.25rem",
        }}
      >
        <div>
          <h1 style={{ margin: 0, color: "#0a1f44", fontSize: "1.45rem" }}>
            Customers
          </h1>
          <p style={{ margin: "0.35rem 0 0", color: "#6b7280", fontSize: "0.92rem" }}>
            {error
              ? "CRM customer directory"
              : `${total} customer${total === 1 ? "" : "s"}`}
          </p>
        </div>
        <Link
          href="/crm/customers/new"
          style={{
            background: "#0a1f44",
            color: "#fff",
            padding: "0.55rem 1rem",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
        >
          New customer
        </Link>
      </header>

      <form method="get" style={{ marginBottom: "1rem" }}>
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search name, email, company…"
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
        <CustomersTable customers={customers} />
      )}
    </div>
  );
}
