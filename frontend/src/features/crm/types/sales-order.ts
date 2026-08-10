export type OrderStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED";

export type OrderType = "STANDARD" | "SERVICE" | "SUBSCRIPTION" | string;

export type OrderItem = {
  id?: number;
  itemName: string | null;
  sku: string | null;
  description: string | null;
  quantity: number | null;
  unitPrice: number | null;
  totalPrice?: number | null;
};

export type SalesOrder = {
  id: number;
  orderNumber: string;
  customerId: number;
  opportunityId: number | null;
  quotationId: number | null;
  status: OrderStatus;
  type: OrderType | null;
  orderDate: string | null;
  deliveryDate: string | null;
  subtotal: number | null;
  taxAmount: number | null;
  discountAmount: number | null;
  totalAmount: number | null;
  currency: string | null;
  notes: string | null;
  items: OrderItem[] | null;
  createdAt: string | null;
  updatedAt: string | null;
};
