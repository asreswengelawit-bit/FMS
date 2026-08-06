// ── Chart of Accounts ────────────────────────────────────────────────────────
export const accounts = [
  { code: "1000", name: "Cash and Cash Equivalents",     type: "Asset",    balance: 8450000,  normalBal: "Debit",  status: "Active", postingAllowed: true  },
  { code: "1100", name: "Accounts Receivable",           type: "Asset",    balance: 2090000,  normalBal: "Debit",  status: "Active", postingAllowed: true  },
  { code: "1200", name: "Inventory — Materials",         type: "Asset",    balance: 12400000, normalBal: "Debit",  status: "Active", postingAllowed: true  },
  { code: "1300", name: "Prepaid Expenses",              type: "Asset",    balance: 320000,   normalBal: "Debit",  status: "Active", postingAllowed: true  },
  { code: "1500", name: "Fixed Assets — Equipment",      type: "Asset",    balance: 35600000, normalBal: "Debit",  status: "Active", postingAllowed: false },
  { code: "1510", name: "Accum. Depreciation — Equip.",  type: "Asset",    balance: -8400000, normalBal: "Credit", status: "Active", postingAllowed: true  },
  { code: "2000", name: "Accounts Payable",              type: "Liability",balance: 4200000,  normalBal: "Credit", status: "Active", postingAllowed: true  },
  { code: "2100", name: "Accrued Liabilities",           type: "Liability",balance: 1850000,  normalBal: "Credit", status: "Active", postingAllowed: true  },
  { code: "2200", name: "Payroll Payable",               type: "Liability",balance: 320000,   normalBal: "Credit", status: "Active", postingAllowed: true  },
  { code: "2500", name: "Long-Term Loans",               type: "Liability",balance: 12000000, normalBal: "Credit", status: "Active", postingAllowed: false },
  { code: "3000", name: "Government Capital Fund",       type: "Equity",   balance: 28500000, normalBal: "Credit", status: "Active", postingAllowed: false },
  { code: "3100", name: "Retained Surplus",              type: "Equity",   balance: 7800000,  normalBal: "Credit", status: "Active", postingAllowed: true  },
  { code: "4000", name: "Service Revenue",               type: "Revenue",  balance: 8680000,  normalBal: "Credit", status: "Active", postingAllowed: true  },
  { code: "4100", name: "Training & Licensing Revenue",  type: "Revenue",  balance: 1250000,  normalBal: "Credit", status: "Active", postingAllowed: true  },
  { code: "5000", name: "Salaries & Benefits",           type: "Expense",  balance: 4218500,  normalBal: "Debit",  status: "Active", postingAllowed: true  },
  { code: "5100", name: "Procurement & Supply Expense",  type: "Expense",  balance: 4852000,  normalBal: "Debit",  status: "Active", postingAllowed: true  },
  { code: "5200", name: "Utilities & Maintenance",       type: "Expense",  balance: 890000,   normalBal: "Debit",  status: "Active", postingAllowed: true  },
  { code: "5300", name: "Depreciation — Equipment",      type: "Expense",  balance: 2240000,  normalBal: "Debit",  status: "Active", postingAllowed: true  },
  { code: "6100", name: "Recoverable Tax",               type: "Asset",    balance: 145000,   normalBal: "Debit",  status: "Active", postingAllowed: true  },
  { code: "6200", name: "Output Tax Payable",            type: "Liability",balance: 280000,   normalBal: "Credit", status: "Active", postingAllowed: true  },
]

// ── Accounting Periods ────────────────────────────────────────────────────────
export const accountingPeriods = [
  { id: "PER-2025-01", name: "January 2025",   fiscalYear: "FY2025", startDate: "2025-01-01", endDate: "2025-01-31", status: "Closed",      closedBy: "Abebe Girma",   closedAt: "2025-02-05" },
  { id: "PER-2025-02", name: "February 2025",  fiscalYear: "FY2025", startDate: "2025-02-01", endDate: "2025-02-28", status: "Closed",      closedBy: "Abebe Girma",   closedAt: "2025-03-04" },
  { id: "PER-2025-03", name: "March 2025",     fiscalYear: "FY2025", startDate: "2025-03-01", endDate: "2025-03-31", status: "Closed",      closedBy: "Abebe Girma",   closedAt: "2025-04-03" },
  { id: "PER-2025-04", name: "April 2025",     fiscalYear: "FY2025", startDate: "2025-04-01", endDate: "2025-04-30", status: "Closed",      closedBy: "Tigist Bekele", closedAt: "2025-05-02" },
  { id: "PER-2025-05", name: "May 2025",       fiscalYear: "FY2025", startDate: "2025-05-01", endDate: "2025-05-31", status: "Closed",      closedBy: "Tigist Bekele", closedAt: "2025-06-04" },
  { id: "PER-2025-06", name: "June 2025",      fiscalYear: "FY2025", startDate: "2025-06-01", endDate: "2025-06-30", status: "Soft Closed", closedBy: "Tigist Bekele", closedAt: "2025-07-02" },
  { id: "PER-2025-07", name: "July 2025",      fiscalYear: "FY2025", startDate: "2025-07-01", endDate: "2025-07-31", status: "Open",        closedBy: "",              closedAt: "" },
  { id: "PER-2025-08", name: "August 2025",    fiscalYear: "FY2025", startDate: "2025-08-01", endDate: "2025-08-31", status: "Draft",       closedBy: "",              closedAt: "" },
  { id: "PER-2025-09", name: "September 2025", fiscalYear: "FY2025", startDate: "2025-09-01", endDate: "2025-09-30", status: "Draft",       closedBy: "",              closedAt: "" },
  { id: "PER-2025-10", name: "October 2025",   fiscalYear: "FY2025", startDate: "2025-10-01", endDate: "2025-10-31", status: "Draft",       closedBy: "",              closedAt: "" },
  { id: "PER-2025-11", name: "November 2025",  fiscalYear: "FY2025", startDate: "2025-11-01", endDate: "2025-11-30", status: "Draft",       closedBy: "",              closedAt: "" },
  { id: "PER-2025-12", name: "December 2025",  fiscalYear: "FY2025", startDate: "2025-12-01", endDate: "2025-12-31", status: "Draft",       closedBy: "",              closedAt: "" },
]

// ── General Ledger / Journals ─────────────────────────────────────────────────
export const journalEntries = [
  {
    id: "JE-2025-201", date: "2025-07-15", reference: "PO-2025-031", period: "PER-2025-07",
    description: "Goods received — Ethio Tech Solutions",
    sourceType: "AP", postedBy: "Abebe Girma", approvedBy: "Tigist Bekele", status: "Posted",
    lines: [
      { account: "1200 — Inventory",        type: "Debit",  amount: 185000 },
      { account: "2000 — Accounts Payable", type: "Credit", amount: 185000 },
    ],
  },
  {
    id: "JE-2025-202", date: "2025-07-16", reference: "SO-2025-021", period: "PER-2025-07",
    description: "Revenue recognition — Ministry of Finance",
    sourceType: "AR", postedBy: "Abebe Girma", approvedBy: "Tigist Bekele", status: "Posted",
    lines: [
      { account: "1100 — Accounts Receivable", type: "Debit",  amount: 2100000 },
      { account: "4000 — Service Revenue",     type: "Credit", amount: 2100000 },
    ],
  },
  {
    id: "JE-2025-203", date: "2025-07-17", reference: "PAY-2025-088", period: "PER-2025-07",
    description: "Staff salaries — July 2025",
    sourceType: "PAYROLL", postedBy: "Abebe Girma", approvedBy: "Tigist Bekele", status: "Posted",
    lines: [
      { account: "5000 — Salaries & Benefits", type: "Debit",  amount: 284750 },
      { account: "1000 — Cash",               type: "Credit", amount: 284750 },
    ],
  },
  {
    id: "JE-2025-204", date: "2025-07-18", reference: "JE-DRAFT", period: "PER-2025-07",
    description: "Prepaid expense adjustment — Q3",
    sourceType: "MANUAL", postedBy: "", approvedBy: "", status: "Draft",
    lines: [
      { account: "1300 — Prepaid Expenses",    type: "Debit",  amount: 45000 },
      { account: "5200 — Utilities",           type: "Credit", amount: 45000 },
    ],
  },
  {
    id: "JE-2025-205", date: "2025-07-20", reference: "DEP-2025-07", period: "PER-2025-07",
    description: "Monthly depreciation — Equipment July 2025",
    sourceType: "MANUAL", postedBy: "Abebe Girma", approvedBy: "", status: "Submitted",
    lines: [
      { account: "5300 — Depreciation Expense",    type: "Debit",  amount: 186667 },
      { account: "1510 — Accum. Depreciation",     type: "Credit", amount: 186667 },
    ],
  },
]

// ── Accounts Payable (Supplier Invoices) ──────────────────────────────────────
export const apInvoices = [
  { id: "AP-2025-051", supplier: "Ethio Tech Solutions",   poRef: "PO-2025-031", invoiceNo: "ETS-INV-9012", date: "2025-07-10", dueDate: "2025-08-09",  amount: 185000,  paid: 185000,  outstanding: 0,      status: "Paid",      approvedBy: "Tigist Bekele" },
  { id: "AP-2025-052", supplier: "Office Max Ethiopia",    poRef: "PO-2025-034", invoiceNo: "OME-2025-441", date: "2025-07-15", dueDate: "2025-08-14",  amount: 45000,   paid: 45000,   outstanding: 0,      status: "Paid",      approvedBy: "Tigist Bekele" },
  { id: "AP-2025-053", supplier: "Meseret Fuel Depot",     poRef: "PO-2025-036", invoiceNo: "MFD-0782",     date: "2025-07-18", dueDate: "2025-08-17",  amount: 120000,  paid: 0,       outstanding: 120000, status: "Approved",  approvedBy: "Tigist Bekele" },
  { id: "AP-2025-054", supplier: "Global IT Supplies",     poRef: "PO-2025-037", invoiceNo: "GITS-2025-33", date: "2025-07-20", dueDate: "2025-08-19",  amount: 340000,  paid: 0,       outstanding: 340000, status: "Pending",   approvedBy: "" },
  { id: "AP-2025-055", supplier: "Addis Construction Co.", poRef: "PO-2025-028", invoiceNo: "ACC-88-2025",  date: "2025-06-05", dueDate: "2025-07-05",  amount: 680000,  paid: 0,       outstanding: 680000, status: "Overdue",   approvedBy: "Tigist Bekele" },
  { id: "AP-2025-056", supplier: "Nile Security Systems",  poRef: "PO-2025-039", invoiceNo: "NSS-7001",     date: "2025-07-22", dueDate: "2025-08-21",  amount: 95000,   paid: 0,       outstanding: 95000,  status: "Draft",     approvedBy: "" },
]

// ── Accounts Receivable (Customer Invoices) ───────────────────────────────────
export const arInvoices = [
  { id: "AR-2025-081", customer: "Ministry of Finance",     salesRef: "SO-2025-021", date: "2025-07-01", dueDate: "2025-07-31", amount: 2100000, paid: 1050000, outstanding: 1050000, status: "Partially Paid", approvedBy: "Tigist Bekele" },
  { id: "AR-2025-082", customer: "Commercial Bank of Eth.", salesRef: "SO-2025-022", date: "2025-07-10", dueDate: "2025-08-10", amount: 750000,  paid: 0,       outstanding: 750000,  status: "Pending",        approvedBy: "Tigist Bekele" },
  { id: "AR-2025-083", customer: "INSA HQ",                 salesRef: "SO-2025-019", date: "2025-07-02", dueDate: "2025-07-22", amount: 380000,  paid: 380000,  outstanding: 0,       status: "Fully Paid",     approvedBy: "Tigist Bekele" },
  { id: "AR-2025-084", customer: "NBEAC",                   salesRef: "SO-2025-023", date: "2025-07-05", dueDate: "2025-08-05", amount: 290000,  paid: 0,       outstanding: 290000,  status: "Pending",        approvedBy: "Tigist Bekele" },
  { id: "AR-2025-085", customer: "Ethiopian Airlines",      salesRef: "SO-2025-015", date: "2025-06-15", dueDate: "2025-07-15", amount: 480000,  paid: 0,       outstanding: 480000,  status: "Overdue",        approvedBy: "Tigist Bekele" },
  { id: "AR-2025-086", customer: "Addis Ababa City Admin",  salesRef: "SO-2025-014", date: "2025-06-01", dueDate: "2025-07-01", amount: 320000,  paid: 0,       outstanding: 320000,  status: "Overdue",        approvedBy: "Tigist Bekele" },
]

// ── Cash & Bank ───────────────────────────────────────────────────────────────
export const bankAccounts = [
  { id: "BNK-001", name: "CBE Main Operating Account", bank: "Commercial Bank of Ethiopia", accountNo: "****4821", currency: "ETB", glAccount: "1000", bookBalance: 8450000, bankBalance: 8390000, status: "Active" },
  { id: "BNK-002", name: "Dashen Petty Cash Account",  bank: "Dashen Bank",                 accountNo: "****2213", currency: "ETB", glAccount: "1001", bookBalance: 125000,  bankBalance: 125000,  status: "Active" },
  { id: "BNK-003", name: "USD Foreign Account",        bank: "Awash Bank",                  accountNo: "****6670", currency: "USD", glAccount: "1002", bookBalance: 28500,   bankBalance: 28500,   status: "Active" },
]

export const bankTransactions = [
  { id: "TXN-001", bankAccount: "BNK-001", date: "2025-07-20", description: "Receipt — Ministry of Finance INV-081", reference: "AR-2025-081", type: "Credit", amount: 1050000, matched: true,  journalRef: "JE-2025-206" },
  { id: "TXN-002", bankAccount: "BNK-001", date: "2025-07-18", description: "Supplier payment — Meseret Fuel Depot", reference: "AP-2025-053", type: "Debit",  amount: 120000,  matched: false, journalRef: "" },
  { id: "TXN-003", bankAccount: "BNK-001", date: "2025-07-17", description: "Payroll disbursement — July 2025",      reference: "JE-2025-203", type: "Debit",  amount: 284750,  matched: true,  journalRef: "JE-2025-203" },
  { id: "TXN-004", bankAccount: "BNK-001", date: "2025-07-15", description: "Receipt — INSA HQ INV-083",             reference: "AR-2025-083", type: "Credit", amount: 380000,  matched: true,  journalRef: "JE-2025-207" },
  { id: "TXN-005", bankAccount: "BNK-001", date: "2025-07-15", description: "Office supplies payment",               reference: "AP-2025-052", type: "Debit",  amount: 45000,   matched: true,  journalRef: "JE-2025-208" },
  { id: "TXN-006", bankAccount: "BNK-001", date: "2025-07-22", description: "Bank charge — July",                   reference: "CHG-JUL-25", type: "Debit",  amount: 1500,    matched: false, journalRef: "" },
]

// ── Payments ──────────────────────────────────────────────────────────────────
export const payments = [
  { id: "PAY-2025-085", type: "Outgoing", reference: "AP-2025-052", party: "Office Max Ethiopia",  amount: 45000,   date: "2025-07-18", method: "Bank Transfer", status: "Completed", bankAccount: "BNK-001" },
  { id: "PAY-2025-086", type: "Incoming", reference: "AR-2025-083", party: "INSA HQ",              amount: 380000,  date: "2025-07-20", method: "Bank Transfer", status: "Completed", bankAccount: "BNK-001" },
  { id: "PAY-2025-087", type: "Incoming", reference: "AR-2025-081", party: "Ministry of Finance",  amount: 1050000, date: "2025-07-19", method: "Bank Transfer", status: "Completed", bankAccount: "BNK-001" },
  { id: "PAY-2025-088", type: "Outgoing", reference: "JE-2025-203", party: "Staff Payroll",        amount: 284750,  date: "2025-07-17", method: "Bank Transfer", status: "Completed", bankAccount: "BNK-001" },
  { id: "PAY-2025-089", type: "Outgoing", reference: "AP-2025-053", party: "Meseret Fuel Depot",   amount: 120000,  date: "2025-07-15", method: "Cheque",        status: "Pending",   bankAccount: "BNK-001" },
]

// ── Budget ────────────────────────────────────────────────────────────────────
export const fmsBudgets = [
  { category: "Salaries & Benefits",     account: "5000", fiscalYear: "FY2025", allocated: 5400000, actual: 4218500, status: "Approved" },
  { category: "Procurement & Supplies",  account: "5100", fiscalYear: "FY2025", allocated: 5500000, actual: 4852000, status: "Approved" },
  { category: "Utilities & Maintenance", account: "5200", fiscalYear: "FY2025", allocated: 1200000, actual: 890000,  status: "Approved" },
  { category: "Depreciation",           account: "5300", fiscalYear: "FY2025", allocated: 2400000, actual: 2240000, status: "Approved" },
  { category: "Contingency Reserve",    account: "5400", fiscalYear: "FY2025", allocated: 800000,  actual: 0,       status: "Locked"   },
]

// ── Charts & Reports ──────────────────────────────────────────────────────────
export const revenueData = [
  { month: "Jan", revenue: 320000,  expenses: 210000 },
  { month: "Feb", revenue: 380000,  expenses: 240000 },
  { month: "Mar", revenue: 350000,  expenses: 225000 },
  { month: "Apr", revenue: 420000,  expenses: 270000 },
  { month: "May", revenue: 460000,  expenses: 290000 },
  { month: "Jun", revenue: 2100000, expenses: 310000 },
  { month: "Jul", revenue: 1130000, expenses: 295000 },
]

// ── Config ────────────────────────────────────────────────────────────────────
export const accountTypeConfig: Record<string, { color: string; bg: string }> = {
  Asset:    { color: "#2563EB", bg: "#EEF2FF" },
  Liability:{ color: "#C8102E", bg: "#FFF1F3" },
  Equity:   { color: "#7C3AED", bg: "#F5F3FF" },
  Revenue:  { color: "#16A34A", bg: "#F0FDF4" },
  Expense:  { color: "#D97706", bg: "#FFFBEB" },
}

export const periodStatusConfig: Record<string, { color: string; bg: string }> = {
  Open:         { color: "#16A34A", bg: "#F0FDF4" },
  "Soft Closed":{ color: "#D97706", bg: "#FFFBEB" },
  Closed:       { color: "#64748B", bg: "#F1F5F9" },
  Draft:        { color: "#2563EB", bg: "#EEF2FF" },
}

export const statusConfig: Record<string, { color: string; bg: string }> = {
  Posted:           { color: "#16A34A", bg: "#F0FDF4" },
  Draft:            { color: "#64748B", bg: "#F1F5F9" },
  Submitted:        { color: "#2563EB", bg: "#EEF2FF" },
  Approved:         { color: "#16A34A", bg: "#F0FDF4" },
  Pending:          { color: "#D97706", bg: "#FFFBEB" },
  "Partially Paid": { color: "#D97706", bg: "#FFFBEB" },
  "Fully Paid":     { color: "#16A34A", bg: "#F0FDF4" },
  Paid:             { color: "#16A34A", bg: "#F0FDF4" },
  Overdue:          { color: "#C8102E", bg: "#FFF1F3" },
  Completed:        { color: "#16A34A", bg: "#F0FDF4" },
  Failed:           { color: "#C8102E", bg: "#FFF1F3" },
  Locked:           { color: "#7C3AED", bg: "#F5F3FF" },
  Active:           { color: "#16A34A", bg: "#F0FDF4" },
}

// ── Role definitions (UI reference) ──────────────────────────────────────────
export const fmsRoles = {
  FINANCE_ADMINISTRATOR: { label: "Finance Administrator", color: "#C8102E" },
  GENERAL_ACCOUNTANT:    { label: "General Accountant",    color: "#2563EB" },
  AP_OFFICER:            { label: "AP Officer",             color: "#D97706" },
  AR_OFFICER:            { label: "AR Officer",             color: "#16A34A" },
  FINANCE_MANAGER:       { label: "Finance Manager",        color: "#7C3AED" },
}
