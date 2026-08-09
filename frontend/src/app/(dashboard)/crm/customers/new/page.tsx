import Link from "next/link";
import CustomerCreateForm from "@/features/crm/components/CustomerCreateForm";

export default function NewCustomerPage() {
  return (
    <div>
      <div style={{ marginBottom: "1.25rem" }}>
        <Link
          href="/crm/customers"
          style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}
        >
          ← Back to customers
        </Link>
        <h1 style={{ margin: "0.5rem 0 0", color: "#0a1f44", fontSize: "1.45rem" }}>
          New customer
        </h1>
        <p style={{ margin: "0.35rem 0 0", color: "#6b7280", fontSize: "0.92rem" }}>
          Create a customer record in the CRM service.
        </p>
      </div>
      <CustomerCreateForm />
    </div>
  );
}
