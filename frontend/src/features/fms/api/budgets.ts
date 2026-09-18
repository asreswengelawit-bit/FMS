import { fmsFetch } from "./fms-client";
import type { Budget, CreateBudgetInput, BudgetVarianceReport, PagedResponse } from "../types/fms";

export async function listBudgets(params?: { fiscalYear?: number; status?: string; page?: number; size?: number }): Promise<PagedResponse<Budget>> {
  const sp = new URLSearchParams();
  if (params?.fiscalYear) sp.set("fiscalYear", String(params.fiscalYear));
  if (params?.status) sp.set("status", params.status);
  sp.set("page", String(params?.page ?? 0));
  sp.set("size", String(params?.size ?? 20));
  return fmsFetch<PagedResponse<Budget>>(`/api/fms/budgets?${sp.toString()}`);
}

export async function getBudget(id: string): Promise<Budget> {
  return fmsFetch<Budget>(`/api/fms/budgets/${id}`);
}

export async function createBudget(input: CreateBudgetInput): Promise<Budget> {
  return fmsFetch<Budget>("/api/fms/budgets", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function submitBudget(id: string): Promise<Budget> {
  return fmsFetch<Budget>(`/api/fms/budgets/${id}/submit`, { method: "POST" });
}

export async function approveBudget(id: string): Promise<Budget> {
  return fmsFetch<Budget>(`/api/fms/budgets/${id}/approve`, { method: "POST" });
}

export async function getBudgetVariance(id: string, periodId?: string): Promise<BudgetVarianceReport> {
  const sp = new URLSearchParams();
  if (periodId) sp.set("periodId", periodId);
  return fmsFetch<BudgetVarianceReport>(`/api/fms/budgets/${id}/variance?${sp.toString()}`);
}
