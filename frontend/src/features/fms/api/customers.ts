import { fmsFetch } from "./fms-client";
import type { Customer, CreateCustomerInput, UpdateCustomerInput, ArAgingReport, CustomerStatement, PagedResponse } from "../types/fms";

export async function listCustomers(params?: { search?: string; status?: string; page?: number; size?: number }): Promise<PagedResponse<Customer>> {
  const sp = new URLSearchParams();
  if (params?.search) sp.set("search", params.search);
  if (params?.status) sp.set("status", params.status);
  sp.set("page", String(params?.page ?? 0));
  sp.set("size", String(params?.size ?? 20));
  return fmsFetch<PagedResponse<Customer>>(`/api/fms/customers?${sp.toString()}`);
}

export async function getCustomer(id: string): Promise<Customer> {
  return fmsFetch<Customer>(`/api/fms/customers/${id}`);
}

export async function createCustomer(input: CreateCustomerInput): Promise<Customer> {
  return fmsFetch<Customer>("/api/fms/customers", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateCustomer(id: string, input: UpdateCustomerInput): Promise<Customer> {
  return fmsFetch<Customer>(`/api/fms/customers/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function getArAgingReport(asOfDate?: string): Promise<ArAgingReport> {
  const sp = new URLSearchParams();
  if (asOfDate) sp.set("asOfDate", asOfDate);
  return fmsFetch<ArAgingReport>(`/api/fms/customers/reports/aging?${sp.toString()}`);
}

export async function getCustomerStatement(id: string): Promise<CustomerStatement> {
  return fmsFetch<CustomerStatement>(`/api/fms/customers/${id}/statement`);
}
