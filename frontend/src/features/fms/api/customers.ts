import { fmsFetch } from "./fms-client";
import type { Customer, CreateCustomerInput, UpdateCustomerInput, ArAgingReport, CustomerStatement, PagedResponse, CustomerStatus } from "../types/fms";

function fromApi(v: any): Customer {
  return {
    id: v.id,
    customerCode: v.customerCode,
    name: v.customerName ?? v.name ?? "",
    taxId: v.taxId ?? null,
    email: v.email ?? null,
    phone: v.phoneNumber ?? v.phone ?? null,
    address: v.address ?? null,
    creditLimit: v.creditLimit ?? null,
    paymentTerms: v.paymentTerms ?? "NET_30",
    defaultArAccountId: v.defaultArAccountId ?? null,
    defaultArAccountCode: v.defaultArAccountCode ?? null,
    defaultArAccountName: v.defaultArAccountName ?? null,
    arBalance: v.arBalance ?? 0,
    status: (v.status ?? "ACTIVE") as CustomerStatus,
    createdBy: v.createdBy ?? "",
    createdAt: v.createdAt,
    updatedAt: v.updatedAt ?? null,
  };
}

function toCreateApi(input: CreateCustomerInput) {
  return {
    customerCode: input.customerCode,
    customerName: input.name.trim(),
    email: input.email?.trim() || null,
    phoneNumber: input.phone?.trim() || null,
    address: input.address?.trim() || null,
    taxId: input.taxId?.trim() || null,
  };
}

function toUpdateApi(input: UpdateCustomerInput) {
  return {
    customerCode: input.customerCode,
    customerName: input.name.trim(),
    email: input.email?.trim() || null,
    phoneNumber: input.phone?.trim() || null,
    address: input.address?.trim() || null,
    taxId: input.taxId?.trim() || null,
  };
}

export async function listCustomers(params?: { search?: string; status?: string; page?: number; size?: number }): Promise<PagedResponse<Customer>> {
  const sp = new URLSearchParams();
  if (params?.search) sp.set("search", params.search);
  if (params?.status) sp.set("status", params.status);
  sp.set("page", String(params?.page ?? 0));
  sp.set("size", String(params?.size ?? 20));
  const res = await fmsFetch<PagedResponse<any>>(`/api/fms/customers?${sp.toString()}`);
  return { ...res, content: (res.content ?? []).map(fromApi) };
}

export async function getCustomer(id: string): Promise<Customer> {
  return fromApi(await fmsFetch<any>(`/api/fms/customers/${id}`));
}

export async function createCustomer(input: CreateCustomerInput): Promise<Customer> {
  const res = await fmsFetch<any>("/api/fms/customers", {
    method: "POST",
    body: JSON.stringify(toCreateApi(input)),
  });
  return fromApi(res);
}

export async function updateCustomer(id: string, input: UpdateCustomerInput): Promise<Customer> {
  const res = await fmsFetch<any>(`/api/fms/customers/${id}`, {
    method: "PUT",
    body: JSON.stringify(toUpdateApi(input)),
  });
  return fromApi(res);
}

export async function getArAgingReport(asOfDate?: string): Promise<ArAgingReport> {
  const sp = new URLSearchParams();
  if (asOfDate) sp.set("asOfDate", asOfDate);
  return fmsFetch<ArAgingReport>(`/api/fms/customers/reports/aging?${sp.toString()}`);
}

export async function getCustomerStatement(id: string): Promise<CustomerStatement> {
  return fmsFetch<CustomerStatement>(`/api/fms/customers/${id}/statement`);
}
