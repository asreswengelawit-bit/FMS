import Link from "next/link";
import LeadCreateForm from "@/features/crm/components/LeadCreateForm";
import CrmModuleHeader from "@/features/crm/components/CrmModuleHeader";
import { Button } from "@/features/shared/components/ui/button";

export default function NewLeadPage() {
  return (
    <div className="flex flex-col gap-4">
      <CrmModuleHeader section="New Lead" />
      <Button asChild variant="ghost" className="w-fit px-0">
        <Link href="/crm/leads">← Back to leads</Link>
      </Button>
      <LeadCreateForm />
    </div>
  );
}
