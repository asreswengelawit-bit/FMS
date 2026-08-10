import Link from "next/link";
import CustomerCreateForm from "@/features/crm/components/CustomerCreateForm";
import CrmModuleHeader from "@/features/crm/components/CrmModuleHeader";
import { Button } from "@/features/shared/components/ui/button";

export default function NewCustomerPage() {
  return (
    <div className="flex flex-col gap-4">
      <CrmModuleHeader section="New Customer" />
      <Button asChild variant="ghost" className="w-fit px-0">
        <Link href="/crm/customers">← Back to customers</Link>
      </Button>
      <CustomerCreateForm />
    </div>
  );
}
