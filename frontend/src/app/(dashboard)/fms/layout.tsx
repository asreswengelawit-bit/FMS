import { auth } from "@/auth";
import FmsShell from "@/features/fms/components/FmsShell";

export default async function FmsLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const userName =
    session?.user?.name ?? session?.user?.email ?? "";

  return <FmsShell userName={userName}>{children}</FmsShell>;
}
