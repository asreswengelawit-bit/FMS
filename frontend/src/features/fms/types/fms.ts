export type AccountType = "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";
export type NormalBalance = "DEBIT" | "CREDIT";
export type AccountStatus = "ACTIVE" | "INACTIVE";

export type Account = {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  normalBalance: NormalBalance;
  parentAccountId: string | null;
  postingAllowed: boolean;
  description: string | null;
  status: AccountStatus;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
  version: number;
};

export type CreateAccountInput = {
  code: string;
  name: string;
  type: AccountType;
  parentAccountId?: string | null;
  postingAllowed?: boolean;
  description?: string;
};

export type UpdateAccountInput = {
  code?: string;
  name?: string;
  type?: AccountType;
  parentAccountId?: string | null;
  postingAllowed?: boolean;
  description?: string;
};

export type PeriodStatus = "OPEN" | "CLOSED";

export type AccountingPeriod = {
  id: string;
  periodName: string;
  startDate: string;
  endDate: string;
  status: PeriodStatus;
  preparedBy: string;
  closedBy: string | null;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type CreatePeriodInput = {
  periodName: string;
  startDate: string;
  endDate: string;
};

export type JournalStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "POSTED" | "REJECTED";

export type JournalLine = {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  debitAmount: number;
  creditAmount: number;
};

export type JournalEntry = {
  id: string;
  periodId: string;
  periodName: string;
  description: string;
  status: JournalStatus;
  createdBy: string;
  approvedBy: string | null;
  postedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
  totalDebit: number;
  totalCredit: number;
  lines: JournalLine[];
};

export type CreateJournalLineInput = {
  accountId: string;
  debitAmount: number;
  creditAmount: number;
};

export type CreateJournalEntryInput = {
  periodId: string;
  description?: string;
  lines: CreateJournalLineInput[];
};

export type InvoiceStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "POSTED" | "PAID" | "PARTIALLY_PAID" | "OVERDUE" | "CANCELLED";
export type InvoiceType = "PAYABLE" | "RECEIVABLE";

export type InvoiceLine = {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  description: string | null;
  quantity: number;
  unitPrice: number;
  lineAmount: number;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  invoiceType: InvoiceType;
  partyName: string;
  periodId: string;
  periodName: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  totalAmount: number;
  paidAmount: number;
  remainingBalance: number;
  controlAccountId: string | null;
  controlAccountCode: string | null;
  controlAccountName: string | null;
  vendorId: string | null;
  vendorCode: string | null;
  customerId: string | null;
  customerCode: string | null;
  journalEntryId: string | null;
  lines: InvoiceLine[];
  createdBy: string;
  approvedBy: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type CreateInvoiceLineInput = {
  accountId: string;
  description?: string;
  quantity: number;
  unitPrice: number;
};

export type CreateInvoiceInput = {
  invoiceNumber: string;
  invoiceType: InvoiceType;
  partyName: string;
  periodId: string;
  issueDate: string;
  dueDate: string;
  controlAccountId?: string;
  vendorId?: string;
  customerId?: string;
  lines: CreateInvoiceLineInput[];
};

export type PaymentStatus = "COMPLETED" | "FAILED" | "CANCELLED";
export type PaymentType = "DISBURSEMENT" | "RECEIPT";

export type Payment = {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  bankAccountId: string;
  bankAccountCode: string;
  bankAccountName: string;
  paymentType: PaymentType;
  paymentDate: string;
  amount: number;
  referenceNumber: string | null;
  status: PaymentStatus;
  journalEntryId: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string | null;
};

export type ProcessPaymentInput = {
  paymentNumber: string;
  invoiceId: string;
  bankAccountId: string;
  paymentType: PaymentType;
  paymentDate: string;
  amount: number;
  referenceNumber?: string;
};

// Report response types
export type TrialBalanceItem = {
  accountId: string;
  accountCode: string;
  accountName: string;
  totalDebit: number;
  totalCredit: number;
  netBalance: number;
};

export type TrialBalanceReport = {
  periodId: string;
  periodName: string;
  grandTotalDebit: number;
  grandTotalCredit: number;
  balanced: boolean;
  items: TrialBalanceItem[];
};

export type FinancialStatementItem = {
  accountId: string;
  accountCode: string;
  accountName: string;
  accountType: string;
  amount: number;
};

export type IncomeStatementReport = {
  periodId: string;
  periodName: string;
  revenueItems: FinancialStatementItem[];
  expenseItems: FinancialStatementItem[];
  totalRevenue: number;
  totalExpense: number;
  netIncome: number;
};

export type BalanceSheetReport = {
  periodId: string;
  periodName: string;
  assetItems: FinancialStatementItem[];
  liabilityItems: FinancialStatementItem[];
  equityItems: FinancialStatementItem[];
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  retainedEarnings: number;
  totalLiabilitiesAndEquity: number;
  isBalanced: boolean;
};

export type PagedResponse<T> = {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

export type ApiError = {
  code: string | null;
  field: string | null;
  message: string | null;
};

export type FmsApiResponse<T> = {
  success: boolean;
  message?: string | null;
  data: T;
  errors?: ApiError[] | null;
  correlationId?: string | null;
  timestamp?: string;
};

// Budget
export type BudgetStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "ACTIVE" | "CLOSED";
export type Budget = {
  id: string;
  budgetName: string;
  fiscalYear: number;
  status: BudgetStatus;
  totalBudgetedAmount: number;
  lines: BudgetLine[];
  createdBy: string;
  approvedBy: string | null;
  createdAt: string;
  updatedAt: string | null;
};
export type BudgetLine = {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  periodId: string;
  periodName: string;
  budgetedAmount: number;
  notes: string | null;
};
export type CreateBudgetInput = {
  budgetName: string;
  fiscalYear: number;
  lines: Array<{ accountId: string; periodId: string; budgetedAmount: number; notes?: string }>;
};
export type BudgetVarianceItem = {
  accountId: string;
  accountCode: string;
  accountName: string;
  accountType: string;
  periodId: string;
  periodName: string;
  budgetedAmount: number;
  actualAmount: number;
  varianceAmount: number;
  utilizationPercentage: number;
};
export type BudgetVarianceReport = {
  budgetId: string;
  budgetName: string;
  fiscalYear: number;
  periodId: string;
  periodName: string;
  items: BudgetVarianceItem[];
  totalBudgeted: number;
  totalActual: number;
  totalVariance: number;
};

// Bank
export type BankAccountStatus = "ACTIVE" | "INACTIVE";
export type ReconciliationStatus = "MATCHED" | "UNMATCHED" | "EXCEPTION";
export type BankAccount = {
  id: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
  branchCode: string;
  currency: string;
  openingBalance: number;
  currentBalance: number;
  glControlAccountId: string | null;
  glControlAccountCode: string | null;
  status: BankAccountStatus;
  createdAt: string;
  updatedAt: string | null;
};
export type CreateBankAccountInput = {
  accountName: string;
  bankName: string;
  accountNumber: string;
  branchCode?: string;
  currency: string;
  openingBalance: number;
  glControlAccountId?: string;
};
export type BankStatementLine = {
  id: string;
  bankAccountId: string;
  transactionDate: string;
  description: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  reference: string | null;
  reconciliationStatus: ReconciliationStatus;
  matchedPaymentId: string | null;
  createdAt: string;
};
export type CashPosition = {
  bankAccountId: string;
  accountName: string;
  bookBalance: number;
  statementBalance: number;
  variance: number;
  unmatchedLines: number;
};
export type ImportStatementLineInput = {
  transactionDate: string;
  description: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  reference?: string;
};

export type PeriodCloseChecklistItem = {
  name: string;
  status: "PASS" | "FAIL" | "WARNING";
  description: string;
  remedyHint: string | null;
};
export type PeriodCloseChecklist = {
  periodId: string;
  periodName: string;
  passed: boolean;
  runAt: string;
  checklistItems: PeriodCloseChecklistItem[];
};

export type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "POST" | "REVERSE" | "CLOSE" | "REOPEN";
export type AuditLog = {
  id: string;
  entityType: string;
  entityId: string;
  action: AuditAction;
  performedBy: string;
  performedAt: string;
  changes: Record<string, { oldValue: any; newValue: any }> | null;
  ipAddress: string | null;
};

// Vendor / Payable
export type VendorStatus = "ACTIVE" | "INACTIVE";
export type Vendor = {
  id: string;
  vendorCode: string;
  name: string;
  taxId: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  paymentTerms: string;
  defaultApAccountId: string | null;
  defaultApAccountCode: string | null;
  defaultApAccountName: string | null;
  status: VendorStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string | null;
};
export type CreateVendorInput = {
  vendorCode: string;
  name: string;
  taxId?: string;
  email?: string;
  phone?: string;
  address?: string;
  paymentTerms?: string;
  defaultApAccountId?: string;
};
export type UpdateVendorInput = {
  name: string;
  taxId?: string;
  email?: string;
  phone?: string;
  address?: string;
  paymentTerms?: string;
  defaultApAccountId?: string;
  status?: VendorStatus;
};
export type ApAgingReportItem = {
  vendorId: string;
  vendorCode: string;
  vendorName: string;
  current: number;
  days1To30: number;
  days31To60: number;
  days61To90: number;
  days90Plus: number;
  totalOutstanding: number;
};
export type ApAgingReport = {
  asOfDate: string;
  items: ApAgingReportItem[];
  totalCurrent: number;
  totalDays1To30: number;
  totalDays31To60: number;
  totalDays61To90: number;
  totalDays90Plus: number;
  grandTotal: number;
};
export type VendorStatementTransaction = {
  transactionDate: string;
  transactionType: string;
  referenceNumber: string | null;
  dueDate: string | null;
  status: string;
  invoiceAmount: number;
  paymentAmount: number;
  runningBalance: number;
  documentId: string | null;
};
export type VendorStatement = {
  vendorId: string;
  vendorCode: string;
  vendorName: string;
  statementDate: string;
  transactions: VendorStatementTransaction[];
  totalBilled: number;
  totalPaid: number;
  closingBalance: number;
};

// Customer / Receivable
export type CustomerStatus = "ACTIVE" | "INACTIVE";
export type Customer = {
  id: string;
  customerCode: string;
  name: string;
  taxId: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  creditLimit: number | null;
  paymentTerms: string;
  defaultArAccountId: string | null;
  defaultArAccountCode: string | null;
  defaultArAccountName: string | null;
  status: CustomerStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string | null;
};
export type CreateCustomerInput = {
  customerCode: string;
  name: string;
  taxId?: string;
  email?: string;
  phone?: string;
  address?: string;
  creditLimit?: number;
  paymentTerms?: string;
  defaultArAccountId?: string;
};
export type UpdateCustomerInput = {
  name: string;
  taxId?: string;
  email?: string;
  phone?: string;
  address?: string;
  creditLimit?: number;
  paymentTerms?: string;
  defaultArAccountId?: string;
  status?: CustomerStatus;
};
export type ArAgingReportItem = {
  customerId: string;
  customerCode: string;
  customerName: string;
  current: number;
  days1To30: number;
  days31To60: number;
  days61To90: number;
  days90Plus: number;
  totalOutstanding: number;
};
export type ArAgingReport = {
  asOfDate: string;
  items: ArAgingReportItem[];
  totalCurrent: number;
  totalDays1To30: number;
  totalDays31To60: number;
  totalDays61To90: number;
  totalDays90Plus: number;
  grandTotal: number;
};
export type CustomerStatementTransaction = {
  transactionDate: string;
  transactionType: string;
  referenceNumber: string | null;
  dueDate: string | null;
  status: string;
  invoiceAmount: number;
  receiptAmount: number;
  runningBalance: number;
  documentId: string | null;
};
export type CustomerStatement = {
  customerId: string;
  customerCode: string;
  customerName: string;
  statementDate: string;
  transactions: CustomerStatementTransaction[];
  totalInvoiced: number;
  totalReceived: number;
  closingBalance: number;
};
