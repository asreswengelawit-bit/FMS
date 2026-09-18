import { listBudgets } from "@/features/fms/api/budgets";
import { listAccounts } from "@/features/fms/api/coa";
import { listPeriods } from "@/features/fms/api/journals";
import BudgetManager from "@/features/fms/components/BudgetManager";

export default async function BudgetsPage() {
  const [budgets, accounts, periods] = await Promise.all([
    listBudgets(),
    listAccounts({ page: 0, size: 50 }),
    listPeriods(),
  ]);

  return <BudgetManager initialBudgets={budgets.content ?? []} accounts={accounts.content ?? []} initialPeriods={periods ?? []} />;
}
