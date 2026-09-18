"use client";

import { usePathname } from "next/navigation";
import AppShell from "@/features/shared/components/app-shell";
import type { ModuleDef } from "@/features/shared/config/roles";

type DashboardShellProps = {
  userName: string;
  modules: ModuleDef[];
  children: React.ReactNode;
};

/**
 * MMS has its own complete application shell.  Keeping it out of the shared
 * ERP shell prevents two navigation bars and two headers from rendering on
 * the same page.
 */
export default function DashboardShell({ children, ...shellProps }: DashboardShellProps) {
  const pathname = usePathname();

  if (pathname === "/mms" || pathname.startsWith("/mms/")) {
    return <>{children}</>;
  }

  if (pathname === "/fms" || pathname.startsWith("/fms/")) {
    return <>{children}</>;
  }

  return <AppShell {...shellProps}>{children}</AppShell>;
}
