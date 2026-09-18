import { auth } from "@/auth";
import type { FmsApiResponse, Payment } from "@/features/fms/types/fms";

const FMS_API_BASE =
  process.env.FMS_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:8084";

// In demo mode there is no Keycloak token, so the backend's local mock auth
// filter is used instead. Granting every business role covers all permissions
// (_create, _update, _approve, _post, …) across modules.
const MOCK_ROLES = "FINANCE_ADMINISTRATOR,GENERAL_ACCOUNTANT,AP_OFFICER,AR_OFFICER,FINANCE_MANAGER";

export class FmsApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "FmsApiError";
    this.status = status;
  }
}

async function accessToken(): Promise<string | null> {
  try {
    const session = await auth();
    return session?.accessToken ?? null;
  } catch {
    return null;
  }
}

// Global mock storage for demo mode / backend offline fallback
let mockAccounts = [
  { id: "a1", code: "1010", name: "Cash in Hand", type: "ASSET", normalBalance: "DEBIT", parentAccountId: null, postingAllowed: true, description: "Main operating cash account", status: "ACTIVE", createdAt: "2026-08-01T00:00:00Z", createdBy: "finance_manager", updatedAt: null, updatedBy: null, balance: 15500.00 },
  { id: "a2", code: "1020", name: "Bank Current Account", type: "ASSET", normalBalance: "DEBIT", parentAccountId: null, postingAllowed: true, description: "Commercial bank checking account", status: "ACTIVE", createdAt: "2026-08-01T00:00:00Z", createdBy: "finance_manager", updatedAt: null, updatedBy: null, balance: 450000.00 },
  { id: "a3", code: "1200", name: "Accounts Receivable", type: "ASSET", normalBalance: "DEBIT", parentAccountId: null, postingAllowed: true, description: "Customer outstanding balances", status: "ACTIVE", createdAt: "2026-08-01T00:00:00Z", createdBy: "finance_manager", updatedAt: null, updatedBy: null, balance: 12400.00 },
  { id: "a4", code: "2010", name: "Accounts Payable", type: "LIABILITY", normalBalance: "CREDIT", parentAccountId: null, postingAllowed: true, description: "Vendor outstanding balances", status: "ACTIVE", createdAt: "2026-08-01T00:00:00Z", createdBy: "finance_manager", updatedAt: null, updatedBy: null, balance: 8300.00 },
  { id: "a5", code: "3010", name: "Owner's Equity", type: "EQUITY", normalBalance: "CREDIT", parentAccountId: null, postingAllowed: true, description: "Owner capital contribution", status: "ACTIVE", createdAt: "2026-08-01T00:00:00Z", createdBy: "finance_manager", updatedAt: null, updatedBy: null, balance: 400000.00 },
  { id: "a6", code: "4010", name: "Sales Revenue", type: "REVENUE", normalBalance: "CREDIT", parentAccountId: null, postingAllowed: true, description: "General sales revenue", status: "ACTIVE", createdAt: "2026-08-01T00:00:00Z", createdBy: "finance_manager", updatedAt: null, updatedBy: null, balance: 75000.00 },
  { id: "a7", code: "5010", name: "Rent Expense", type: "EXPENSE", normalBalance: "DEBIT", parentAccountId: null, postingAllowed: true, description: "Monthly office rent", status: "ACTIVE", createdAt: "2026-08-01T00:00:00Z", createdBy: "finance_manager", updatedAt: null, updatedBy: null, balance: 5000.00 },
  { id: "a8", code: "5020", name: "Office Utilities", type: "EXPENSE", normalBalance: "DEBIT", parentAccountId: null, postingAllowed: true, description: "Electricity and water expenses", status: "ACTIVE", createdAt: "2026-08-01T00:00:00Z", createdBy: "finance_manager", updatedAt: null, updatedBy: null, balance: 400.00 },
];

let mockPeriods = [
  { id: "p1", periodName: "2026-08", startDate: "2026-08-01", endDate: "2026-08-31", status: "OPEN", openedBy: "general_accountant", closedBy: null, openedAt: "2026-08-01T08:00:00Z", closedAt: null },
  { id: "p2", periodName: "2026-07", startDate: "2026-07-01", endDate: "2026-07-31", status: "CLOSED", openedBy: "general_accountant", closedBy: "finance_manager", openedAt: "2026-07-01T08:00:00Z", closedAt: "2026-07-31T17:00:00Z" }
];

let mockJournals = [
  { id: "j1", periodId: "p1", periodName: "2026-08", description: "Opening Balance entry", status: "POSTED", createdBy: "general_accountant", approvedBy: "finance_manager", postedAt: "2026-08-01T09:00:00Z", createdAt: "2026-08-01T08:30:00Z", updatedAt: null, totalDebit: 450000.00, totalCredit: 450000.00, reversalOfJournalId: null, isReversal: false, lines: [
    { id: "jl1", accountId: "a2", accountCode: "1020", accountName: "Bank Current Account", debitAmount: 450000.00, creditAmount: 0.00, description: "Initial deposit" },
    { id: "jl2", accountId: "a5", accountCode: "3010", accountName: "Owner's Equity", debitAmount: 0.00, creditAmount: 450000.00, description: "Capital investment" }
  ]},
  { id: "j2", periodId: "p1", periodName: "2026-08", description: "Office supplies bill payment", status: "SUBMITTED", createdBy: "general_accountant", approvedBy: null, postedAt: null, createdAt: "2026-08-25T11:00:00Z", updatedAt: null, totalDebit: 400.00, totalCredit: 400.00, reversalOfJournalId: null, isReversal: false, lines: [
    { id: "jl3", accountId: "a8", accountCode: "5020", accountName: "Office Utilities", debitAmount: 400.00, creditAmount: 0.00, description: "Electricity bill August" },
    { id: "jl4", accountId: "a1", accountCode: "1010", accountName: "Cash in Hand", debitAmount: 0.00, creditAmount: 400.00, description: "Paid from cash" }
  ]}
];

let mockInvoices = [
  { id: "i1", invoiceNumber: "INV-2026-001", invoiceType: "PAYABLE", partyName: "Acme Supplies Ltd", periodId: "p1", periodName: "2026-08", issueDate: "2026-08-05", dueDate: "2026-08-25", status: "POSTED", totalAmount: 500.00, paidAmount: 500.00, remainingBalance: 0.00, controlAccountId: "a4", controlAccountCode: "2010", controlAccountName: "Accounts Payable", vendorId: "v1", vendorCode: "VND-001", customerId: null, customerCode: null, journalEntryId: "j1", createdBy: "general_accountant", approvedBy: "finance_manager", createdAt: "2026-08-05T09:00:00Z", updatedAt: null, lines: [
    { id: "il1", accountId: "a8", accountCode: "5020", accountName: "Office Utilities", description: "Office Stationery", quantity: 5, unitPrice: 100.00, totalPrice: 500.00 }
  ]},
  { id: "i2", invoiceNumber: "INV-2026-002", invoiceType: "RECEIVABLE", partyName: "Insa Customer Corp", periodId: "p1", periodName: "2026-08", issueDate: "2026-08-10", dueDate: "2026-09-10", status: "APPROVED", totalAmount: 1500.00, paidAmount: 0.00, remainingBalance: 1500.00, controlAccountId: "a3", controlAccountCode: "1200", controlAccountName: "Accounts Receivable", vendorId: null, vendorCode: null, customerId: "c1", customerCode: "CST-001", journalEntryId: null, createdBy: "general_accountant", approvedBy: "finance_manager", createdAt: "2026-08-10T10:00:00Z", updatedAt: null, lines: [
    { id: "il2", accountId: "a6", accountCode: "4010", accountName: "Sales Revenue", description: "Security Consultation", quantity: 1, unitPrice: 1500.00, totalPrice: 1500.00 }
  ]}
];

let mockPayments: Payment[] = [
  { id: "pay1", paymentNumber: "PMT-2026-001", paymentType: "DISBURSEMENT", invoiceId: "i1", invoiceNumber: "INV-2026-001", bankAccountId: "ba1", bankAccountCode: "1020", bankAccountName: "Bank Current Account", paymentDate: "2026-08-10", amount: 500.00, referenceNumber: "CHK-99812", status: "COMPLETED", journalEntryId: "j1", createdBy: "general_accountant", createdAt: "2026-08-10T14:00:00Z", updatedAt: null }
];

let mockBudgets = [
  { id: "b1", fiscalYear: 2026, status: "APPROVED", description: "FY2026 Operating Budget", createdBy: "general_accountant", approvedBy: "finance_manager", createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-15T00:00:00Z", lines: [
    { id: "bl1", accountId: "a7", accountCode: "5010", accountName: "Rent Expense", budgetAmount: 60000, actualAmount: 5000, variance: -55000 },
    { id: "bl2", accountId: "a8", accountCode: "5020", accountName: "Office Utilities", budgetAmount: 12000, actualAmount: 400, variance: -11600 },
  ]}
];

let mockBankAccounts = [
  { id: "ba1", accountName: "Operating Account", bankName: "Commercial Bank", accountNumber: "1234567890", branchCode: "001", currency: "USD", openingBalance: 450000, currentBalance: 450500, glControlAccountId: null, glControlAccountCode: null, status: "ACTIVE", createdAt: "2026-01-01T00:00:00Z", updatedAt: null }
];

let mockBankStatementLines: {
  id: string;
  bankAccountId: string;
  transactionDate: string;
  description: string;
  amount: number;
  type: string;
  reference: string | null;
  reconciliationStatus: string;
  matchedPaymentId: string | null;
  createdAt: string;
}[] = [
  { id: "stmt1", bankAccountId: "ba1", transactionDate: "2026-08-10", description: "Vendor Payment - Acme Supplies", amount: 500.00, type: "DEBIT", reference: "CHK-99812", reconciliationStatus: "MATCHED", matchedPaymentId: "pay1", createdAt: "2026-08-10T14:00:00Z" }
];

let mockVendors = [
  { id: "v1", vendorCode: "VND-001", vendorName: "Acme Supplies Ltd", contactPerson: "John Doe", email: "john@acme.com", phoneNumber: "+251-911-123456", address: "Addis Ababa", taxId: "TAX-001", status: "ACTIVE", createdAt: "2026-01-01T00:00:00Z", updatedAt: null },
  { id: "v2", vendorCode: "VND-002", vendorName: "Global Tech Solutions", contactPerson: "Jane Smith", email: "jane@globaltech.com", phoneNumber: "+251-911-654321", address: "Addis Ababa", taxId: "TAX-002", status: "ACTIVE", createdAt: "2026-01-01T00:00:00Z", updatedAt: null }
];

let mockCustomers = [
  { id: "c1", customerCode: "CST-001", customerName: "Insa Customer Corp", contactPerson: "Alice Brown", email: "alice@insa.com", phoneNumber: "+251-911-111111", address: "Addis Ababa", taxId: "TAX-C01", status: "ACTIVE", createdAt: "2026-01-01T00:00:00Z", updatedAt: null },
  { id: "c2", customerCode: "CST-002", customerName: "Beta Industries", contactPerson: "Bob White", email: "bob@beta.com", phoneNumber: "+251-911-222222", address: "Addis Ababa", taxId: "TAX-C02", status: "ACTIVE", createdAt: "2026-01-01T00:00:00Z", updatedAt: null }
];

let mockAuditLogs = [
  { id: "al1", entityType: "ACCOUNT", entityId: "a1", action: "CREATE", performedBy: "finance_manager", performedAt: "2026-08-01T00:00:00Z", changes: null, ipAddress: "127.0.0.1" },
  { id: "al2", entityType: "JOURNAL", entityId: "j1", action: "POST", performedBy: "finance_manager", performedAt: "2026-08-01T09:00:00Z", changes: null, ipAddress: "127.0.0.1" },
  { id: "al3", entityType: "INVOICE", entityId: "i1", action: "APPROVE", performedBy: "finance_manager", performedAt: "2026-08-05T09:00:00Z", changes: null, ipAddress: "127.0.0.1" },
];

export async function fmsFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = await accessToken();

  try {
    const headers = new Headers(init.headers);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    if (process.env.NEXT_PUBLIC_AUTH_MODE === "demo") {
      headers.set("X-Mock-Roles", MOCK_ROLES);
    }
    headers.set("Accept", "application/json");
    if (init.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // short timeout to failover quickly

    const res = await fetch(`${FMS_API_BASE}${path}`, {
      ...init,
      headers,
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    let payload: FmsApiResponse<T> | null = null;
    try {
      payload = (await res.json()) as FmsApiResponse<T>;
    } catch {
      payload = null;
    }

    if (!res.ok) {
      if (res.status === 401) {
        throw new FmsApiError("Your login session expired. Sign out and sign in again.", 401);
      }
      const msg =
        payload?.message ||
        (payload?.errors as any)?.join(", ") ||
        `FMS request failed (${res.status})`;
      throw new FmsApiError(msg, res.status);
    }

    if (payload && typeof payload === "object" && "data" in payload) {
      return payload.data;
    }

    throw new FmsApiError("Unexpected FMS response shape.", res.status);
  } catch (err: any) {
    // Mock fallback is opt-in (NEXT_PUBLIC_FMS_MOCK_FALLBACK=1) so that a
    // missing/stopped FMS service surfaces its error instead of silently
    // serving hardcoded rows. Normal dev/demo runs hit the real PostgreSQL
    // backend via fms-service + FMS_DEV_AUTH.
    if (process.env.NEXT_PUBLIC_FMS_MOCK_FALLBACK === "1") {
      console.warn(`FMS microservice unreachable. Falling back to frontend mock database. Path: ${path}. Error: ${err.message}`);
      return await handleMockRequest<T>(path, init);
    }
    throw err;
  }
}

export function fmsBaseUrl(): string {
  return FMS_API_BASE;
}

// Simple REST handler for Mock Data Fallback
async function handleMockRequest<T>(path: string, init: RequestInit): Promise<T> {
  const url = new URL(path, "http://localhost");
  const method = init.method || "GET";

  if (url.pathname === "/api/v1/accounts") {
    if (method === "GET") {
      const type = url.searchParams.get("type");
      const status = url.searchParams.get("status");
      let filtered = [...mockAccounts];
      if (type) filtered = filtered.filter(a => a.type === type);
      if (status) filtered = filtered.filter(a => a.status === status);
      return {
        content: filtered,
        pageNumber: 0,
        pageSize: 50,
        totalElements: filtered.length,
        totalPages: 1,
        last: true
      } as any as T;
    }
    if (method === "POST") {
      const req = JSON.parse(init.body as string);
      const newAcc = {
        id: "a" + (mockAccounts.length + 1),
        code: req.code,
        name: req.name,
        type: req.type,
        normalBalance: (req.type === "ASSET" || req.type === "EXPENSE") ? "DEBIT" : "CREDIT" as any,
        parentAccountId: req.parentAccountId || null,
        postingAllowed: req.postingAllowed ?? true,
        description: req.description || null,
        status: "ACTIVE" as any,
        createdAt: new Date().toISOString(),
        createdBy: "general_accountant",
        updatedAt: null,
        updatedBy: null,
        balance: 0.0
      };
      mockAccounts.push(newAcc);
      return newAcc as any as T;
    }
  }

  if (url.pathname.startsWith("/api/v1/accounts/")) {
    const id = url.pathname.split("/").pop();
    const accIndex = mockAccounts.findIndex(a => a.id === id);
    if (accIndex !== -1) {
      if (url.pathname.endsWith("/status") && method === "PATCH") {
        mockAccounts[accIndex].status = mockAccounts[accIndex].status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        return mockAccounts[accIndex] as any as T;
      }
      if (method === "PATCH") {
        const req = JSON.parse(init.body as string);
        mockAccounts[accIndex] = { ...mockAccounts[accIndex], ...req };
        return mockAccounts[accIndex] as any as T;
      }
      return mockAccounts[accIndex] as any as T;
    }
  }

  if (url.pathname === "/api/fms/periods") {
    if (method === "GET") {
      return {
        content: mockPeriods,
        pageNumber: 0,
        pageSize: 50,
        totalElements: mockPeriods.length,
        totalPages: 1,
        last: true
      } as any as T;
    }
    if (method === "POST") {
      const req = JSON.parse(init.body as string);
      const newPeriod = {
        id: "p" + (mockPeriods.length + 1),
        periodName: req.periodName,
        startDate: req.startDate,
        endDate: req.endDate,
        status: "OPEN" as any,
        openedBy: "general_accountant",
        closedBy: null,
        openedAt: new Date().toISOString(),
        closedAt: null
      };
      mockPeriods.unshift(newPeriod);
      return newPeriod as any as T;
    }
  }

  if (url.pathname.startsWith("/api/fms/periods/")) {
    const parts = url.pathname.split("/");
    const id = parts[4];
    const periodIndex = mockPeriods.findIndex(p => p.id === id);
    if (periodIndex !== -1) {
      if (url.pathname.endsWith("/soft-close") && method === "POST") {
        mockPeriods[periodIndex].status = "SOFT_CLOSED";
        return mockPeriods[periodIndex] as any as T;
      }
      if (url.pathname.endsWith("/close") && method === "POST") {
        mockPeriods[periodIndex].status = "CLOSED";
        mockPeriods[periodIndex].closedBy = "finance_manager";
        mockPeriods[periodIndex].closedAt = new Date().toISOString();
        return mockPeriods[periodIndex] as any as T;
      }
      if (url.pathname.endsWith("/reopen") && method === "POST") {
        mockPeriods[periodIndex].status = "OPEN";
        return mockPeriods[periodIndex] as any as T;
      }
      if (url.pathname.endsWith("/pre-close-checklist") && method === "GET") {
        return {
          periodId: id,
          periodName: mockPeriods[periodIndex].periodName,
          passed: true,
          runAt: new Date().toISOString(),
          checklistItems: [
            { name: "Unbalanced Journal Vouchers", status: "PASS", description: "Verifying that no journal entries are unbalanced", remedyHint: null },
            { name: "Draft Journal Vouchers", status: "PASS", description: "Verifying that all journal entries are posted or approved", remedyHint: null },
            { name: "Outstanding Payments Reconciliation", status: "PASS", description: "Verifying all payments are reconciled to bank statements", remedyHint: null }
          ]
        } as any as T;
      }
    }
  }

  if (url.pathname === "/api/fms/journal") {
    if (method === "GET") {
      return {
        content: mockJournals,
        pageNumber: 0,
        pageSize: 50,
        totalElements: mockJournals.length,
        totalPages: 1,
        last: true
      } as any as T;
    }
    if (method === "POST") {
      const req = JSON.parse(init.body as string);
      const lines = req.lines.map((l: any, idx: number) => {
        const acc = mockAccounts.find(a => a.id === l.accountId);
        return {
          id: "jl" + (mockJournals.length * 10 + idx),
          accountId: l.accountId,
          accountCode: acc?.code ?? "UNKNOWN",
          accountName: acc?.name ?? "UNKNOWN Account",
          debitAmount: l.debitAmount ?? 0,
          creditAmount: l.creditAmount ?? 0,
          description: l.description || null
        };
      });
      const totalDebit = lines.reduce((sum: number, l: any) => sum + l.debitAmount, 0);
      const totalCredit = lines.reduce((sum: number, l: any) => sum + l.creditAmount, 0);

      const newJE = {
        id: "j" + (mockJournals.length + 1),
        periodId: req.periodId,
        periodName: mockPeriods.find(p => p.id === req.periodId)?.periodName ?? "2026-08",
        description: req.description,
        status: "DRAFT" as any,
        createdBy: "general_accountant",
        approvedBy: null,
        postedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        totalDebit,
        totalCredit,
        lines,
        reversalOfJournalId: null,
        isReversal: false
      };
      mockJournals.unshift(newJE);
      return newJE as any as T;
    }
  }

  if (url.pathname.startsWith("/api/fms/journal/")) {
    const id = url.pathname.split("/")[4];
    const jeIndex = mockJournals.findIndex(j => j.id === id);
    if (jeIndex !== -1) {
      if (url.pathname.endsWith("/submit") && method === "POST") {
        mockJournals[jeIndex].status = "SUBMITTED";
        return mockJournals[jeIndex] as any as T;
      }
      if (url.pathname.endsWith("/approve") && method === "POST") {
        mockJournals[jeIndex].status = "APPROVED";
        mockJournals[jeIndex].approvedBy = "finance_manager";
        return mockJournals[jeIndex] as any as T;
      }
      if (url.pathname.endsWith("/post") && method === "POST") {
        mockJournals[jeIndex].status = "POSTED";
        mockJournals[jeIndex].postedAt = new Date().toISOString();
        // Update account balances
        mockJournals[jeIndex].lines.forEach(l => {
          const accIdx = mockAccounts.findIndex(a => a.id === l.accountId);
          if (accIdx !== -1) {
            const acc = mockAccounts[accIdx];
            const change = l.debitAmount - l.creditAmount;
            const factor = acc.normalBalance === "DEBIT" ? 1 : -1;
            acc.balance = (acc.balance ?? 0) + change * factor;
          }
        });
        return mockJournals[jeIndex] as any as T;
      }
    }
  }

  if (url.pathname === "/api/fms/invoices") {
    if (method === "GET") {
      return {
        content: mockInvoices,
        pageNumber: 0,
        pageSize: 50,
        totalElements: mockInvoices.length,
        totalPages: 1,
        last: true
      } as any as T;
    }
    if (method === "POST") {
      const req = JSON.parse(init.body as string);
      const lines = req.lines.map((l: any, idx: number) => {
        const acc = mockAccounts.find(a => a.id === l.accountId);
        return {
          id: "il" + (mockInvoices.length * 10 + idx),
          accountId: l.accountId,
          accountCode: acc?.code,
          accountName: acc?.name,
          description: l.description,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
          totalPrice: l.quantity * l.unitPrice
        };
      });
      const totalAmount = lines.reduce((sum: number, l: any) => sum + l.totalPrice, 0);

      const newInv = {
        id: "i" + (mockInvoices.length + 1),
        invoiceNumber: req.invoiceNumber,
        invoiceType: req.invoiceType,
        partyName: req.partyName,
        periodId: req.periodId,
        periodName: mockPeriods.find(p => p.id === req.periodId)?.periodName ?? "2026-08",
        issueDate: req.issueDate,
        dueDate: req.dueDate,
        status: "DRAFT" as any,
        totalAmount,
        paidAmount: 0.0,
        remainingBalance: totalAmount,
        controlAccountId: req.controlAccountId || (req.invoiceType === "PAYABLE" ? "a4" : "a3"),
        controlAccountCode: req.invoiceType === "PAYABLE" ? "2010" : "1200",
        controlAccountName: req.invoiceType === "PAYABLE" ? "Accounts Payable" : "Accounts Receivable",
        vendorId: req.vendorId || null,
        vendorCode: req.vendorId ? "VND-" + req.vendorId.slice(-3) : null,
        customerId: req.customerId || null,
        customerCode: req.customerId ? "CST-" + req.customerId.slice(-3) : null,
        journalEntryId: null,
        lines,
        createdBy: "general_accountant",
        approvedBy: null,
        createdAt: new Date().toISOString(),
        updatedAt: null
      };
      mockInvoices.unshift(newInv as any);
      return newInv as any as T;
    }
  }

  if (url.pathname.startsWith("/api/fms/invoices/")) {
    const id = url.pathname.split("/")[4];
    const invIndex = mockInvoices.findIndex(inv => inv.id === id);
    if (invIndex !== -1) {
      if (url.pathname.endsWith("/submit") && method === "POST") {
        mockInvoices[invIndex].status = "SUBMITTED";
        return mockInvoices[invIndex] as any as T;
      }
      if (url.pathname.endsWith("/approve") && method === "POST") {
        mockInvoices[invIndex].status = "APPROVED";
        mockInvoices[invIndex].approvedBy = "finance_manager";
        return mockInvoices[invIndex] as any as T;
      }
      if (url.pathname.endsWith("/post") && method === "POST") {
        mockInvoices[invIndex].status = "POSTED";
        // Create an automatic journal entry for it
        const entryId = "j_auto_" + id;
        mockJournals.push({
          id: entryId,
          periodId: mockInvoices[invIndex].periodId,
          periodName: mockInvoices[invIndex].periodName,
          description: `Auto-post Invoice ${mockInvoices[invIndex].invoiceNumber}`,
          status: "POSTED",
          createdBy: "system",
          approvedBy: "system",
          postedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: null,
          totalDebit: mockInvoices[invIndex].totalAmount,
          totalCredit: mockInvoices[invIndex].totalAmount,
          reversalOfJournalId: null,
          isReversal: false,
          lines: [
            {
              id: "jl_auto_1",
              accountId: mockInvoices[invIndex].controlAccountId!,
              accountCode: mockInvoices[invIndex].controlAccountCode!,
              accountName: mockInvoices[invIndex].controlAccountName!,
              debitAmount: mockInvoices[invIndex].invoiceType === "RECEIVABLE" ? mockInvoices[invIndex].totalAmount : 0,
              creditAmount: mockInvoices[invIndex].invoiceType === "PAYABLE" ? mockInvoices[invIndex].totalAmount : 0,
              description: `Receivable/Payable control post`
            },
            ...mockInvoices[invIndex].lines.map((l, idx) => ({
              id: `jl_auto_line_${idx}`,
              accountId: l.accountId,
              accountCode: l.accountCode ?? "5010",
              accountName: l.accountName ?? "Rent/Utilities/Revenue",
              debitAmount: mockInvoices[invIndex].invoiceType === "PAYABLE" ? l.totalPrice : 0,
              creditAmount: mockInvoices[invIndex].invoiceType === "RECEIVABLE" ? l.totalPrice : 0,
              description: l.description
            }))
          ]
        });
        mockInvoices[invIndex].journalEntryId = entryId;
        // Update account balances
        const factor = mockInvoices[invIndex].invoiceType === "RECEIVABLE" ? 1 : -1;
        const controlAccIdx = mockAccounts.findIndex(a => a.id === mockInvoices[invIndex].controlAccountId);
        if (controlAccIdx !== -1) {
          mockAccounts[controlAccIdx].balance = (mockAccounts[controlAccIdx].balance ?? 0) + mockInvoices[invIndex].totalAmount * factor * (mockAccounts[controlAccIdx].normalBalance === "DEBIT" ? 1 : -1);
        }
        mockInvoices[invIndex].lines.forEach(l => {
          const accIdx = mockAccounts.findIndex(a => a.id === l.accountId);
          if (accIdx !== -1) {
            const acc = mockAccounts[accIdx];
            const change = mockInvoices[invIndex].invoiceType === "PAYABLE" ? l.totalPrice : -l.totalPrice;
            const balFactor = acc.normalBalance === "DEBIT" ? 1 : -1;
            acc.balance = (acc.balance ?? 0) + change * balFactor;
          }
        });
        return mockInvoices[invIndex] as any as T;
      }
    }
  }

  if (url.pathname === "/api/fms/payments") {
    if (method === "GET") {
      return {
        content: mockPayments,
        pageNumber: 0,
        pageSize: 50,
        totalElements: mockPayments.length,
        totalPages: 1,
        last: true
      } as any as T;
    }
    if (method === "POST") {
      const req = JSON.parse(init.body as string);
      const invIdx = req.invoiceId ? mockInvoices.findIndex(inv => inv.id === req.invoiceId) : -1;

      let inv: any = null;
      if (invIdx !== -1) {
        inv = mockInvoices[invIdx];
        const payAmount = Math.min(req.amount, inv.remainingBalance);
        inv.paidAmount += payAmount;
        inv.remainingBalance -= payAmount;
        if (inv.remainingBalance <= 0) {
          inv.status = "PAID";
        } else {
          inv.status = "PARTIALLY_PAID";
        }
      }

      const payAmount = req.amount;
      const bankAcc = mockBankAccounts.find(b => b.id === req.bankAccountId);
      const entryId = "j_auto_pay_" + Date.now();
      const newPay: Payment = {
        id: "pay" + (mockPayments.length + 1),
        paymentNumber: req.paymentNumber ?? "PMT-" + Date.now(),
        paymentType: req.paymentType,
        invoiceId: req.invoiceId ?? null,
        invoiceNumber: inv?.invoiceNumber ?? req.invoiceNumber ?? null,
        bankAccountId: req.bankAccountId ?? null,
        bankAccountCode: bankAcc?.glControlAccountCode ?? bankAcc?.accountNumber ?? "BANK-NA",
        bankAccountName: bankAcc?.accountName ?? "Bank Account",
        paymentDate: req.paymentDate,
        amount: payAmount,
        referenceNumber: req.referenceNumber || null,
        status: "COMPLETED",
        journalEntryId: entryId,
        createdBy: "general_accountant",
        createdAt: new Date().toISOString(),
        updatedAt: null
      };
      mockPayments.unshift(newPay);

      if (inv) {
        mockJournals.push({
          id: entryId,
          periodId: inv.periodId,
          periodName: inv.periodName,
          description: `Auto-post Payment ${newPay.paymentNumber}`,
          status: "POSTED",
          createdBy: "system",
          approvedBy: "system",
          postedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: null,
          totalDebit: payAmount,
          totalCredit: payAmount,
          reversalOfJournalId: null,
          isReversal: false,
          lines: [
            {
              id: "jl_pay_1",
              accountId: inv.controlAccountId!,
              accountCode: inv.controlAccountCode!,
              accountName: inv.controlAccountName!,
              debitAmount: req.paymentType === "DISBURSEMENT" ? payAmount : 0,
              creditAmount: req.paymentType === "RECEIPT" ? payAmount : 0,
              description: `Clear invoice liability/receivable`
            },
            {
              id: "jl_pay_2",
              accountId: req.controlAccountId ?? "a2",
              accountCode: "1020",
              accountName: "Bank Current Account",
              debitAmount: req.paymentType === "RECEIPT" ? payAmount : 0,
              creditAmount: req.paymentType === "DISBURSEMENT" ? payAmount : 0,
              description: `Bank cash movement`
            }
          ]
        });

        const controlAccIdx = mockAccounts.findIndex(a => a.id === inv.controlAccountId);
        if (controlAccIdx !== -1) {
          const factor = req.paymentType === "DISBURSEMENT" ? 1 : -1;
          const normalBalFactor = mockAccounts[controlAccIdx].normalBalance === "DEBIT" ? 1 : -1;
          mockAccounts[controlAccIdx].balance = (mockAccounts[controlAccIdx].balance ?? 0) + payAmount * factor * normalBalFactor;
        }
        const bankAccIdx = mockAccounts.findIndex(a => a.id === (req.controlAccountId ?? "a2"));
        if (bankAccIdx !== -1) {
          const factor = req.paymentType === "RECEIPT" ? 1 : -1;
          mockAccounts[bankAccIdx].balance = (mockAccounts[bankAccIdx].balance ?? 0) + payAmount * factor;
        }
      }

      return newPay as any as T;
    }
  }

  // Reports Report Data Generation
  if (url.pathname === "/api/fms/reports/trial-balance") {
    const periodId = url.searchParams.get("periodId");
    const period = mockPeriods.find(p => p.id === periodId) ?? mockPeriods[0];
    const items = mockAccounts.map(a => {
      // simulate turnovers based on journals
      let debits = 0;
      let credits = 0;
      mockJournals.filter(j => j.status === "POSTED" && j.periodId === periodId).forEach(j => {
        j.lines.filter(l => l.accountId === a.id).forEach(l => {
          debits += l.debitAmount;
          credits += l.creditAmount;
        });
      });
      const normalFactor = a.normalBalance === "DEBIT" ? 1 : -1;
      const closing = (a.balance ?? 0); // use current balance for mock simplicity
      const opening = closing - (debits - credits) * normalFactor;

      return {
        accountId: a.id,
        accountCode: a.code,
        accountName: a.name,
        accountType: a.type as any,
        openingBalance: opening,
        debitTurnover: debits,
        creditTurnover: credits,
        closingBalance: closing
      };
    });
    return {
      periodId: period.id,
      periodName: period.periodName,
      items,
      totalDebit: items.reduce((sum, i) => sum + i.debitTurnover, 0),
      totalCredit: items.reduce((sum, i) => sum + i.creditTurnover, 0),
      balanced: true
    } as any as T;
  }

  if (url.pathname === "/api/fms/reports/income-statement") {
    const periodId = url.searchParams.get("periodId");
    const period = mockPeriods.find(p => p.id === periodId) ?? mockPeriods[0];
    const revenueItems = mockAccounts.filter(a => a.type === "REVENUE").map(a => ({
      accountId: a.id,
      accountCode: a.code,
      accountName: a.name,
      amount: a.balance ?? 0,
      depth: 0
    }));
    const expenseItems = mockAccounts.filter(a => a.type === "EXPENSE").map(a => ({
      accountId: a.id,
      accountCode: a.code,
      accountName: a.name,
      amount: a.balance ?? 0,
      depth: 0
    }));
    const totalRev = revenueItems.reduce((sum, i) => sum + i.amount, 0);
    const totalExp = expenseItems.reduce((sum, i) => sum + i.amount, 0);
    return {
      periodId: period.id,
      periodName: period.periodName,
      revenueItems,
      expenseItems,
      totalRevenue: totalRev,
      totalExpense: totalExp,
      netIncome: totalRev - totalExp
    } as any as T;
  }

  if (url.pathname === "/api/fms/reports/balance-sheet") {
    const periodId = url.searchParams.get("periodId");
    const period = mockPeriods.find(p => p.id === periodId) ?? mockPeriods[0];
    const assets = mockAccounts.filter(a => a.type === "ASSET").map(a => ({
      accountId: a.id,
      accountCode: a.code,
      accountName: a.name,
      amount: a.balance ?? 0,
      depth: 0
    }));
    const liabilities = mockAccounts.filter(a => a.type === "LIABILITY").map(a => ({
      accountId: a.id,
      accountCode: a.code,
      accountName: a.name,
      amount: a.balance ?? 0,
      depth: 0
    }));
    const equity = mockAccounts.filter(a => a.type === "EQUITY").map(a => ({
      accountId: a.id,
      accountCode: a.code,
      accountName: a.name,
      amount: a.balance ?? 0,
      depth: 0
    }));

    const totalAssets = assets.reduce((sum, i) => sum + i.amount, 0);
    const totalLiab = liabilities.reduce((sum, i) => sum + i.amount, 0);
    const totalEq = equity.reduce((sum, i) => sum + i.amount, 0);

    return {
      periodId: period.id,
      periodName: period.periodName,
      assetItems: assets,
      liabilityItems: liabilities,
      equityItems: equity,
      totalAssets,
      totalLiabilities: totalLiab,
      totalEquity: totalEq,
      accountingEquationVerifies: Math.abs(totalAssets - (totalLiab + totalEq)) < 0.01
    } as any as T;
  }

  if (url.pathname === "/api/fms/reports/general-ledger") {
    const accountId = url.searchParams.get("accountId") || mockAccounts[0]?.id;
    const periodId = url.searchParams.get("periodId") || mockPeriods[0]?.id;
    const account = mockAccounts.find(a => a.id === accountId) ?? mockAccounts[0];
    const period = mockPeriods.find(p => p.id === periodId) ?? mockPeriods[0];
    const lines = mockJournals.flatMap(j => j.lines.filter(l => l.accountId === accountId).map(l => ({
      id: l.id,
      journalId: j.id,
      date: j.createdAt.slice(0, 10),
      description: l.description ?? j.description,
      debit: l.debitAmount,
      credit: l.creditAmount,
      balance: (l.debitAmount || 0) - (l.creditAmount || 0),
    })));
    const totalDebit = lines.reduce((sum, l) => sum + l.debit, 0);
    const totalCredit = lines.reduce((sum, l) => sum + l.credit, 0);
    return {
      accountId: account.id,
      accountCode: account.code,
      accountName: account.name,
      periodId: period.id,
      periodName: period.periodName,
      openingBalance: 0,
      debitTurnover: totalDebit,
      creditTurnover: totalCredit,
      closingBalance: totalDebit - totalCredit,
      lines,
    } as any as T;
  }

  if (url.pathname === "/api/fms/budgets" && method === "GET") {
    const fiscalYear = Number(url.searchParams.get("fiscalYear") || new Date().getFullYear());
    const items = mockBudgets.filter(b => b.fiscalYear === fiscalYear || !url.searchParams.get("fiscalYear"));
    return {
      content: items,
      pageNumber: 0,
      pageSize: items.length,
      totalElements: items.length,
      totalPages: 1,
      last: true,
    } as any as T;
  }

  if (url.pathname === "/api/fms/budgets" && method === "POST") {
    const body = init.body ? JSON.parse(init.body as string) : {};
    const newBudget: any = {
      id: "mock_budget_" + Date.now(),
      fiscalYear: body.fiscalYear,
      status: "DRAFT",
      description: body.description,
      createdBy: "general_accountant",
      approvedBy: null,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      lines: body.lines?.map((l: any, idx: number) => ({
        id: "bl_" + Date.now() + "_" + idx,
        accountId: l.accountId,
        accountCode: mockAccounts.find(a => a.id === l.accountId)?.code ?? "",
        accountName: mockAccounts.find(a => a.id === l.accountId)?.name ?? "",
        budgetAmount: l.budgetAmount,
        actualAmount: 0,
        variance: 0,
      })) ?? [],
    };
    mockBudgets.unshift(newBudget);
    return newBudget as any as T;
  }

  if (url.pathname.startsWith("/api/fms/budgets/") && url.pathname.endsWith("/submit") && method === "POST") {
    const id = url.pathname.split("/").at(-2);
    const budget = mockBudgets.find(b => b.id === id);
    if (budget) { budget.status = "SUBMITTED"; }
    return budget as any as T;
  }

  if (url.pathname.startsWith("/api/fms/budgets/") && url.pathname.endsWith("/approve") && method === "POST") {
    const id = url.pathname.split("/").at(-2);
    const budget = mockBudgets.find(b => b.id === id);
    if (budget) { budget.status = "APPROVED"; budget.approvedBy = "finance_manager"; }
    return budget as any as T;
  }

  if (url.pathname.startsWith("/api/fms/budgets/") && url.pathname.endsWith("/variance")) {
    const id = url.pathname.split("/").at(-2);
    const budget = mockBudgets.find(b => b.id === id);
    const period = mockPeriods[0];
    return {
      budgetId: budget?.id,
      fiscalYear: budget?.fiscalYear,
      periodId: period?.id,
      periodName: period?.periodName,
      items: budget?.lines?.map(l => ({
        accountId: l.accountId,
        accountCode: l.accountCode,
        accountName: l.accountName,
        budgetAmount: l.budgetAmount,
        actualAmount: l.actualAmount ?? 0,
        variance: (l.actualAmount ?? 0) - l.budgetAmount,
        variancePercent: l.budgetAmount ? (((l.actualAmount ?? 0) - l.budgetAmount) / l.budgetAmount) * 100 : 0,
      })) ?? [],
      totalBudget: budget?.lines?.reduce((s, l) => s + l.budgetAmount, 0) ?? 0,
      totalActual: budget?.lines?.reduce((s, l) => s + (l.actualAmount ?? 0), 0) ?? 0,
      totalVariance: budget?.lines?.reduce((s, l) => s + ((l.actualAmount ?? 0) - l.budgetAmount), 0) ?? 0,
    } as any as T;
  }

  if (url.pathname === "/api/v1/bank-accounts" && method === "GET") {
    return mockBankAccounts as any as T;
  }

  if (url.pathname === "/api/v1/bank-accounts" && method === "POST") {
    const body = init.body ? JSON.parse(init.body as string) : {};
    const newAccount: any = {
      id: "mock_bank_" + Date.now(),
      accountName: body.accountName,
      bankName: body.bankName ?? "",
      accountNumber: body.accountNumber,
      branchCode: body.branchCode ?? body.branch ?? "",
      currency: body.currency ?? "USD",
      openingBalance: body.openingBalance ?? 0,
      currentBalance: body.openingBalance ?? 0,
      glControlAccountId: null,
      glControlAccountCode: null,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };
    mockBankAccounts.unshift(newAccount);
    return newAccount as any as T;
  }

  if (url.pathname.startsWith("/api/v1/bank-accounts/") && !url.pathname.includes("/statements") && !url.pathname.includes("/cash-position") && !url.pathname.includes("/reconciliation-report") && method === "GET") {
    const id = url.pathname.split("/").at(-1);
    const account = mockBankAccounts.find(a => a.id === id);
    return account as any as T;
  }

  if (url.pathname.startsWith("/api/v1/bank-accounts/") && url.pathname.includes("/status") && method === "PATCH") {
    const id = url.pathname.split("/").at(-2);
    const account = mockBankAccounts.find(a => a.id === id);
    if (account) {
      const newStatus = url.searchParams.get("status");
      if (newStatus) account.status = newStatus as any;
    }
    return account as any as T;
  }

  if (url.pathname.startsWith("/api/v1/bank-accounts/") && url.pathname.includes("/cash-position")) {
    const id = url.pathname.split("/").at(-2);
    const account = mockBankAccounts.find(a => a.id === id);
    return {
      bankAccountId: account?.id,
      accountName: account?.accountName,
      bookBalance: account?.currentBalance ?? 0,
      statementBalance: (account?.currentBalance ?? 0) + Math.random() * 100,
      variance: Math.random() * 100,
      unmatchedLines: Math.floor(Math.random() * 5),
    } as any as T;
  }

  if (url.pathname.startsWith("/api/v1/bank-accounts/") && url.pathname.includes("/statements/import")) {
    const body = init.body ? JSON.parse(init.body as string) : [];
    const imported = (body as any[]).map((line: any, idx: number) => ({
      id: "stmt_" + Date.now() + "_" + idx,
      bankAccountId: url.pathname.split("/")[3],
      transactionDate: line.transactionDate,
      description: line.description,
      amount: line.amount,
      type: line.type,
      reference: line.reference,
      reconciliationStatus: "UNMATCHED" as const,
      matchedPaymentId: null,
      createdAt: new Date().toISOString(),
    }));
    mockBankStatementLines.unshift(...imported);
    return imported as any as T;
  }

  if (url.pathname.includes("/statements/") && url.pathname.endsWith("/match") && method === "PATCH") {
    const lineId = url.pathname.split("/").at(-2);
    const paymentId = url.searchParams.get("paymentId");
    const line = mockBankStatementLines.find(l => l.id === lineId);
    if (line) {
      line.reconciliationStatus = "MATCHED";
      line.matchedPaymentId = paymentId ?? null;
    }
    return line as any as T;
  }

  if (url.pathname.includes("/statements/") && url.pathname.endsWith("/flag-exception") && method === "PATCH") {
    const lineId = url.pathname.split("/").at(-2);
    const line = mockBankStatementLines.find(l => l.id === lineId);
    if (line) {
      line.reconciliationStatus = line.reconciliationStatus === "EXCEPTION" ? "UNMATCHED" : "EXCEPTION";
    }
    return line as any as T;
  }

  if (url.pathname.startsWith("/api/v1/bank-accounts/") && url.pathname.includes("/reconciliation-report")) {
    const id = url.pathname.split("/").at(-2);
    const lines = mockBankStatementLines.filter(l => l.bankAccountId === id);
    return {
      content: lines.length ? lines : mockBankStatementLines,
      pageNumber: 0,
      pageSize: 50,
      totalElements: lines.length || mockBankStatementLines.length,
      totalPages: 1,
      last: true,
    } as any as T;
  }

  if (url.pathname === "/api/fms/vendors" && method === "GET") {
    const search = url.searchParams.get("search")?.toLowerCase() || "";
    const status = url.searchParams.get("status");
    let items = mockVendors;
    if (search) items = items.filter(v => `${v.vendorCode} ${v.vendorName} ${v.contactPerson}`.toLowerCase().includes(search));
    if (status) items = items.filter(v => v.status === status);
    return {
      content: items,
      pageNumber: 0,
      pageSize: items.length,
      totalElements: items.length,
      totalPages: 1,
      last: true,
    } as any as T;
  }

  if (url.pathname === "/api/fms/vendors" && method === "POST") {
    const body = init.body ? JSON.parse(init.body as string) : {};
    const newVendor: any = {
      id: "mock_vendor_" + Date.now(),
      ...body,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };
    mockVendors.unshift(newVendor);
    return newVendor as any as T;
  }

  if (url.pathname.startsWith("/api/fms/vendors/") && !url.pathname.includes("/reports") && !url.pathname.includes("/statement") && method === "GET") {
    const id = url.pathname.split("/").at(-1);
    const vendor = mockVendors.find(v => v.id === id);
    return vendor as any as T;
  }

  if (url.pathname.startsWith("/api/fms/vendors/") && method === "PUT") {
    const id = url.pathname.split("/").at(-1);
    const body = init.body ? JSON.parse(init.body as string) : {};
    const vendor = mockVendors.find(v => v.id === id);
    if (vendor) Object.assign(vendor, body);
    return vendor as any as T;
  }

  if (url.pathname.startsWith("/api/fms/vendors/") && method === "DELETE") {
    const id = url.pathname.split("/").at(-1);
    const vendor = mockVendors.find(v => v.id === id);
    if (vendor) vendor.status = "INACTIVE";
    return undefined as any as T;
  }

  if (url.pathname.startsWith("/api/fms/vendors/") && (url.pathname.endsWith("/activate") || url.pathname.endsWith("/deactivate")) && method === "PATCH") {
    const id = url.pathname.split("/").at(-2);
    const vendor = mockVendors.find(v => v.id === id);
    const newStatus = url.pathname.endsWith("/activate") ? "ACTIVE" : "INACTIVE";
    if (vendor) vendor.status = newStatus;
    return vendor as any as T;
  }

  if (url.pathname === "/api/fms/vendors/reports/aging") {
    const asOfDate = url.searchParams.get("asOfDate") || new Date().toISOString().slice(0, 10);
    const items = mockVendors.filter(v => v.status === "ACTIVE").map(v => ({
      vendorId: v.id,
      vendorCode: v.vendorCode,
      vendorName: v.vendorName,
      current: Math.random() * 10000,
      days30: Math.random() * 5000,
      days60: Math.random() * 2000,
      days90: Math.random() * 1000,
      days120: Math.random() * 500,
      totalOutstanding: 0,
    }));
    items.forEach(item => item.totalOutstanding = item.current + item.days30 + item.days60 + item.days90 + item.days120);
    return {
      asOfDate,
      items,
      totalCurrent: items.reduce((s, i) => s + i.current, 0),
      totalDays30: items.reduce((s, i) => s + i.days30, 0),
      totalDays60: items.reduce((s, i) => s + i.days60, 0),
      totalDays90: items.reduce((s, i) => s + i.days90, 0),
      totalDays120: items.reduce((s, i) => s + i.days120, 0),
      grandTotal: items.reduce((s, i) => s + i.totalOutstanding, 0),
    } as any as T;
  }

  if (url.pathname.startsWith("/api/fms/vendors/") && url.pathname.endsWith("/statement")) {
    const id = url.pathname.split("/").at(-2);
    const vendor = mockVendors.find(v => v.id === id);
    const lines = mockJournals.flatMap(j => j.lines.filter(l => l.description?.includes(vendor?.vendorName ?? "") || j.description?.includes(vendor?.vendorName ?? "")).map(l => ({
      journalId: j.id,
      date: j.createdAt.slice(0, 10),
      description: l.description ?? j.description,
      debit: l.debitAmount,
      credit: l.creditAmount,
      balance: l.debitAmount - l.creditAmount,
    })));
    return {
      vendorId: vendor?.id,
      vendorCode: vendor?.vendorCode,
      vendorName: vendor?.vendorName,
      fromDate: mockPeriods[0]?.startDate ?? "",
      toDate: mockPeriods[0]?.endDate ?? "",
      openingBalance: 0,
      closingBalance: lines.reduce((s, l) => s + l.balance, 0),
      lines,
    } as any as T;
  }

  if (url.pathname === "/api/fms/customers" && method === "GET") {
    const search = url.searchParams.get("search")?.toLowerCase() || "";
    const status = url.searchParams.get("status");
    let items = mockCustomers;
    if (search) items = items.filter(c => `${c.customerCode} ${c.customerName} ${c.contactPerson}`.toLowerCase().includes(search));
    if (status) items = items.filter(c => c.status === status);
    return {
      content: items,
      pageNumber: 0,
      pageSize: items.length,
      totalElements: items.length,
      totalPages: 1,
      last: true,
    } as any as T;
  }

  if (url.pathname === "/api/fms/customers" && method === "POST") {
    const body = init.body ? JSON.parse(init.body as string) : {};
    const newCustomer: any = {
      id: "mock_customer_" + Date.now(),
      ...body,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };
    mockCustomers.unshift(newCustomer);
    return newCustomer as any as T;
  }

  if (url.pathname.startsWith("/api/fms/customers/") && !url.pathname.includes("/reports") && !url.pathname.includes("/statement") && method === "GET") {
    const id = url.pathname.split("/").at(-1);
    const customer = mockCustomers.find(c => c.id === id);
    return customer as any as T;
  }

  if (url.pathname.startsWith("/api/fms/customers/") && method === "PUT") {
    const id = url.pathname.split("/").at(-1);
    const body = init.body ? JSON.parse(init.body as string) : {};
    const customer = mockCustomers.find(c => c.id === id);
    if (customer) Object.assign(customer, body);
    return customer as any as T;
  }

  if (url.pathname === "/api/fms/customers/reports/aging") {
    const asOfDate = url.searchParams.get("asOfDate") || new Date().toISOString().slice(0, 10);
    const items = mockCustomers.filter(c => c.status === "ACTIVE").map(c => ({
      customerId: c.id,
      customerCode: c.customerCode,
      customerName: c.customerName,
      current: Math.random() * 10000,
      days30: Math.random() * 5000,
      days60: Math.random() * 2000,
      days90: Math.random() * 1000,
      days120: Math.random() * 500,
      totalOutstanding: 0,
    }));
    items.forEach(item => item.totalOutstanding = item.current + item.days30 + item.days60 + item.days90 + item.days120);
    return {
      asOfDate,
      items,
      totalCurrent: items.reduce((s, i) => s + i.current, 0),
      totalDays30: items.reduce((s, i) => s + i.days30, 0),
      totalDays60: items.reduce((s, i) => s + i.days60, 0),
      totalDays90: items.reduce((s, i) => s + i.days90, 0),
      totalDays120: items.reduce((s, i) => s + i.days120, 0),
      grandTotal: items.reduce((s, i) => s + i.totalOutstanding, 0),
    } as any as T;
  }

  if (url.pathname.startsWith("/api/fms/customers/") && url.pathname.endsWith("/statement")) {
    const id = url.pathname.split("/").at(-2);
    const customer = mockCustomers.find(c => c.id === id);
    const lines = mockJournals.flatMap(j => j.lines.filter(l => l.description?.includes(customer?.customerName ?? "") || j.description?.includes(customer?.customerName ?? "")).map(l => ({
      journalId: j.id,
      date: j.createdAt.slice(0, 10),
      description: l.description ?? j.description,
      debit: l.debitAmount,
      credit: l.creditAmount,
      balance: l.creditAmount - l.debitAmount,
    })));
    return {
      customerId: customer?.id,
      customerCode: customer?.customerCode,
      customerName: customer?.customerName,
      fromDate: mockPeriods[0]?.startDate ?? "",
      toDate: mockPeriods[0]?.endDate ?? "",
      openingBalance: 0,
      closingBalance: lines.reduce((s, l) => s + l.balance, 0),
      lines,
    } as any as T;
  }

  if (url.pathname === "/api/v1/audit-logs" && method === "GET") {
    const entityType = url.searchParams.get("entityType");
    const performedBy = url.searchParams.get("performedBy");
    const action = url.searchParams.get("action");
    let items = mockAuditLogs;
    if (entityType) items = items.filter(l => l.entityType === entityType);
    if (performedBy) items = items.filter(l => l.performedBy === performedBy);
    if (action) items = items.filter(l => l.action === action);
    return {
      content: items,
      pageNumber: 0,
      pageSize: items.length,
      totalElements: items.length,
      totalPages: 1,
      last: true,
    } as any as T;
  }

  if (url.pathname.startsWith("/api/v1/audit-logs/") && method === "GET") {
    const id = url.pathname.split("/").at(-1);
    const log = mockAuditLogs.find(l => l.id === id);
    return log as any as T;
  }

  throw new FmsApiError(`Mock handler not implemented for ${path}`, 404);
}
