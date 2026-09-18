import type { Account, AccountingPeriod, Invoice, JournalEntry, Payment } from "../types";

const API_URL = process.env.NEXT_PUBLIC_FMS_API_URL?.replace(/\/$/, "");
const MOCK_ROLES = "FINANCE_ADMINISTRATOR,GENERAL_ACCOUNTANT,AP_OFFICER,AR_OFFICER,FINANCE_MANAGER";

async function accessToken(): Promise<string | null> {
  const stored = typeof window !== "undefined"
    ? sessionStorage.getItem("erp_access_token")
    : null;
  if (stored) return stored;

  if (typeof window === "undefined") return null;
  const response = await fetch("/api/auth/session", { credentials: "same-origin" });
  if (!response.ok) return null;
  const session = await response.json() as { accessToken?: string };
  return session.accessToken ?? null;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_URL) throw new Error("NEXT_PUBLIC_FMS_API_URL is not configured");
  const token = await accessToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(process.env.NEXT_PUBLIC_AUTH_MODE === "demo" ? { "X-Mock-Roles": MOCK_ROLES } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(body?.message ?? `Request failed with status ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

// Returns the wrapped `data` payload when the FMS envelope ({ data: ... }) is present,
// otherwise returns the body as-is.
async function unwrap<T>(path: string, init?: RequestInit): Promise<T> {
  const body = await request<T>(path, init);
  if (body && typeof body === "object" && "data" in body && (body as any).data !== undefined) {
    return (body as any).data as T;
  }
  return body;
}

// Returns `.content` when the response is a Spring-style Page, otherwise the array.
async function unwrapPage<T>(path: string, init?: RequestInit): Promise<T[]> {
  const body = await request<any>(path, init);
  const data = body && typeof body === "object" && "data" in body ? body.data : body;
  if (Array.isArray(data)) return data as T[];
  if (data && Array.isArray(data.content)) return data.content as T[];
  return (body as any)?.content ?? [];
}

export const fmsApi = {
  listAccounts: () => unwrapPage<Account>("/api/v1/accounts?page=0&size=50", { cache: "no-store" }),
  listPeriods: () => unwrap<AccountingPeriod[]>("/api/fms/periods", { cache: "no-store" }),
  listJournals: () => unwrapPage<JournalEntry>("/api/fms/journal?page=0&size=50", { cache: "no-store" }),
  listInvoices: () => unwrapPage<Invoice>("/api/fms/invoices?page=0&size=50", { cache: "no-store" }),
  listPayments: () => unwrapPage<Payment>("/api/fms/payments?page=0&size=50", { cache: "no-store" }),
};
