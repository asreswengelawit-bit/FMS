import { MmsProvider } from "@/features/mms/hooks/mms-store";
import "@/features/mms/mms.css";

export default function MaterialManagementLayout({ children }: { children: React.ReactNode }) {
  return <MmsProvider>{children}</MmsProvider>;
}
