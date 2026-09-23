"use client";

import {
  Landmark,
  Wallet,
  Receipt,
  TrendingUp,
  TrendingDown,
  CircleDollarSign,
  FileText,
  ArrowRight,
  LogOut,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { Account, AccountingPeriod, JournalEntry, Invoice, Payment, BankAccount, Budget } from "../types/fms";
import { KPICard } from "@/features/shared/components/KPICard";
import { StatusBadge } from "@/features/shared/components/StatusBadge";
import { PageHeader } from "@/features/shared/components/PageHeader";
import { Button } from "@/features/shared/components/ui/button";
import { federatedSignOut } from "@/features/shared/auth/actions";
import Link from "next/link";

interface FmsDashboardProps {
  accounts: Account[];
  periods: AccountingPeriod[];
  journals: JournalEntry[];
  invoices: Invoice[];
  payments: Payment[];
  budgets: Budget[];
  bankAccounts: BankAccount[];
}

function formatMoney(value: number): string {
  return `$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export default function FmsDashboard({
  accounts,
  periods,
  journals,
  invoices,
  budgets,
  bankAccounts,
}: FmsDashboardProps) {
  const assets = accounts
    .filter(a => a.type === "ASSET")
    .reduce((sum, a) => sum + (a.balance ?? 0), 0);
  const liabilities = accounts
    .filter(a => a.type === "LIABILITY")
    .reduce((sum, a) => sum + (a.balance ?? 0), 0);
  const equity = accounts
    .filter(a => a.type === "EQUITY")
    .reduce((sum, a) => sum + (a.balance ?? 0), 0);
  const revenue = accounts
    .filter(a => a.type === "REVENUE")
    .reduce((sum, a) => sum + (a.balance ?? 0), 0);
  const expenses = accounts
    .filter(a => a.type === "EXPENSE")
    .reduce((sum, a) => sum + (a.balance ?? 0), 0);
  const netIncome = revenue - expenses;
  const cash = bankAccounts.reduce((sum, b) => sum + (b.currentBalance ?? 0), 0);

  const openPeriods = periods.filter(p => p.status === "OPEN");
  const postedJournals = journals.filter(j => j.status === "POSTED");

  const apOutstanding = invoices
    .filter(i => i.invoiceType === "PAYABLE")
    .reduce((sum, i) => sum + (i.remainingBalance ?? 0), 0);
  const arOutstanding = invoices
    .filter(i => i.invoiceType === "RECEIVABLE")
    .reduce((sum, i) => sum + (i.remainingBalance ?? 0), 0);

  const utilRatio = (actual: number, budget: number): string =>
    budget > 0 ? `${((actual / budget) * 100).toFixed(0)}%` : "--";

  const budgetUtilization = budgets
    .filter(b => b.status === "APPROVED" || b.status === "ACTIVE")
    .map(b => {
      const allocated = b.lines.reduce((s, l) => s + (l.budgetAmount || l.budgetedAmount || 0), 0);
      const actual = b.lines.reduce((s, l) => s + (l.actualAmount || l.budgetedAmount || 0), 0);
      return {
        fiscalYear: b.fiscalYear,
        budgeted: allocated,
        actual,
        ratio: utilRatio(actual, allocated),
      };
    })[0] ?? { fiscalYear: new Date().getFullYear(), budgeted: 0, actual: 0, ratio: "--" };

  const expenseBudgetData = budgets
    .filter(b => b.status === "APPROVED" || b.status === "ACTIVE")
    .slice(0, 1)
    .flatMap(b =>
      b.lines.map(l => ({
        name: l.accountName.length > 14 ? l.accountName.slice(0, 13) + "…" : l.accountName,
        Budgeted: l.budgetAmount || l.budgetedAmount || 0,
        Actual: l.actualAmount || l.budgetedAmount || 0,
      })),
    );

  const recentJournals = [...postedJournals]
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
    .slice(0, 5);
  const recentInvoices = [...invoices]
    .sort((a, b) => (a.createdAt ?? "").localeCompare(b.createdAt ?? ""))
    .slice(0, 5);

  const balancesOk = Math.abs(assets - (liabilities + equity)) < 1;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Finance Dashboard"
        subtitle="Accounts, cash position, and recent activity"
        action={
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background: "#F0FDF4", color: "#16A34A" }}>
              {openPeriods.length} Open {openPeriods.length === 1 ? "Period" : "Periods"}
            </span>
            <Button size="sm" asChild variant="outline">
              <Link href="/fms/reports">
                View Reports <ArrowRight size={14} />
              </Link>
            </Button>
            <form action={federatedSignOut}>
              <Button size="sm" variant="outline" type="submit">
                Logout <LogOut size={14} />
              </Button>
            </form>
          </div>
        }
      />

      {/* Financial summary banner */}
      <div className="flex items-center justify-between bg-white rounded-xl border shadow-sm px-4 py-3" style={{ borderColor: "#E8EDF5" }}>
        <div>
          <p className="text-xs text-muted-foreground">Balance Sheet Verification</p>
          <p className="text-sm font-bold mt-0.5" style={{ color: balancesOk ? "#16A34A" : "#C8102E" }}>
            {balancesOk ? "Assets = Liabilities + Equity" : "Out of balance"}
          </p>
        </div>
        <div className="flex items-center gap-6 text-right">
          <div>
            <p className="text-xs text-muted-foreground">Total Assets</p>
            <p className="text-sm font-bold" style={{ color: "#0B1E3D" }}>{formatMoney(assets)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Liabilities</p>
            <p className="text-sm font-bold" style={{ color: "#0B1E3D" }}>{formatMoney(liabilities)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Equity</p>
            <p className="text-sm font-bold" style={{ color: "#0B1E3D" }}>{formatMoney(equity)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Net Income YTD</p>
            <p className="text-sm font-bold" style={{ color: netIncome >= 0 ? "#16A34A" : "#C8102E" }}>{formatMoney(netIncome)}</p>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={Landmark}
          label="Total Cash & Bank"
          value={formatMoney(cash)}
          subtext={`${bankAccounts.length} active account${bankAccounts.length === 1 ? "" : "s"}`}
          color="#16A34A"
        />
        <KPICard
          icon={Receipt}
          label="Accounts Receivable"
          value={formatMoney(arOutstanding)}
          subtext={`${invoices.filter(i => i.invoiceType === "RECEIVABLE" && (i.remainingBalance ?? 0) > 0).length} open invoices`}
          color="#2563EB"
        />
        <KPICard
          icon={Wallet}
          label="Accounts Payable"
          value={formatMoney(apOutstanding)}
          subtext={`${invoices.filter(i => i.invoiceType === "PAYABLE" && (i.remainingBalance ?? 0) > 0).length} open invoices`}
          color="#C8102E"
        />
        <KPICard
          icon={netIncome >= 0 ? TrendingUp : TrendingDown}
          label="Net Income (YTD)"
          value={formatMoney(netIncome)}
          subtext={`${formatMoney(revenue)} revenue · ${formatMoney(expenses)} expenses`}
          color={netIncome >= 0 ? "#16A34A" : "#C8102E"}
        />
      </div>

      {/* Budget + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Budget utilization */}
        <div className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5" }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-bold" style={{ color: "#0B1E3D" }}>Budget Utilization</p>
              <p className="text-xs text-muted-foreground">FY{budgetUtilization.fiscalYear} operating budget</p>
            </div>
            <CircleDollarSign className="h-5 w-5" style={{ color: "#7C3AED" }} />
          </div>
          {budgetUtilization.budgeted > 0 && (
            <>
              <div className="flex items-end justify-between mb-1">
                <span className="text-2xl font-bold" style={{ color: "#0B1E3D" }}>{budgetUtilization.ratio}</span>
                <span className="text-xs text-muted-foreground">
                  {formatMoney(budgetUtilization.actual)} / {formatMoney(budgetUtilization.budgeted)}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: budgetUtilization.budgeted > 0
                      ? `${Math.min(100, (budgetUtilization.actual / budgetUtilization.budgeted) * 100)}%`
                      : "0%",
                    background: "#7C3AED",
                  }}
                />
              </div>
            </>
          )}
          {budgetUtilization.budgeted === 0 && (
            <p className="text-sm text-muted-foreground">No approved budget found for the current fiscal year.</p>
          )}
        </div>

        {/* Expense budget chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5" }}>
          <p className="text-sm font-bold mb-3" style={{ color: "#0B1E3D" }}>Budget vs Actual</p>
          {expenseBudgetData.length > 0 ? (
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={expenseBudgetData} barSize={16} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF5" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid #E8EDF5", fontSize: 12 }}
                  formatter={(v: any) => [`$${Number(v).toLocaleString()}`, ""]}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Budgeted" fill="#A78BFA" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Actual" fill="#7C3AED" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground">No budget lines to display.</p>
          )}
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent journals */}
        <div className="bg-white rounded-xl border shadow-sm" style={{ borderColor: "#E8EDF5" }}>
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <p className="text-sm font-bold flex items-center gap-1.5" style={{ color: "#0B1E3D" }}>
              <FileText className="h-4 w-4" style={{ color: "#2563EB" }} /> Recent Journal Entries
            </p>
            <Link href="/fms/journals" className="text-xs font-semibold" style={{ color: "#2563EB" }}>View all</Link>
          </div>
          <div className="px-4 pb-4 space-y-2">
            {recentJournals.length === 0 && <p className="text-sm text-muted-foreground py-2">No posted journal entries.</p>}
            {recentJournals.map(j => (
              <div key={j.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "#F8FAFC" }}>
                <div>
                  <p className="text-xs font-mono font-semibold" style={{ color: "#0B1E3D" }}>{j.id}</p>
                  <p className="text-sm text-muted-foreground">{j.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={j.status} />
                  <span className="text-xs text-muted-foreground">{j.periodName}</span>
                  <span className="text-sm font-bold" style={{ color: "#0B1E3D" }}>{formatMoney(j.totalDebit)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent invoices */}
        <div className="bg-white rounded-xl border shadow-sm" style={{ borderColor: "#E8EDF5" }}>
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <p className="text-sm font-bold flex items-center gap-1.5" style={{ color: "#0B1E3D" }}>
              <Receipt className="h-4 w-4" style={{ color: "#C8102E" }} /> Recent Invoices
            </p>
            <Link href="/fms/invoices" className="text-xs font-semibold" style={{ color: "#2563EB" }}>View all</Link>
          </div>
          <div className="px-4 pb-4 space-y-2">
            {recentInvoices.length === 0 && <p className="text-sm text-muted-foreground py-2">No invoices recorded.</p>}
            {recentInvoices.map(i => (
              <div key={i.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "#F8FAFC" }}>
                <div>
                  <p className="text-xs font-mono font-semibold" style={{ color: "#0B1E3D" }}>{i.invoiceNumber}</p>
                  <p className="text-sm text-muted-foreground">{i.partyName}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs px-1.5 py-0.5 rounded font-semibold"
                    style={{ background: i.invoiceType === "PAYABLE" ? "#FFF1F3" : "#EEF2FF", color: i.invoiceType === "PAYABLE" ? "#C8102E" : "#2563EB" }}>
                    {i.invoiceType === "PAYABLE" ? "AP" : "AR"}
                  </span>
                  <StatusBadge status={i.status} />
                  <span className="text-sm font-bold" style={{ color: "#0B1E3D" }}>{formatMoney(i.totalAmount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}