/** FMS sidebar links — Team 5 owns this file. Matches Figma FMS nav order. */
export const FMS_NAV = [
  { label: "Chart of Accounts", path: "/fms/chart-of-accounts" },
  { label: "General Ledger", path: "/fms/journals" },
  { label: "Accounting Periods", path: "/fms/periods" },
  { label: "Budgets", path: "/fms/budgets" },
  { label: "Invoices", path: "/fms/invoices" },
  { label: "Payments", path: "/fms/payments" },
  { label: "Vendors", path: "/fms/vendors" },
  { label: "Customers", path: "/fms/customers" },
  { label: "Bank Accounts", path: "/fms/bank-accounts" },
  { label: "Reports", path: "/fms/reports" },
  { label: "Audit Logs", path: "/fms/audit" },
] as const;

/** In-page FMS tabs. */
export const FMS_TABS = FMS_NAV;
