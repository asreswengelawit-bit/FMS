import { listBankAccounts } from "@/features/fms/api/bank";
import { listAccounts } from "@/features/fms/api/coa";
import BankManager from "@/features/fms/components/BankManager";

export default async function BankAccountsPage() {
  const [accounts, glAccounts] = await Promise.all([
    listBankAccounts(),
    listAccounts({ page: 0, size: 50 }),
  ]);

  return <BankManager initialAccounts={accounts} accounts={glAccounts.content ?? []} />;
}
