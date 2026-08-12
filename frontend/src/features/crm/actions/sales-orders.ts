"use server";

import { revalidatePath } from "next/cache";
import { CrmApiError } from "@/features/crm/api/crm-client";
import { confirmSalesOrder } from "@/features/crm/api/sales-orders";

export type SalesOrderActionState = {
  ok: boolean;
  message?: string;
};

export async function confirmSalesOrderAction(
  id: number,
): Promise<SalesOrderActionState> {
  try {
    await confirmSalesOrder(id);
    revalidatePath("/crm/sales-orders");
    revalidatePath(`/crm/sales-orders/${id}`);
    return { ok: true };
  } catch (err) {
    if (err instanceof CrmApiError) {
      return { ok: false, message: err.message };
    }
    return { ok: false, message: "Could not confirm sales order." };
  }
}
