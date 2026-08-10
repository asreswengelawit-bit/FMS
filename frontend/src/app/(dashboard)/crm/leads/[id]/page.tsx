import Link from "next/link";
import { notFound } from "next/navigation";
import { CrmApiError } from "@/features/crm/api/crm-client";
import { getLead } from "@/features/crm/api/leads";
import CrmModuleHeader from "@/features/crm/components/CrmModuleHeader";
import LeadDetailActions from "@/features/crm/components/LeadDetailActions";
import {
  leadDisplayId,
  leadFullName,
} from "@/features/crm/types/lead";
import {
  AlertBanner,
  SectionCard,
  StatusBadge,
} from "@/features/shared/components";
import { Button } from "@/features/shared/components/ui/button";

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
      <div className="flex flex-col gap-4">
        <CrmModuleHeader section="Lead Detail" />
        <Button asChild variant="ghost" className="w-fit px-0">
          <Link href="/crm/leads">← Back to leads</Link>
        </Button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-extrabold" style={{ color: "#0B1E3D" }}>
              {lead.company || leadFullName(lead)}
            </h2>
            <StatusBadge status={lead.status} />
          </div>
          <LeadDetailActions lead={lead} />
        </div>

        <SectionCard title="Details">
          <div className="flex flex-col">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[180px_1fr] gap-4 border-b border-border py-3 text-sm last:border-b-0"
              >
                <span className="font-semibold text-muted-foreground">
                  {label}
                </span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    );
  } catch (err) {
    if (err instanceof CrmApiError && err.status === 404) notFound();
    return (
      <AlertBanner
        type="warning"
        message={`Could not load lead. ${
          err instanceof Error ? err.message : "Unknown error"
        }`}
      />
    );
  }
}
