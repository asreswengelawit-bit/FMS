// Central mapping of Keycloak realm roles -> ERP modules.
// A user sees/enters a module if their token carries ANY role belonging to it
// (or the `admin` role, which grants everything).
//
// Matching is by prefix rather than by a dedicated `<module>_user` gate role:
// every job role is already named for its module (`hrm_admin`, `crm_auditor`),
// as are the fine-grained permissions (`hrm.employee.create`), so one role
// assignment is enough to both identify the job and open the module.

export type ModuleDef = {
  key: string;
  label: string;
  rolePrefix: string; // Keycloak realm-role prefix, e.g. "hrm" -> hrm_admin, hrm.employee.read
  path: string; // dashboard route
};

export const MODULES: ModuleDef[] = [
  { key: "hrm", label: "Human Resources", rolePrefix: "hrm", path: "/hrm" },
  { key: "prms", label: "Procurement", rolePrefix: "prms", path: "/prms" },
  { key: "mms", label: "Materials / Inventory", rolePrefix: "mms", path: "/mms" },
  { key: "crm", label: "Sales / CRM", rolePrefix: "crm", path: "/crm" },
  { key: "fms", label: "Finance", rolePrefix: "fms", path: "/fms" },
];

export const ADMIN_ROLE = "admin";

/** Does any of these roles belong to the given module? */
function grantsModule(roles: string[], module: ModuleDef): boolean {
  return roles.some((role) => role.startsWith(module.rolePrefix));
}

/** Modules this set of roles may access. Admin sees all. */
export function modulesForRoles(roles: string[]): ModuleDef[] {
  if (roles.includes(ADMIN_ROLE)) return MODULES;
  return MODULES.filter((m) => grantsModule(roles, m));
}

/** Where to send a user right after login. The module grid at "/" lists every
 * accessible module, so users land there instead of being dropped into a single
 * module. Fall back to /unauthorized only when the account has no entitlements. */
export function homePathForRoles(roles: string[]): string {
  return modulesForRoles(roles).length > 0 ? "/" : "/unauthorized";
}

/** The module a given path belongs to, if any (e.g. "/hrm/employees" -> hrm). */
export function moduleForPath(path: string): ModuleDef | undefined {
  return MODULES.find((m) => path === m.path || path.startsWith(m.path + "/"));
}

/** May these roles access this path? */
export function canAccessPath(path: string, roles: string[]): boolean {
  if (roles.includes(ADMIN_ROLE)) return true;
  const mod = moduleForPath(path);
  return !mod || grantsModule(roles, mod);
}
