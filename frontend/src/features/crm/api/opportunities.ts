import { crmFetch } from "@/features/crm/api/crm-client";
import type { SpringPage } from "@/features/crm/types/customer";
import type { Opportunity } from "@/features/crm/types/opportunity";

export async function listOpportunities(
  page = 0,
  size = 100,
): Promise<SpringPage<Opportunity>> {
  const sp = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  return crmFetch<SpringPage<Opportunity>>(
    `/api/opportunities?${sp.toString()}`,
  );
}
