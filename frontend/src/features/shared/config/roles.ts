// Central mapping of Keycloak realm roles -> ERP modules.
// A user sees/enters a module only if their token carries the matching role
// (or the `admin` role, which grants everything).

export type ModuleDef = {
  key: string;
  label: string;
  role: string; // Keycloak realm role name
  path: string; // dashboard route
};

export const MODULES: ModuleDef[] = [
  { key: "hrm", label: "Human Resources", role: "hrm_user", path: "/hrm" },
  { key: "prms", label: "Procurement", role: "prms_user", path: "/prms" },
  { key: "mms", label: "Materials / Inventory", role: "mms_user", path: "/mms" },
  { key: "crm", label: "Sales / CRM", role: "crm_user", path: "/crm" },
  { key: "fms", label: "Finance", role: "fms_user", path: "/fms" },
];

export const ADMIN_ROLE = "admin";

/** Modules this set of roles may access. Admin sees all. */
export function modulesForRoles(roles: string[]): ModuleDef[] {
  if (roles.includes(ADMIN_ROLE)) return MODULES;
  return MODULES.filter((m) => roles.includes(m.role));
}

/** Where to send a user right after login: their first allowed module. */
export function homePathForRoles(roles: string[]): string {
  return modulesForRoles(roles)[0]?.path ?? "/unauthorized";
}

/** The module a given path belongs to, if any (e.g. "/hrm/employees" -> hrm). */
export function moduleForPath(path: string): ModuleDef | undefined {
  return MODULES.find((m) => path === m.path || path.startsWith(m.path + "/"));
}

/** May these roles access this path? */
export function canAccessPath(path: string, roles: string[]): boolean {
  if (roles.includes(ADMIN_ROLE)) return true;
  const mod = moduleForPath(path);
  return !mod || roles.includes(mod.role);
}
