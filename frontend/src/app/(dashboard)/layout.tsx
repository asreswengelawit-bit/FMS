import { auth } from "@/auth";
import AppShell from "@/features/shared/components/app-shell";
import { modulesForRoles } from "@/features/shared/config/roles";
import { primaryHrRole } from "@/features/hrm/hr-roles";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const roles = session?.roles ?? [];
  const modules = modulesForRoles(roles);
  const name = session?.user?.name ?? session?.user?.email ?? "User";

  return (
    <AppShell userName={name} modules={modules} hrRole={primaryHrRole(roles)}>
      {children}
    </AppShell>
  );
}
