import type { MaterialItem, Requisition, StockMovement, Supplier, Warehouse } from "../types";

const API_URL = process.env.NEXT_PUBLIC_MMS_API_URL?.replace(/\/$/, "");

async function accessToken(): Promise<string | null> {
  const stored = typeof window !== "undefined"
    ? sessionStorage.getItem("erp_access_token")
    : null;
  if (stored) return stored;

  // Credentials sign-in uses an Auth.js HTTP-only session cookie. The cookie
  // cannot be read by client code, so ask Auth.js for the session's access
  // token before making a protected MMS request.
  if (typeof window === "undefined") return null;
  const response = await fetch("/api/auth/session", { credentials: "same-origin" });
  if (!response.ok) return null;
  const session = await response.json() as { accessToken?: string };
  return session.accessToken ?? null;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_URL) throw new Error("NEXT_PUBLIC_MMS_API_URL is not configured");
  const token = await accessToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init?.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(body?.message ?? `Request failed with status ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const mmsApi = {
  listItems: () => request<MaterialItem[]>("/api/v1/materials"),
  createItem: (item: MaterialItem) => request<MaterialItem>("/api/v1/materials", { method: "POST", body: JSON.stringify({ id: item.id, name: item.name, category: item.category, unitOfMeasure: item.uom, unitCost: item.unitCost, reorderLevel: item.reorderLevel, warehouse: item.warehouse }) }),
  updateItem: (item: MaterialItem) => request<MaterialItem>(`/api/v1/materials/${item.id}`, { method: "PUT", body: JSON.stringify({ name: item.name, category: item.category, unitOfMeasure: item.uom, unitCost: item.unitCost, reorderLevel: item.reorderLevel }) }),
  listWarehouses: () => request<Warehouse[]>("/api/v1/warehouses"),
  createWarehouse: (warehouse: Warehouse) => request<Warehouse>("/api/v1/warehouses", { method: "POST", body: JSON.stringify({ id: warehouse.id, name: warehouse.name, location: warehouse.location, type: warehouse.type, capacity: warehouse.capacity, manager: warehouse.manager }) }),
  adjustInventory: (movement: StockMovement) => request<StockMovement>("/api/v1/inventory/adjust", { method: "POST", body: JSON.stringify({ warehouseId: movement.warehouse, materialId: movement.item, quantity: movement.qty, referenceNumber: movement.ref, notes: movement.note }) }),
  listMovements: () => request<StockMovement[]>("/api/v1/inventory/movements"),
  receiveOrder: (orderId: string, movement: StockMovement) => request<StockMovement>(`/api/v1/orders/${orderId}/receive`, { method: "POST", body: JSON.stringify(movement) }),
  listRequisitions: () => request<Requisition[]>("/api/v1/requisitions"),
  listSuppliers: () => request<Supplier[]>("/api/v1/suppliers"),
  createSupplier: (supplier: Supplier) => request<Supplier>("/api/v1/suppliers", { method: "POST", body: JSON.stringify(supplier) }),
  updateSupplier: (supplier: Supplier) => request<Supplier>(`/api/v1/suppliers/${supplier.id}`, { method: "PUT", body: JSON.stringify({ name: supplier.name, contactPerson: supplier.contactPerson, email: supplier.email, phoneNumber: supplier.phoneNumber, address: supplier.address, status: supplier.status }) }),
  deleteSupplier: (id: string) => request<void>(`/api/v1/suppliers/${id}`, { method: "DELETE" }),
  createRequisition: (requisition: Requisition) => request<Requisition>("/api/v1/requisitions", { method: "POST", body: JSON.stringify({ requestedBy: requisition.requestedBy, department: requisition.department, materialId: requisition.item, quantity: requisition.qty, requiredDate: requisition.date, priority: requisition.priority }) }),
  issueRequisition: (id: string) => request<Requisition>(`/api/v1/requisitions/${id}/issue`, { method: "POST" }),
  createGoodsReceipt: (receipt: { ref: string; item: string; qty: number; warehouse: string; date: string; by: string }) => request<any>("/api/v1/goods-receipts", { method: "POST", body: JSON.stringify({ poRef: receipt.ref, warehouseId: receipt.warehouse, lines: [{ materialId: receipt.item, quantity: receipt.qty }] }) }),
};
