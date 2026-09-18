import { fmsFetch } from "./fms-client";
import type { Account, CreateAccountInput, PagedResponse } from "../types/fms";

export type ListAccountsParams = {
  type?: string;
  status?: string;
  page?: number;
  size?: number;
};

export async function listAccounts(
  params: ListAccountsParams = {},
): Promise<PagedResponse<Account>> {
  const sp = new URLSearchParams();
  if (params.type) sp.set("type", params.type);
  if (params.status) sp.set("status", params.status);
  sp.set("page", String(params.page ?? 0));
  sp.set("size", String(params.size ?? 50));
  return fmsFetch<PagedResponse<Account>>(`/api/v1/accounts?${sp.toString()}`);
}

export async function createAccount(input: CreateAccountInput): Promise<Account> {
  return fmsFetch<Account>("/api/v1/accounts", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function toggleAccountStatus(id: string): Promise<Account> {
  return fmsFetch<Account>(`/api/v1/accounts/${id}/status`, {
    method: "PATCH",
  });
}
