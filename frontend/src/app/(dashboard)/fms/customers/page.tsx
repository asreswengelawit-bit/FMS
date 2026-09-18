import { listCustomers } from "@/features/fms/api/customers";
import CustomerManager from "@/features/fms/components/CustomerManager";

export default async function CustomersPage() {
  const customers = await listCustomers();

  return <CustomerManager initialCustomers={customers.content ?? []} />;
}
