// Resolve which HRM dashboard a user sees from their Keycloak roles.
// Order = precedence: a user with several HR roles gets the highest one.

export const HR_ROLES = [
  "hrm_admin",
  "hrm_department_manager",
  "hrm_operations_manager",
  "hrm_recruitment_officer",
  "hrm_employee",
] as const;

/**
 * An HR job role, or `hrm_default` for someone who can reach HRM without holding
 * one — e.g. a token carrying only a fine-grained `hrm.<entity>.<action>`
 * permission. It is an internal marker, not a Keycloak realm role.
 */
export type HrRole = (typeof HR_ROLES)[number] | "hrm_default";

export function primaryHrRole(roles: string[]): HrRole {
  if (roles.includes("admin") || roles.includes("hrm_admin")) return "hrm_admin";
  for (const r of HR_ROLES) if (roles.includes(r)) return r;
  return "hrm_default";
}

export const HR_ROLE_LABEL: Record<HrRole, string> = {
  hrm_admin: "HR Admin",
  hrm_department_manager: "Department Manager",
  hrm_operations_manager: "HR Operations Manager",
  hrm_recruitment_officer: "Recruitment Officer",
  hrm_employee: "Employee",
  hrm_default: "HR User",
};
