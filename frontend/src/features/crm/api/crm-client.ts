import { auth } from "@/auth";
import type { CrmApiResponse } from "@/features/crm/types/customer";

const CRM_API_BASE =
  process.env.CRM_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:8082";

export class CrmApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "CrmApiError";
    this.status = status;
  }
}

async function accessToken(): Promise<string> {
  const session = await auth();
  const token = session?.accessToken;
  if (!token) {
    throw new CrmApiError("You must be signed in to use CRM.", 401);
  }
  return token;
}

export async function crmFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = await accessToken();
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Accept", "application/json");
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${CRM_API_BASE}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  let payload: CrmApiResponse<T> | null = null;
  try {
    payload = (await res.json()) as CrmApiResponse<T>;
  } catch {
    payload = null;
  }

  if (!res.ok) {
    if (res.status === 401) {
      throw new CrmApiError(
        "Your login session expired. Sign out and sign in again, then retry.",
        401,
      );
    }
    const msg =
      payload?.message ||
      payload?.errors?.join(", ") ||
      `CRM request failed (${res.status})`;
    throw new CrmApiError(msg, res.status);
  }

  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data;
  }

  throw new CrmApiError("Unexpected CRM response shape.", res.status);
}

export function crmBaseUrl(): string {
  return CRM_API_BASE;
}
