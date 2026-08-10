import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomer } from "@/features/crm/api/customers";
import { CrmApiError } from "@/features/crm/api/crm-client";
import CrmModuleHeader from "@/features/crm/components/CrmModuleHeader";
import {
  AlertBanner,
  SectionCard,
  StatusBadge,
} from "@/features/shared/components";
import { Button } from "@/features/shared/components/ui/button";

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
      ["City", customer.city || "—"],
      ["Country", customer.country || "—"],
      ["Industry", customer.industry || "—"],
      ["Website", customer.website || "—"],
    ];

    return (
      <div className="flex flex-col gap-4">
        <CrmModuleHeader section="Customer Detail" />
        <Button asChild variant="ghost" className="w-fit px-0">
          <Link href="/crm/customers">← Back to customers</Link>
        </Button>

        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-extrabold" style={{ color: "#0B1E3D" }}>
            {customer.companyName ||
              customer.contactName ||
              customer.customerNumber}
          </h2>
          <StatusBadge status={customer.status} />
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
        message={`Could not load customer. ${
          err instanceof Error ? err.message : "Unknown error"
        }`}
      />
    );
  }
}
