"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Account, AccountingPeriod, Invoice, JournalEntry, Payment, PeriodCloseChecklist } from "../types";
import { fmsApi } from "../api/http-client";

type Toast = { id: number; message: string; tone: "success" | "error" | "info" };

interface FmsState {
  accounts: Account[];
  periods: AccountingPeriod[];
  journals: JournalEntry[];
  invoices: Invoice[];
  payments: Payment[];
  loading: boolean;
  error: string | null;
  user: FmsUser;
  toasts: Toast[];
  canWrite: boolean;
  notify(message: string, tone?: Toast["tone"]): void;
  dismissToast(id: number): void;
}

const demoUser: FmsUser = {
  id: "USR-101",
  name: "General Accountant",
  role: "general_accountant",
  permissions: ["fms:read", "fms:write", "fms:post"],
};

const initial: Omit<FmsState, "loading" | "error" | "user" | "toasts" | "canWrite" | "notify" | "dismissToast"> = {
  accounts: [],
  periods: [],
  journals: [],
  invoices: [],
  payments: [],
};

type FmsUser = {
  id: string;
  name: string;
  role: string;
  permissions: string[];
};

const Context = createContext<FmsState | null>(null);

export function FmsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<FmsState>(() => ({
    ...initial,
    loading: false,
    error: null,
    user: demoUser,
    toasts: [],
    canWrite: true,
    notify: () => {},
    dismissToast: () => {},
  }));

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isLive = Boolean(process.env.NEXT_PUBLIC_FMS_API_URL);
    if (!isLive) return;
    setState(s => ({ ...s, loading: true, error: null }));
    Promise.all([
      fmsApi.listAccounts(),
      fmsApi.listPeriods(),
      fmsApi.listJournals(),
      fmsApi.listInvoices(),
      fmsApi.listPayments(),
    ])
      .then(([accounts, periods, journals, invoices, payments]) => {
        setState(s => ({
          ...s,
          accounts: accounts ?? [],
          periods: periods ?? [],
          journals: journals ?? [],
          invoices: invoices ?? [],
          payments: payments ?? [],
          loading: false,
        }));
      })
      .catch(err => setState(s => ({ ...s, error: err.message, loading: false })));
  }, []);

  const notify = useCallback((message: string, tone: Toast["tone"] = "success") => {
    const id = Date.now();
    setState(s => ({ ...s, toasts: [...s.toasts, { id, message, tone }] }));
    setTimeout(() => {
      setState(s => ({ ...s, toasts: s.toasts.filter(t => t.id !== id) }));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setState(s => ({ ...s, toasts: s.toasts.filter(t => t.id !== id) }));
  }, []);

  const value = useMemo(() => ({
    ...state,
    canWrite: state.user.permissions.includes("fms:write"),
    notify,
    dismissToast,
  }), [state, notify, dismissToast]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useFms() {
  const value = useContext(Context);
  if (!value) throw new Error("useFms must be used inside FmsProvider");
  return value;
}
