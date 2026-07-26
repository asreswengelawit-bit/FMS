import {
  PageHead,
  KpiRow,
  Panel,
  PanelRow,
  ProgressList,
  ActivityList,
} from "./widgets";

export default function OperationsDashboard() {
  return (
    <div className="hrm">
      <PageHead
        title="HR Operations"
        subtitle="Attendance · Leave · Payroll Support · Reports"
        action={{ label: "+ Process Payroll", color: "#7c3aed" }}
      />

      <KpiRow
        items={[
          { icon: "📅", value: "3", label: "Leaves to Process", note: "Awaiting HR action", tone: "amber" },
          { icon: "⛔", value: "1", label: "Absent Today", note: "Follow-up needed", tone: "red" },
          { icon: "⏰", value: "1", label: "Late Today", note: "Flagged for review", tone: "amber" },
          { icon: "✅", value: "107", label: "Active Employees", note: "Payroll eligible", tone: "green" },
        ]}
      />

      <PanelRow>
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
        <Panel title="🧾 Payroll Support Queue">
          <ActivityList
            items={[
              { type: "OvertimeReview", text: "12 overtime entries pending verification (Warehouse)", date: "due 25 Jul" },
              { type: "LeaveAdjustment", text: "2 unpaid-leave adjustments to apply before payroll run", date: "due 26 Jul" },
              { type: "PayrollRun", text: "July payroll run scheduled", date: "28 Jul 2025" },
            ]}
          />
        </Panel>
      </PanelRow>
    </div>
  );
}
