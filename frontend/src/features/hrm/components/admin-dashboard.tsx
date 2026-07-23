import {
  PageHead,
  KpiRow,
  Panel,
  PanelRow,
  BarChart,
  ProgressList,
  StatGrid,
  ActivityList,
} from "./widgets";

export default function AdminDashboard() {
  return (
    <div className="hrm">
      <PageHead
        title="Human Resource Management System"
        subtitle="Departments · Positions · Employees · Attendance · Leave · Payroll Support · Assignment History · Reports · Audit"
        action={{ label: "+ Add Employee", color: "#2563eb" }}
      />

      <KpiRow
        items={[
          { icon: "👥", value: "120", label: "Total Employees", note: "8 departments", tone: "blue" },
          { icon: "✅", value: "107", label: "Active Employees", note: "89.2% active rate", tone: "green" },
          { icon: "📅", value: "3", label: "Pending Leaves", note: "Awaiting approval", tone: "amber" },
          { icon: "⛔", value: "1", label: "Absent Today", note: "Late: 1 employees", tone: "red" },
          { icon: "🟢", value: "4", label: "Present Today", note: "50% attendance rate", tone: "green" },
          { icon: "➕", value: "1", label: "New Hires / Month", note: "July 2025", tone: "violet" },
        ]}
      />

      <PanelRow>
        <Panel title="📊 Employee Count by Department">
          <BarChart
            max={36}
            data={[
              { label: "FIN", value: 18 },
              { label: "PRO", value: 12 },
              { label: "WHS", value: 36 },
              { label: "SAL", value: 22 },
              { label: "ITS", value: 8 },
              { label: "HRD", value: 6 },
              { label: "ADM", value: 14 },
              { label: "LEG", value: 4 },
            ]}
          />
        </Panel>
        <Panel title="📈 Today's Attendance">
          <ProgressList
            total={8}
            rows={[
              { label: "Present", value: 4, tone: "green" },
              { label: "Absent", value: 1, tone: "red" },
              { label: "Late", value: 1, tone: "amber" },
              { label: "Half Day", value: 1, tone: "violet" },
              { label: "On Leave", value: 1, tone: "blue" },
            ]}
          />
        </Panel>
      </PanelRow>

      <PanelRow>
        <Panel title="🗓️ Leave Request Summary">
          <StatGrid
            items={[
              { label: "Pending", value: 3, tone: "amber" },
              { label: "Approved", value: 3, tone: "green" },
              { label: "Rejected", value: 1, tone: "red" },
              { label: "Total", value: 7, tone: "slate" },
            ]}
          />
        </Panel>
        <Panel title="🕓 Recent HR Activity">
          <ActivityList
            items={[
              { type: "EmployeeCreated", text: "New employee Meron Kebede onboarded to IT & Security by Hirut Mekonen", date: "2021-09-15" },
              { type: "LeaveApproved", text: "Annual leave approved for Abel Tesfaye by Hirut Mekonen", date: "2021-09-14" },
              { type: "DepartmentUpdated", text: "Warehouse department headcount updated by Samuel Girma", date: "2021-09-13" },
            ]}
          />
        </Panel>
      </PanelRow>
    </div>
  );
}
