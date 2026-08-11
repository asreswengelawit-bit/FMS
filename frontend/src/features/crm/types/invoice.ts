export type InvoiceStatus =
  | "DRAFT"
  | "PENDING"
  | "SENT"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED";

export type Invoice = {
  id: number;
  invoiceNumber: string;
  salesOrderId: number | null;
  customerId: number;
  status: InvoiceStatus;
  invoiceDate: string | null;
  dueDate: string | null;
  subtotal: number | null;
  taxAmount: number | null;
  discountAmount: number | null;
  totalAmount: number | null;
  paidAmount: number | null;
  balanceAmount: number | null;
  currency: string | null;
  notes: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type InvoiceCreateInput = {
  salesOrderId: number;
  customerId: number;
  invoiceDate?: string;
  dueDate?: string;
  taxAmount?: number;
  discountAmount?: number;
  currency?: string;
  notes?: string;
};

export type InvoiceUpdateInput = {
  status?: InvoiceStatus;
  dueDate?: string;
  paidAmount?: number;
  notes?: string;
};
