export type ItemStatus = "Normal" | "Low Stock" | "Out of Stock";

export interface MaterialItem {
  id: string; name: string; category: string; uom: string; onHand: number;
  reserved: number; reorderLevel: number; unitCost: number; warehouse: string; status: ItemStatus;
}

export interface Warehouse {
  id: string; name: string; location: string; capacity: number; used: number;
  items: number; manager: string; type: "General" | "Cold Chain";
}

export interface StockMovement {
  id: string; type: "GR" | "GI" | "TR" | "ADJ"; item: string; qty: number;
  warehouse: string; ref: string; date: string; by: string; note: string;
}

export interface Requisition {
  id: string; requestedBy: string; department: string; item: string; qty: number;
  date: string; status: "Issued" | "Pending" | "Rejected"; priority: "Normal" | "High" | "Urgent";
}

export interface MmsData {
  items: MaterialItem[];
  warehouses: Warehouse[];
  movements: StockMovement[];
  requisitions: Requisition[];
}

export type MmsRole = "inventory_manager" | "store_keeper" | "viewer";

export interface MmsUser {
  id: string;
  name: string;
  role: MmsRole;
  permissions: Array<"mms:read" | "mms:write" | "mms:approve" | "mms:export">;
}
