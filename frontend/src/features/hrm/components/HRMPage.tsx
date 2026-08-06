import { Tabs, TabsContent } from "@/features/shared/components/ui/tabs"
import { Users, UserCheck, Calendar, XCircle, CheckCircle2, UserPlus } from "lucide-react"
import { KPICard, PageHeader } from "@/features/shared/components"
import { HRMDashboard }         from "./HRMDashboard"
import { HRMEmployees }         from "./HRMEmployees"
import { HRMDepartments }       from "./HRMDepartments"
import { HRMPositions }         from "./HRMPositions"
import { HRMAttendance }        from "./HRMAttendance"
import { HRMLeave }             from "./HRMLeave"
import { HRMPayroll }           from "./HRMPayroll"
import { HRMAssignmentHistory } from "./HRMAssignmentHistory"
import { HRMReports }           from "./HRMReports"
import { HRMAuditLog }          from "./HRMAuditLog"
import { dailyAttendance, leaveRequests } from "./hrm.data"

interface HRMPageProps { activePage?: string }

export function HRMPage({ activePage }: HRMPageProps) {
  const activeTab     = activePage ?? "dashboard"
  const todayPresent  = dailyAttendance.filter(a => a.status === "PRESENT").length
  const todayAbsent   = dailyAttendance.filter(a => a.status === "ABSENT").length
  const todayLate     = dailyAttendance.filter(a => a.status === "LATE").length
  const pendingLeaves = leaveRequests.filter(l => l.status === "PENDING").length

  return (
    <div className="p-6 space-y-5 h-full overflow-auto" style={{ background: "#F4F6FA" }}>
      <PageHeader
        title="Human Resource Management System"
        subtitle="Departments · Positions · Employees · Attendance · Leave · Payroll Support · Assignment History · Reports · Audit"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPICard label="Total Employees"   value="120"                   sub="8 departments"                                   icon={Users}       color="#2563EB" bg="#EEF2FF" />
        <KPICard label="Active Employees"  value="107"                   sub="89.2% active rate"                               icon={UserCheck}   color="#16A34A" bg="#F0FDF4" />
        <KPICard label="Pending Leaves"    value={String(pendingLeaves)} sub="Awaiting approval"                               icon={Calendar}    color="#D97706" bg="#FFFBEB" />
        <KPICard label="Absent Today"      value={String(todayAbsent)}   sub={`Late: ${todayLate} employees`}                  icon={XCircle}     color="#C8102E" bg="#FFF1F3" />
        <KPICard label="Present Today"     value={String(todayPresent)}  sub={`${Math.round(todayPresent / dailyAttendance.length * 100)}% rate`} icon={CheckCircle2} color="#16A34A" bg="#F0FDF4" />
        <KPICard label="New Hires / Month" value="1"                     sub="July 2025"                                       icon={UserPlus}    color="#7C3AED" bg="#F5F3FF" />
      </div>

      <Tabs value={activeTab}>
        <TabsContent value="dashboard"          className="mt-0"><HRMDashboard /></TabsContent>
        <TabsContent value="employees"          className="mt-0"><HRMEmployees /></TabsContent>
        <TabsContent value="departments"        className="mt-0"><HRMDepartments /></TabsContent>
        <TabsContent value="positions"          className="mt-0"><HRMPositions /></TabsContent>
        <TabsContent value="attendance"         className="mt-0"><HRMAttendance /></TabsContent>
        <TabsContent value="leave"              className="mt-0"><HRMLeave /></TabsContent>
        <TabsContent value="payroll-support"    className="mt-0"><HRMPayroll /></TabsContent>
        <TabsContent value="assignment-history" className="mt-0"><HRMAssignmentHistory /></TabsContent>
        <TabsContent value="reports"            className="mt-0"><HRMReports /></TabsContent>
        <TabsContent value="audit-log"          className="mt-0"><HRMAuditLog /></TabsContent>
      </Tabs>
    </div>
  )
}
