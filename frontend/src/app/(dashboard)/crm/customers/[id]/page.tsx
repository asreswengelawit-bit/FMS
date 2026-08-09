import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomer } from "@/features/crm/api/customers";
import { CrmApiError } from "@/features/crm/api/crm-client";
import CrmModuleHeader from "@/features/crm/components/CrmModuleHeader";
import { theme } from "@/styles/theme";

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
        <CrmModuleHeader section="Customer Detail" />
        <Link
          href="/crm/customers"
          style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}
        >
          ← Back to customers
        </Link>
        <h2
          style={{
            margin: "0.6rem 0 1rem",
            color: theme.navy,
            fontSize: "1.35rem",
            fontWeight: 800,
          }}
        >
          {customer.companyName ||
            customer.contactName ||
            customer.customerNumber}
        </h2>

        <div
          style={{
            background: "#fff",
            border: "1px solid #e8ebf1",
            borderRadius: 12,
            overflow: "hidden",
            maxWidth: 720,
            boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
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
