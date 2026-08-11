package com.company.hrm.shared.security;

/**
 * The {@code @PreAuthorize} expressions used across HRM controllers, in one place.
 *
 * <p>Each write expression accepts the fine-grained RBAC permission from README §7
 * ({@code hrm.<entity>.<action>}) <em>or</em> the coarse Keycloak realm role that owns
 * that area today. The realm currently ships only the coarse roles
 * (keycloak/realm-export.json), so the fine-grained names are forward-compatible: create
 * them as realm roles and they start working with no code change.
 *
 * <p>Reads only require module access, which any HRM-scoped authority conveys —
 * a job role ({@code hrm_admin}, {@code hrm_employee}, …) or a fine-grained permission
 * ({@code hrm.employee.read}). There is deliberately no separate {@code hrm_user} gate
 * role: the module prefix already identifies the module, so one assignment is enough.
 *
 * <p>All values are compile-time constants so they can be used in annotations.
 */
public final class HrmPermissions {

    /** Any caller holding an HRM-scoped authority, plus the global administrator. */
    public static final String READ = "hasAuthority('admin')"
            + " or authentication.authorities.?[authority.startsWith('hrm')].size() > 0";

    private static final String ADMINS = "'hrm_admin','admin'";
    private static final String OPS = "'hrm_operations_manager'," + ADMINS;
    private static final String RECRUITERS = "'hrm_recruitment_officer'," + ADMINS;
    private static final String STAFF = "'hrm_employee','hrm_department_manager'," + OPS;

    // --- employee master data -------------------------------------------------
    public static final String EMPLOYEE_CREATE = "hasAnyAuthority('hrm.employee.create'," + ADMINS + ")";
    public static final String EMPLOYEE_UPDATE = "hasAnyAuthority('hrm.employee.update'," + OPS + ")";
    public static final String EMPLOYEE_DELETE = "hasAnyAuthority('hrm.employee.delete'," + ADMINS + ")";

    // --- organizational structure ---------------------------------------------
    public static final String DEPARTMENT_CREATE = "hasAnyAuthority('hrm.department.create'," + ADMINS + ")";
    public static final String DEPARTMENT_UPDATE = "hasAnyAuthority('hrm.department.update'," + ADMINS + ")";

    public static final String ORGANIZATION_CREATE = "hasAnyAuthority('hrm.organization.create'," + ADMINS + ")";
    public static final String ORGANIZATION_UPDATE = "hasAnyAuthority('hrm.organization.update'," + ADMINS + ")";
    public static final String ORGANIZATION_DELETE = "hasAnyAuthority('hrm.organization.delete'," + ADMINS + ")";

    public static final String BRANCH_CREATE = "hasAnyAuthority('hrm.branch.create'," + ADMINS + ")";
    public static final String BRANCH_UPDATE = "hasAnyAuthority('hrm.branch.update'," + ADMINS + ")";
    public static final String BRANCH_DELETE = "hasAnyAuthority('hrm.branch.delete'," + ADMINS + ")";

    public static final String POSITION_CREATE = "hasAnyAuthority('hrm.position.create'," + ADMINS + ")";
    public static final String POSITION_UPDATE = "hasAnyAuthority('hrm.position.update'," + ADMINS + ")";
    public static final String POSITION_DELETE = "hasAnyAuthority('hrm.position.delete'," + ADMINS + ")";

    public static final String JOB_GRADE_CREATE = "hasAnyAuthority('hrm.job_grade.create'," + ADMINS + ")";
    public static final String JOB_GRADE_UPDATE = "hasAnyAuthority('hrm.job_grade.update'," + ADMINS + ")";
    public static final String JOB_GRADE_DELETE = "hasAnyAuthority('hrm.job_grade.delete'," + ADMINS + ")";

    // --- attendance & leave ---------------------------------------------------
    public static final String ATTENDANCE_CREATE = "hasAnyAuthority('hrm.attendance.create'," + OPS + ")";
//     public static final String ATTENDANCE_CREATE = "hasAnyAuthority('hrm.attendance.create'," + OPS + ")";
    public static final String ATTENDANCE_UPDATE = "hasAnyAuthority('hrm.attendance.update'," + OPS + ")";
    public static final String ATTENDANCE_DELETE = "hasAnyAuthority('hrm.attendance.delete'," + ADMINS + ")";
    public static final String SHIFT_CREATE = "hasAnyAuthority('hrm.shift.create'," + OPS + ")";
    public static final String SHIFT_UPDATE = "hasAnyAuthority('hrm.shift.update'," + OPS + ")";
    public static final String SHIFT_DELETE = "hasAnyAuthority('hrm.shift.delete'," + ADMINS + ")";
    /** Employees file their own leave, so self-service roles may create. */
    public static final String LEAVE_CREATE = "hasAnyAuthority('hrm.leave.create'," + STAFF + ")";

    // --- payroll source data (feeds FMS) --------------------------------------
    public static final String PAYROLL_CREATE = "hasAnyAuthority('hrm.payroll.create'," + OPS + ")";
    public static final String PAYROLL_UPDATE = "hasAnyAuthority('hrm.payroll.update'," + OPS + ")";
    public static final String PAYROLL_PROCESS = "hasAnyAuthority('hrm.payroll.process'," + ADMINS + ")";
    public static final String PAYROLL_DELETE = "hasAnyAuthority('hrm.payroll.delete'," + ADMINS + ")";

    // --- recruitment ----------------------------------------------------------
    public static final String CANDIDATE_CREATE = "hasAnyAuthority('hrm.candidate.create'," + RECRUITERS + ")";
    public static final String CANDIDATE_UPDATE = "hasAnyAuthority('hrm.candidate.update'," + RECRUITERS + ")";
    public static final String CANDIDATE_DELETE = "hasAnyAuthority('hrm.candidate.delete'," + RECRUITERS + ")";

    public static final String JOB_POSTING_CREATE = "hasAnyAuthority('hrm.job_posting.create'," + RECRUITERS + ")";
    public static final String JOB_POSTING_UPDATE = "hasAnyAuthority('hrm.job_posting.update'," + RECRUITERS + ")";
    public static final String JOB_POSTING_DELETE = "hasAnyAuthority('hrm.job_posting.delete'," + RECRUITERS + ")";

    public static final String JOB_APPLICATION_CREATE =
            "hasAnyAuthority('hrm.job_application.create'," + RECRUITERS + ")";
    public static final String JOB_APPLICATION_UPDATE =
            "hasAnyAuthority('hrm.job_application.update'," + RECRUITERS + ")";
    public static final String JOB_APPLICATION_DELETE =
            "hasAnyAuthority('hrm.job_application.delete'," + RECRUITERS + ")";

    public static final String INTERVIEW_CREATE = "hasAnyAuthority('hrm.interview.create'," + RECRUITERS + ")";
    public static final String INTERVIEW_UPDATE = "hasAnyAuthority('hrm.interview.update'," + RECRUITERS + ")";
    public static final String INTERVIEW_DELETE = "hasAnyAuthority('hrm.interview.delete'," + RECRUITERS + ")";

    private HrmPermissions() {
    }
}
