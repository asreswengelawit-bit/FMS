export type QuotationStatus =
  | "DRAFT"
  | "SENT"
  | "ACCEPTED"
  | "REJECTED"
  | "EXPIRED"
  | "CANCELLED";

export type QuotationItem = {
  id?: number;
  itemName: string | null;
  sku: string | null;
  description: string | null;
  quantity: number | null;
  unitPrice: number | null;
  totalPrice?: number | null;
};

export type Quotation = {
  id: number;
  quotationNumber: string;
  customerId: number;
  opportunityId: number;
  issueDate: string;
  expiryDate: string;
  subtotal: number | null;
  discount: number | null;
  tax: number | null;
  totalAmount: number | null;
  status: QuotationStatus;
  notes: string | null;
  active: boolean | null;
  salesOrderId: number | null;
  items: QuotationItem[] | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type QuotationCreateInput = {
  customerId: number;
  opportunityId: number;
  issueDate: string;
  expiryDate: string;
  notes?: string;
  applyPricingRules?: boolean;
  items: Array<{
    itemName: string;
    sku?: string;
    description?: string;
    quantity: number;
    unitPrice: number;
  }>;
};
