import { listAccounts } from "@/features/fms/api/coa";
import { listPeriods, listJournals } from "@/features/fms/api/journals";
import { listInvoices } from "@/features/fms/api/invoices";
import { listPayments } from "@/features/fms/api/payments";
import { listBudgets } from "@/features/fms/api/budgets";
import { listBankAccounts } from "@/features/fms/api/bank";
import FmsDashboard from "@/features/fms/components/FmsDashboard";

export default async function FmsHomePage() {
  const [accountsRes, periods, journalsRes, invoicesRes, paymentsRes, budgetsRes, bankAccounts] =
    await Promise.all([
      listAccounts({ page: 0, size: 50 }),
      listPeriods(),
      listJournals(),
      listInvoices(),
      listPayments(),
      listBudgets({ page: 0, size: 20 }),
      listBankAccounts(),
    ]);

  return (
    <FmsDashboard
      accounts={accountsRes.content ?? []}
      periods={periods ?? []}
      journals={journalsRes.content ?? []}
      invoices={invoicesRes.content ?? []}
      payments={paymentsRes.content ?? []}
      budgets={budgetsRes.content ?? []}
      bankAccounts={bankAccounts ?? []}
    />
  );
}