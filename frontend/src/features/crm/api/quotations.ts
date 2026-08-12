import { crmFetch } from "@/features/crm/api/crm-client";
import type { SpringPage } from "@/features/crm/types/customer";
import type {
  Quotation,
  QuotationCreateInput,
  QuotationStatus,
} from "@/features/crm/types/quotation";
import type { SalesOrder } from "@/features/crm/types/sales-order";

export type ListQuotationsParams = {
  q?: string;
  status?: QuotationStatus;
  customerId?: number;
  page?: number;
  size?: number;
};

export async function listQuotations(
  params: ListQuotationsParams = {},
): Promise<SpringPage<Quotation>> {
  const sp = new URLSearchParams();
  if (params.q?.trim()) sp.set("q", params.q.trim());
  if (params.status) sp.set("status", params.status);
  if (params.customerId) sp.set("customerId", String(params.customerId));
  sp.set("page", String(params.page ?? 0));
  sp.set("size", String(params.size ?? 50));
  return crmFetch<SpringPage<Quotation>>(`/api/quotations?${sp.toString()}`);
}

export async function getQuotation(id: number): Promise<Quotation> {
  return crmFetch<Quotation>(`/api/quotations/${id}`);
}

export async function createQuotation(
  input: QuotationCreateInput,
): Promise<Quotation> {
  return crmFetch<Quotation>("/api/quotations", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function changeQuotationStatus(
  id: number,
  status: QuotationStatus,
): Promise<Quotation> {
  return crmFetch<Quotation>(
    `/api/quotations/${id}/status?status=${encodeURIComponent(status)}`,
    { method: "PATCH" },
  );
}

export async function acceptQuotation(id: number): Promise<SalesOrder> {
  return crmFetch<SalesOrder>(`/api/quotations/${id}/accept`, {
    method: "PATCH",
  });
}
