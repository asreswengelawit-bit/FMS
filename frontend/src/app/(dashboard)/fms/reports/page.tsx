import { listPeriods } from "@/features/fms/api/journals";
import { listAccounts } from "@/features/fms/api/coa";
import ReportsManager from "@/features/fms/components/ReportsManager";

export default async function ReportsPage() {
  const [periods, accounts] = await Promise.all([
    listPeriods(),
    listAccounts({ page: 0, size: 50 }),
  ]);

  return <ReportsManager initialPeriods={periods} accounts={accounts.content ?? []} />;
}
