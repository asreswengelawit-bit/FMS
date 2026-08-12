import { crmFetch } from "@/features/crm/api/crm-client";
import type {
  Customer,
  CustomerCreateInput,
  SpringPage,
} from "@/features/crm/types/customer";

export type ListCustomersParams = {
  q?: string;
  page?: number;
  size?: number;
};

export async function listCustomers(
  params: ListCustomersParams = {},
): Promise<SpringPage<Customer>> {
  const sp = new URLSearchParams();
  if (params.q?.trim()) sp.set("q", params.q.trim());
  sp.set("page", String(params.page ?? 0));
  sp.set("size", String(params.size ?? 20));
  return crmFetch<SpringPage<Customer>>(`/api/customers?${sp.toString()}`);
}

export async function getCustomer(id: number): Promise<Customer> {
  return crmFetch<Customer>(`/api/customers/${id}`);
}

export async function createCustomer(
  input: CustomerCreateInput,
): Promise<Customer> {
  return crmFetch<Customer>("/api/customers", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
