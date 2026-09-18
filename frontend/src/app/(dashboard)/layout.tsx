import { auth } from "@/auth";
import DashboardShell from "./dashboard-shell";
import { modulesForRoles } from "@/features/shared/config/roles";

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
    <DashboardShell userName={name} modules={modules}>
      {children}
    </DashboardShell>
  );
}
