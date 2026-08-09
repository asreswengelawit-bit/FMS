import Link from "next/link";
import LeadCreateForm from "@/features/crm/components/LeadCreateForm";
import CrmModuleHeader from "@/features/crm/components/CrmModuleHeader";

export default function NewLeadPage() {
  return (
    <div>
      <CrmModuleHeader section="New Lead" />
      <Link
        href="/crm/leads"
        style={{
          color: "#64748b",
          fontSize: "0.85rem",
          fontWeight: 600,
          display: "inline-block",
          marginBottom: "0.9rem",
        }}
      >
        ← Back to leads
      </Link>
      <LeadCreateForm />
    </div>
  );
}
