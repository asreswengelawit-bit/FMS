import { fmsFetch } from "./fms-client";
import type { Vendor, CreateVendorInput, UpdateVendorInput, ApAgingReport, VendorStatement, PagedResponse } from "../types/fms";

export async function listVendors(params?: { search?: string; status?: string; page?: number; size?: number }): Promise<PagedResponse<Vendor>> {
  const sp = new URLSearchParams();
  if (params?.search) sp.set("search", params.search);
  if (params?.status) sp.set("status", params.status);
  sp.set("page", String(params?.page ?? 0));
  sp.set("size", String(params?.size ?? 20));
  return fmsFetch<PagedResponse<Vendor>>(`/api/fms/vendors?${sp.toString()}`);
}

export async function getVendor(id: string): Promise<Vendor> {
  return fmsFetch<Vendor>(`/api/fms/vendors/${id}`);
}

export async function createVendor(input: CreateVendorInput): Promise<Vendor> {
  return fmsFetch<Vendor>("/api/fms/vendors", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateVendor(id: string, input: UpdateVendorInput): Promise<Vendor> {
  return fmsFetch<Vendor>(`/api/fms/vendors/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function getApAgingReport(asOfDate?: string): Promise<ApAgingReport> {
  const sp = new URLSearchParams();
  if (asOfDate) sp.set("asOfDate", asOfDate);
  return fmsFetch<ApAgingReport>(`/api/fms/vendors/reports/aging?${sp.toString()}`);
}

export async function getVendorStatement(id: string): Promise<VendorStatement> {
  return fmsFetch<VendorStatement>(`/api/fms/vendors/${id}/statement`);
}
