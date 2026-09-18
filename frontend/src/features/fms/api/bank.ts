import { fmsFetch } from "./fms-client";
import type { BankAccount, CreateBankAccountInput, CashPosition, BankStatementLine, PagedResponse, ImportStatementLineInput } from "../types/fms";

export async function listBankAccounts(): Promise<BankAccount[]> {
  return fmsFetch<BankAccount[]>("/api/v1/bank-accounts");
}

export async function getBankAccount(id: string): Promise<BankAccount> {
  return fmsFetch<BankAccount>(`/api/v1/bank-accounts/${id}`);
}

export async function createBankAccount(input: CreateBankAccountInput): Promise<BankAccount> {
  return fmsFetch<BankAccount>("/api/v1/bank-accounts", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateBankAccountStatus(id: string, status: "ACTIVE" | "INACTIVE"): Promise<BankAccount> {
  return fmsFetch<BankAccount>(`/api/v1/bank-accounts/${id}/status?status=${status}`, { method: "PATCH" });
}

export async function getCashPosition(id: string): Promise<CashPosition> {
  return fmsFetch<CashPosition>(`/api/v1/bank-accounts/${id}/cash-position`);
}

export async function importStatementLines(id: string, lines: ImportStatementLineInput[]): Promise<BankStatementLine[]> {
  return fmsFetch<BankStatementLine[]>(`/api/v1/bank-accounts/${id}/statements/import`, {
    method: "POST",
    body: JSON.stringify(lines),
  });
}

export async function getReconciliationReport(id: string, params?: { status?: string; page?: number; size?: number }): Promise<PagedResponse<BankStatementLine>> {
  const sp = new URLSearchParams();
  if (params?.status) sp.set("status", params.status);
  sp.set("page", String(params?.page ?? 0));
  sp.set("size", String(params?.size ?? 50));
  return fmsFetch<PagedResponse<BankStatementLine>>(`/api/v1/bank-accounts/${id}/reconciliation-report?${sp.toString()}`);
}

export async function manualMatch(lineId: string, paymentId: string): Promise<BankStatementLine> {
  return fmsFetch<BankStatementLine>(`/api/v1/bank-accounts/statements/${lineId}/match?paymentId=${paymentId}`, { method: "PATCH" });
}

export async function flagException(lineId: string): Promise<BankStatementLine> {
  return fmsFetch<BankStatementLine>(`/api/v1/bank-accounts/statements/${lineId}/flag-exception`, { method: "PATCH" });
}
