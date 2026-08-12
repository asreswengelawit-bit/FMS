"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CrmApiError } from "@/features/crm/api/crm-client";
import {
  acceptQuotation,
  changeQuotationStatus,
  createQuotation,
} from "@/features/crm/api/quotations";
import type { QuotationStatus } from "@/features/crm/types/quotation";

export type QuotationActionState = {
  ok: boolean;
  message?: string;
};

function required(formData: FormData, key: string): string {
  const value = String(formData.get(key) ?? "").trim();
  if (!value) throw new Error(`${key} is required`);
  return value;
}

function optional(formData: FormData, key: string): string | undefined {
  const value = String(formData.get(key) ?? "").trim();
  return value || undefined;
}

export async function createQuotationAction(
  _prev: QuotationActionState,
  formData: FormData,
): Promise<QuotationActionState> {
  let createdId: number;

  try {
    const itemNames = formData.getAll("itemName").map(String);
    const quantities = formData.getAll("quantity").map(String);
    const unitPrices = formData.getAll("unitPrice").map(String);
    const skus = formData.getAll("sku").map(String);
    const descriptions = formData.getAll("description").map(String);

    const items = itemNames
      .map((name, i) => ({
        itemName: name.trim(),
        sku: skus[i]?.trim() || undefined,
        description: descriptions[i]?.trim() || undefined,
        quantity: Number(quantities[i] || 0),
        unitPrice: Number(unitPrices[i] || 0),
      }))
      .filter((item) => item.itemName && item.quantity > 0);

    if (items.length === 0) {
      return { ok: false, message: "Add at least one line item." };
    }

    const created = await createQuotation({
      customerId: Number(required(formData, "customerId")),
      opportunityId: Number(required(formData, "opportunityId")),
      issueDate: required(formData, "issueDate"),
      expiryDate: required(formData, "expiryDate"),
      notes: optional(formData, "notes"),
      applyPricingRules: false,
      items,
    });
    createdId = created.id;
  } catch (err) {
    if (err instanceof CrmApiError) {
      return { ok: false, message: err.message };
    }
    return {
      ok: false,
      message:
        err instanceof Error ? err.message : "Could not create quotation.",
    };
  }

  revalidatePath("/crm/quotations");
  revalidatePath("/crm/sales-orders");
  redirect(`/crm/quotations/${createdId}`);
}

export async function sendQuotationAction(
  id: number,
): Promise<QuotationActionState> {
  try {
    await changeQuotationStatus(id, "SENT" satisfies QuotationStatus);
    revalidatePath("/crm/quotations");
    revalidatePath(`/crm/quotations/${id}`);
    return { ok: true };
  } catch (err) {
    if (err instanceof CrmApiError) {
      return { ok: false, message: err.message };
    }
    return { ok: false, message: "Could not send quotation." };
  }
}

export async function acceptQuotationAction(
  id: number,
): Promise<QuotationActionState> {
  let orderId: number | null = null;

  try {
    const order = await acceptQuotation(id);
    orderId = order.id;
  } catch (err) {
    if (err instanceof CrmApiError) {
      return { ok: false, message: err.message };
    }
    return { ok: false, message: "Could not accept quotation." };
  }

  revalidatePath("/crm/quotations");
  revalidatePath("/crm/sales-orders");
  revalidatePath(`/crm/quotations/${id}`);

  if (orderId) {
    redirect(`/crm/sales-orders/${orderId}?created=1`);
  }
  return { ok: true };
}
