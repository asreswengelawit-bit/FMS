import { fmsFetch } from "./fms-client";
import type { Payment, ProcessPaymentInput, PagedResponse } from "../types/fms";

export async function listPayments(): Promise<PagedResponse<Payment>> {
  return fmsFetch<PagedResponse<Payment>>("/api/fms/payments?page=0&size=50");
}

export async function processPayment(input: ProcessPaymentInput): Promise<Payment> {
  return fmsFetch<Payment>("/api/fms/payments", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
