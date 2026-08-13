import { MmsProvider } from "@/features/mms/hooks/mms-store";

export default function MaterialManagementLayout({ children }: { children: React.ReactNode }) {
  return <MmsProvider>{children}</MmsProvider>;
}
