import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { homePathForRoles } from "@/features/shared/config/roles";

// Landing route: send each user to their first allowed module by role.
export default async function DashboardHome() {
  const session = await auth();
  const roles = process.env.NEXT_PUBLIC_AUTH_MODE === "demo"
    ? ["mms_user", "inventory_manager"]
    : session?.roles ?? [];
  redirect(homePathForRoles(roles));
}
