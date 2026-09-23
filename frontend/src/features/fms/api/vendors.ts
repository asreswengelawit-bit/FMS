import { fmsFetch } from "./fms-client";
import type { Vendor, CreateVendorInput, UpdateVendorInput, ApAgingReport, VendorStatement, PagedResponse, VendorStatus } from "../types/fms";

function fromApi(v: any): Vendor {
  return {
    id: v.id,
    vendorCode: v.vendorCode,
    name: v.vendorName ?? v.name ?? "",
    taxId: v.taxId ?? null,
    email: v.email ?? null,
    phone: v.phoneNumber ?? v.phone ?? null,
    address: v.address ?? null,
    paymentTerms: v.paymentTerms ?? "NET_30",
    defaultApAccountId: v.defaultApAccountId ?? null,
    defaultApAccountCode: v.defaultApAccountCode ?? null,
    defaultApAccountName: v.defaultApAccountName ?? null,
    status: (v.status ?? "ACTIVE") as VendorStatus,
    apBalance: v.apBalance ?? 0,
    createdBy: v.createdBy ?? "",
    createdAt: v.createdAt,
    updatedAt: v.updatedAt ?? null,
  };
}

function toCreateApi(input: CreateVendorInput) {
  return {
    vendorCode: input.vendorCode,
    vendorName: input.name.trim(),
    email: input.email?.trim() || null,
    phoneNumber: input.phone?.trim() || null,
    address: input.address?.trim() || null,
    taxId: input.taxId?.trim() || null,
  };
}

function toUpdateApi(input: UpdateVendorInput) {
  return {
    vendorCode: input.vendorCode,
    vendorName: input.name.trim(),
    email: input.email?.trim() || null,
    phoneNumber: input.phone?.trim() || null,
    address: input.address?.trim() || null,
    taxId: input.taxId?.trim() || null,
  };
}

export async function listVendors(params?: { search?: string; status?: string; page?: number; size?: number }): Promise<PagedResponse<Vendor>> {
  const sp = new URLSearchParams();
  if (params?.search) sp.set("search", params.search);
  if (params?.status) sp.set("status", params.status);
  sp.set("page", String(params?.page ?? 0));
  sp.set("size", String(params?.size ?? 20));
  const res = await fmsFetch<PagedResponse<any>>(`/api/fms/vendors?${sp.toString()}`);
  return { ...res, content: (res.content ?? []).map(fromApi) };
}

export async function getVendor(id: string): Promise<Vendor> {
  return fromApi(await fmsFetch<any>(`/api/fms/vendors/${id}`));
}

export async function createVendor(input: CreateVendorInput): Promise<Vendor> {
  const res = await fmsFetch<any>("/api/fms/vendors", {
    method: "POST",
    body: JSON.stringify(toCreateApi(input)),
  });
  return fromApi(res);
}

export async function updateVendor(id: string, input: UpdateVendorInput): Promise<Vendor> {
  const res = await fmsFetch<any>(`/api/fms/vendors/${id}`, {
    method: "PUT",
    body: JSON.stringify(toUpdateApi(input)),
  });
  return fromApi(res);
}

export async function getApAgingReport(asOfDate?: string): Promise<ApAgingReport> {
  const sp = new URLSearchParams();
  if (asOfDate) sp.set("asOfDate", asOfDate);
  return fmsFetch<ApAgingReport>(`/api/fms/vendors/reports/aging?${sp.toString()}`);
}

export async function getVendorStatement(id: string): Promise<VendorStatement> {
  return fmsFetch<VendorStatement>(`/api/fms/vendors/${id}/statement`);
}
