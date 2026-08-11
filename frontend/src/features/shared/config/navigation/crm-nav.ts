/** CRM sidebar links — Team 4 owns this file only. Matches Figma CRM nav order. */
export const CRM_NAV = [
  { label: "Leads", path: "/crm/leads" },
  { label: "Quotations", path: "/crm/quotations" },
  { label: "Sales Orders", path: "/crm/sales-orders" },
  { label: "Invoices", path: "/crm/invoices" },
  { label: "Customers", path: "/crm/customers" },
] as const;

/** In-page CRM tabs (Figma sub-nav under module title). */
export const CRM_TABS = [
  { label: "Leads", path: "/crm/leads" },
  { label: "Quotations", path: "/crm/quotations" },
  { label: "Sales Orders", path: "/crm/sales-orders" },
  { label: "Invoices", path: "/crm/invoices" },
  { label: "Customers", path: "/crm/customers" },
] as const;
