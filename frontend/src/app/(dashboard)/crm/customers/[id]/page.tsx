import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomer } from "@/features/crm/api/customers";
import { CrmApiError } from "@/features/crm/api/crm-client";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  try {
    const customer = await getCustomer(numericId);
    const rows: [string, string][] = [
      ["Customer number", customer.customerNumber],
      ["Organization", customer.companyName || "—"],
      ["Contact", customer.contactName || "—"],
      ["Email", customer.email],
      ["Phone", customer.phone || "—"],
      ["Type", customer.customerType],
      ["Status", customer.status],
      ["City", customer.city || "—"],
      ["Country", customer.country || "—"],
      ["Industry", customer.industry || "—"],
      ["Website", customer.website || "—"],
    ];

    return (
      <div>
        <Link
          href="/crm/customers"
          style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}
        >
          ← Back to customers
        </Link>
        <h1 style={{ margin: "0.5rem 0 0", color: "#0a1f44", fontSize: "1.45rem" }}>
          {customer.companyName || customer.contactName || customer.customerNumber}
        </h1>
        <p style={{ margin: "0.35rem 0 1.25rem", color: "#6b7280", fontSize: "0.92rem" }}>
          Customer detail
        </p>

        <div
          style={{
            background: "#fff",
            border: "1px solid #e8ebf1",
            borderRadius: 12,
            overflow: "hidden",
            maxWidth: 720,
          }}
        >
          {rows.map(([label, value]) => (
            <div
              key={label}
              style={{
                display: "grid",
                gridTemplateColumns: "180px 1fr",
                gap: "1rem",
                padding: "0.85rem 1.1rem",
                borderBottom: "1px solid #eef1f6",
                fontSize: "0.92rem",
              }}
            >
              <span style={{ color: "#64748b", fontWeight: 600 }}>{label}</span>
              <span style={{ color: "#0f172a" }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (err) {
    if (err instanceof CrmApiError && err.status === 404) notFound();
    return (
      <div
        style={{
          background: "#fff7ed",
          border: "1px solid #fed7aa",
          color: "#9a3412",
          borderRadius: 12,
          padding: "1rem 1.1rem",
        }}
      >
        <strong>Could not load customer.</strong>
        <div style={{ marginTop: 6 }}>
          {err instanceof Error ? err.message : "Unknown error"}
        </div>
      </div>
    );
  }
}
