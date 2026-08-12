import { crmFetch } from "@/features/crm/api/crm-client";
import type { SpringPage } from "@/features/crm/types/customer";
import type {
  Invoice,
  InvoiceCreateInput,
  InvoiceStatus,
  InvoiceUpdateInput,
} from "@/features/crm/types/invoice";

export type ListInvoicesParams = {
  q?: string;
  status?: InvoiceStatus;
  customerId?: number;
  salesOrderId?: number;
  page?: number;
  size?: number;
};

export async function listInvoices(
  params: ListInvoicesParams = {},
): Promise<SpringPage<Invoice>> {
  const sp = new URLSearchParams();
  if (params.q?.trim()) sp.set("q", params.q.trim());
  if (params.status) sp.set("status", params.status);
  if (params.customerId) sp.set("customerId", String(params.customerId));
  if (params.salesOrderId) sp.set("salesOrderId", String(params.salesOrderId));
  sp.set("page", String(params.page ?? 0));
  sp.set("size", String(params.size ?? 50));
  return crmFetch<SpringPage<Invoice>>(`/api/invoices?${sp.toString()}`);
}

export async function getInvoice(id: number): Promise<Invoice> {
  return crmFetch<Invoice>(`/api/invoices/${id}`);
}

export async function createInvoice(
  input: InvoiceCreateInput,
): Promise<Invoice> {
  return crmFetch<Invoice>("/api/invoices", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateInvoice(
  id: number,
  input: InvoiceUpdateInput,
): Promise<Invoice> {
  return crmFetch<Invoice>(`/api/invoices/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
