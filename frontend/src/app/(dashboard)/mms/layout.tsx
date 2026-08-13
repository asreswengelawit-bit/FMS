import { MmsProvider } from "@/features/mms/hooks/mms-store";
import { MmsShell } from "@/features/mms/components/mms-shell";

export default function MaterialManagementLayout({ children }: { children: React.ReactNode }) {
  return <MmsProvider><MmsShell>{children}</MmsShell></MmsProvider>;
}
