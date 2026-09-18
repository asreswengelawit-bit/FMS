import { fmsFetch } from "./fms-client";
import type { Invoice, CreateInvoiceInput, PagedResponse } from "../types/fms";

export async function listInvoices(): Promise<PagedResponse<Invoice>> {
  return fmsFetch<PagedResponse<Invoice>>("/api/fms/invoices?page=0&size=50");
}

export async function createInvoice(input: CreateInvoiceInput): Promise<Invoice> {
  return fmsFetch<Invoice>("/api/fms/invoices", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function submitInvoice(id: string): Promise<Invoice> {
  return fmsFetch<Invoice>(`/api/fms/invoices/${id}/submit`, {
    method: "POST",
  });
}

export async function approveInvoice(id: string): Promise<Invoice> {
  return fmsFetch<Invoice>(`/api/fms/invoices/${id}/approve`, {
    method: "POST",
  });
}

export async function postInvoice(id: string): Promise<Invoice> {
  return fmsFetch<Invoice>(`/api/fms/invoices/${id}/post`, {
    method: "POST",
  });
}
