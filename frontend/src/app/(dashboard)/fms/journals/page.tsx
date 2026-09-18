import { listJournals } from "@/features/fms/api/journals";
import { listAccounts } from "@/features/fms/api/coa";
import { listPeriods } from "@/features/fms/api/journals";
import JournalManager from "@/features/fms/components/JournalManager";

export default async function JournalsPage() {
  const [journalsData, accountsData, periods] = await Promise.all([
    listJournals(),
    listAccounts({ page: 0, size: 50 }),
    listPeriods(),
  ]);

  return (
    <JournalManager
      initialJournals={journalsData.content ?? []}
      accounts={accountsData.content ?? []}
      periods={periods}
    />
  );
}
