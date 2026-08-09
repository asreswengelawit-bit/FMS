import { crmFetch } from "@/features/crm/api/crm-client";
import type { SpringPage } from "@/features/crm/types/customer";
import type { SalesOrder } from "@/features/crm/types/sales-order";

export type ListSalesOrdersParams = {
  page?: number;
  size?: number;
};

export async function listSalesOrders(
  params: ListSalesOrdersParams = {},
): Promise<SpringPage<SalesOrder>> {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page ?? 0));
  sp.set("size", String(params.size ?? 50));
  return crmFetch<SpringPage<SalesOrder>>(
    `/api/sales-orders?${sp.toString()}`,
  );
}

export async function getSalesOrder(id: number): Promise<SalesOrder> {
  return crmFetch<SalesOrder>(`/api/sales-orders/${id}`);
}

export async function confirmSalesOrder(id: number): Promise<SalesOrder> {
  return crmFetch<SalesOrder>(`/api/sales-orders/${id}/confirm`, {
    method: "PATCH",
  });
}
