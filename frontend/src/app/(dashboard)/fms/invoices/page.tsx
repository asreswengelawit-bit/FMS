import { listInvoices } from "@/features/fms/api/invoices";
import { listAccounts } from "@/features/fms/api/coa";
import { listPeriods } from "@/features/fms/api/journals";
import InvoiceManager from "@/features/fms/components/InvoiceManager";

export default async function InvoicesPage() {
  const [invoicesData, accountsData, periods] = await Promise.all([
    listInvoices(),
    listAccounts({ page: 0, size: 50 }),
    listPeriods(),
  ]);

  return (
    <InvoiceManager
      initialInvoices={invoicesData.content ?? []}
      accounts={accountsData.content ?? []}
      periods={periods}
    />
  );
}
