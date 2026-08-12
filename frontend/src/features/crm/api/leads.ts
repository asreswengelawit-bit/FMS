import { crmFetch } from "@/features/crm/api/crm-client";
import type {
  Lead,
  LeadConvertInput,
  LeadCreateInput,
  LeadStatus,
} from "@/features/crm/types/lead";
import type { SpringPage } from "@/features/crm/types/customer";

export type ListLeadsParams = {
  q?: string;
  status?: LeadStatus;
  page?: number;
  size?: number;
};

export async function listLeads(
  params: ListLeadsParams = {},
): Promise<SpringPage<Lead>> {
  const sp = new URLSearchParams();
  if (params.q?.trim()) sp.set("q", params.q.trim());
  if (params.status) sp.set("status", params.status);
  sp.set("page", String(params.page ?? 0));
  sp.set("size", String(params.size ?? 50));
  return crmFetch<SpringPage<Lead>>(`/api/leads?${sp.toString()}`);
}

export async function getLead(id: number): Promise<Lead> {
  return crmFetch<Lead>(`/api/leads/${id}`);
}

export async function createLead(input: LeadCreateInput): Promise<Lead> {
  return crmFetch<Lead>("/api/leads", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateLeadStatus(
  id: number,
  status: LeadStatus,
): Promise<Lead> {
  return crmFetch<Lead>(
    `/api/leads/${id}/status?status=${encodeURIComponent(status)}`,
    { method: "PATCH" },
  );
}

export async function convertLead(
  id: number,
  input: LeadConvertInput = {},
): Promise<Lead> {
  return crmFetch<Lead>(`/api/leads/${id}/convert`, {
    method: "PATCH",
    body: JSON.stringify({
      conversionReason: input.conversionReason ?? "Converted from CRM UI",
      createOpportunity: input.createOpportunity ?? true,
      opportunityValue: input.opportunityValue,
      opportunityTitle: input.opportunityTitle,
    }),
  });
}
