import { auth } from "@/auth";
import { primaryHrRole } from "@/features/hrm/hr-roles";
import AdminDashboard from "@/features/hrm/components/admin-dashboard";
import EmployeeDashboard from "@/features/hrm/components/employee-dashboard";
import OperationsDashboard from "@/features/hrm/components/operations-dashboard";
import RecruitmentDashboard from "@/features/hrm/components/recruitment-dashboard";
import DepartmentDashboard from "@/features/hrm/components/department-dashboard";

// The HRM landing page shows a different dashboard per HR job role.
export default async function HrmPage() {
  const session = await auth();
  const role = primaryHrRole(session?.roles ?? []);

  switch (role) {
    case "hrm_admin":
      return <AdminDashboard />;
    case "hrm_department_manager":
      return <DepartmentDashboard />;
    case "hrm_operations_manager":
      return <OperationsDashboard />;
    case "hrm_recruitment_officer":
      return <RecruitmentDashboard />;
    case "hrm_employee":
    default:
      return <EmployeeDashboard />;
  }
}
