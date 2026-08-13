import { auth } from "@/auth";
import DashboardShell from "./dashboard-shell";
import { modulesForRoles } from "@/features/shared/config/roles";
import { primaryHrRole } from "@/features/hrm/hr-roles";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isDemo = process.env.NEXT_PUBLIC_AUTH_MODE === "demo";
  const roles = isDemo ? ["mms_user", "inventory_manager"] : session?.roles ?? [];
  const modules = modulesForRoles(roles);
  const name = isDemo ? "Demo Inventory Manager" : session?.user?.name ?? session?.user?.email ?? "User";

  return (
    <DashboardShell userName={name} modules={modules} hrRole={primaryHrRole(roles)}>
      {children}
    </DashboardShell>
  );
}
