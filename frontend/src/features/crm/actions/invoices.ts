"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CrmApiError } from "@/features/crm/api/crm-client";
import {
  createInvoice,
  updateInvoice,
} from "@/features/crm/api/invoices";
import type { InvoiceStatus } from "@/features/crm/types/invoice";

export type InvoiceActionState = {
  ok: boolean;
  message?: string;
};

export async function createInvoiceFromOrderAction(
  salesOrderId: number,
  customerId: number,
): Promise<InvoiceActionState> {
  let invoiceId: number | null = null;

  try {
    const today = new Date().toISOString().slice(0, 10);
    const due = new Date();
    due.setDate(due.getDate() + 30);
    const created = await createInvoice({
      salesOrderId,
      customerId,
      invoiceDate: today,
      dueDate: due.toISOString().slice(0, 10),
      currency: "ETB",
    });
    invoiceId = created.id;
  } catch (err) {
    if (err instanceof CrmApiError) {
      return { ok: false, message: err.message };
    }
    return { ok: false, message: "Could not create invoice." };
  }

  revalidatePath("/crm/invoices");
  revalidatePath("/crm/sales-orders");
  revalidatePath(`/crm/sales-orders/${salesOrderId}`);

  if (invoiceId) {
    redirect(`/crm/invoices/${invoiceId}?created=1`);
  }
  return { ok: true };
}

export async function sendInvoiceAction(
  id: number,
): Promise<InvoiceActionState> {
  try {
    await updateInvoice(id, { status: "SENT" satisfies InvoiceStatus });
    revalidatePath("/crm/invoices");
    revalidatePath(`/crm/invoices/${id}`);
    return { ok: true };
  } catch (err) {
    if (err instanceof CrmApiError) {
      return { ok: false, message: err.message };
    }
    return { ok: false, message: "Could not send invoice." };
  }
}

export async function markInvoicePaidAction(
  id: number,
  totalAmount: number,
): Promise<InvoiceActionState> {
  try {
    await updateInvoice(id, { paidAmount: totalAmount });
    revalidatePath("/crm/invoices");
    revalidatePath(`/crm/invoices/${id}`);
    return { ok: true };
  } catch (err) {
    if (err instanceof CrmApiError) {
      return { ok: false, message: err.message };
    }
    return { ok: false, message: "Could not mark invoice as paid." };
  }
}
