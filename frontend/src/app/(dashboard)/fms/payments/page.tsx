import { listPayments } from "@/features/fms/api/payments";
import { listInvoices } from "@/features/fms/api/invoices";
import { listAccounts } from "@/features/fms/api/coa";
import { listBankAccounts } from "@/features/fms/api/bank";
import PaymentManager from "@/features/fms/components/PaymentManager";

export default async function PaymentsPage() {
  const [paymentsData, invoicesData, accountsData, bankAccounts] = await Promise.all([
    listPayments(),
    listInvoices(),
    listAccounts({ page: 0, size: 50 }),
    listBankAccounts(),
  ]);

  return (
    <PaymentManager
      initialPayments={paymentsData.content ?? []}
      invoices={invoicesData.content ?? []}
      accounts={accountsData.content ?? []}
      bankAccounts={bankAccounts ?? []}
    />
  );
}