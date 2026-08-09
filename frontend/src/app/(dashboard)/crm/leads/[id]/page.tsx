import Link from "next/link";
import { notFound } from "next/navigation";
import { CrmApiError } from "@/features/crm/api/crm-client";
import { getLead } from "@/features/crm/api/leads";
import CrmModuleHeader from "@/features/crm/components/CrmModuleHeader";
import LeadStatusBadge from "@/features/crm/components/LeadStatusBadge";
import {
  leadDisplayId,
  leadFullName,
} from "@/features/crm/types/lead";
import { theme } from "@/styles/theme";
import LeadDetailActions from "@/features/crm/components/LeadDetailActions";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  try {
    const lead = await getLead(numericId);
    const rows: [string, string][] = [
      ["Lead ID", leadDisplayId(lead.id)],
      ["Name", leadFullName(lead)],
      ["Organization", lead.company || "—"],
      ["Email", lead.email || "—"],
      ["Phone", lead.phone || "—"],
      ["Source", lead.source || "—"],
      ["Assigned to", lead.assignedTo || "—"],
      ["Score", String(lead.leadScore ?? 0)],
      [
        "Created",
        lead.createdAt
          ? new Date(lead.createdAt).toISOString().slice(0, 10)
          : "—",
      ],
    ];

    return (
      <div>
        <CrmModuleHeader section="Lead Detail" />
        <Link
          href="/crm/leads"
          style={{
            color: "#64748b",
            fontSize: "0.85rem",
            fontWeight: 600,
          }}
        >
          ← Back to leads
        </Link>

        <div
          style={{
            marginTop: "0.75rem",
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: theme.navy,
                fontSize: "1.35rem",
                fontWeight: 800,
              }}
            >
              {lead.company || leadFullName(lead)}
            </h2>
            <div style={{ marginTop: 8 }}>
              <LeadStatusBadge status={lead.status} />
            </div>
          </div>
          <LeadDetailActions lead={lead} />
        </div>

        <div
          style={{
            marginTop: "1.1rem",
            background: "#fff",
            border: "1px solid #e8ebf1",
            borderRadius: 12,
            overflow: "hidden",
            maxWidth: 760,
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
        <strong>Could not load lead.</strong>
        <div style={{ marginTop: 6 }}>
          {err instanceof Error ? err.message : "Unknown error"}
        </div>
      </div>
    );
  }
}
