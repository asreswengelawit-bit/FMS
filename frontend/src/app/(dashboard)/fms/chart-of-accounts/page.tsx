import { listAccounts } from "@/features/fms/api/coa";
import CoaManager from "@/features/fms/components/CoaManager";

export default async function ChartOfAccountsPage() {
  const data = await listAccounts({ page: 0, size: 50 });
  const accounts = data.content ?? [];

  return <CoaManager initialAccounts={accounts} />;
}
