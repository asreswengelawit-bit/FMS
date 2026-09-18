import { fmsFetch } from "./fms-client";
import type {
  JournalEntry,
  CreateJournalEntryInput,
  AccountingPeriod,
  CreatePeriodInput,
  PeriodCloseChecklist,
  PagedResponse,
} from "../types/fms";

export async function listJournals(): Promise<PagedResponse<JournalEntry>> {
  return fmsFetch<PagedResponse<JournalEntry>>("/api/fms/journal?page=0&size=50");
}

export async function createJournal(input: CreateJournalEntryInput): Promise<JournalEntry> {
  return fmsFetch<JournalEntry>("/api/fms/journal", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function submitJournal(id: string): Promise<JournalEntry> {
  return fmsFetch<JournalEntry>(`/api/fms/journal/${id}/submit`, {
    method: "POST",
  });
}

export async function approveJournal(id: string): Promise<JournalEntry> {
  return fmsFetch<JournalEntry>(`/api/fms/journal/${id}/approve`, {
    method: "POST",
  });
}

export async function postJournal(id: string): Promise<JournalEntry> {
  return fmsFetch<JournalEntry>(`/api/fms/journal/${id}/post`, {
    method: "POST",
  });
}

// Periods
export async function listPeriods(): Promise<AccountingPeriod[]> {
  return fmsFetch<AccountingPeriod[]>("/api/fms/periods");
}

export async function openPeriod(input: CreatePeriodInput): Promise<AccountingPeriod> {
  return fmsFetch<AccountingPeriod>("/api/fms/periods", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function closePeriod(id: string): Promise<AccountingPeriod> {
  return fmsFetch<AccountingPeriod>(`/api/fms/periods/${id}/close`, {
    method: "POST",
  });
}

export async function softClosePeriod(id: string, closeNotes?: string): Promise<AccountingPeriod> {
  const sp = new URLSearchParams();
  if (closeNotes) sp.set("closeNotes", closeNotes);
  return fmsFetch<AccountingPeriod>(`/api/fms/periods/${id}/soft-close?${sp.toString()}`, {
    method: "POST",
  });
}

export async function reopenPeriod(id: string, request?: { reason: string }): Promise<AccountingPeriod> {
  return fmsFetch<AccountingPeriod>(`/api/fms/periods/${id}/reopen`, {
    method: "POST",
    body: request ? JSON.stringify(request) : undefined,
  });
}

export async function runPreCloseChecklist(id: string): Promise<PeriodCloseChecklist> {
  return fmsFetch<PeriodCloseChecklist>(`/api/fms/periods/${id}/pre-close-checklist`);
}
