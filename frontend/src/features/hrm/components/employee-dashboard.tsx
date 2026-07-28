import {
  PageHead,
  KpiRow,
  Panel,
  PanelRow,
  ProgressList,
  ActivityList,
} from "./widgets";

export default function EmployeeDashboard() {
  return (
    <div>
      <PageHead
        title="My HR Portal"
        subtitle="My Attendance · My Leave · My Profile"
        action={{ label: "+ Apply for Leave", color: "#16a34a" }}
      />

      <KpiRow
        items={[
          { icon: "leaf", value: "12", label: "Leave Balance", note: "Annual days left", tone: "green" },
          { icon: "clock", value: "1", label: "Pending Requests", note: "Awaiting approval", tone: "amber" },
          { icon: "calendar", value: "95%", label: "Attendance", note: "This month", tone: "blue" },
          { icon: "activity", value: "168h", label: "Worked Hours", note: "This month", tone: "violet" },
        ]}
      />

      <PanelRow>
        <Panel title="My Attendance This Week" icon="activity">
          <ProgressList
            total={8}
            rows={[
              { label: "Monday", value: 8, tone: "green" },
              { label: "Tuesday", value: 8, tone: "green" },
              { label: "Wednesday", value: 7, tone: "amber" },
              { label: "Thursday", value: 8, tone: "green" },
              { label: "Friday", value: 4, tone: "violet" },
            ]}
          />
        </Panel>
        <Panel title="My Recent Leave Requests" icon="clock">
          <ActivityList
            items={[
              { type: "Pending", text: "Annual leave · 22–24 Jul 2025 (3 days)", date: "submitted 18 Jul" },
              { type: "Approved", text: "Sick leave · 09 Jul 2025 (1 day)", date: "approved 09 Jul" },
              { type: "Approved", text: "Annual leave · 12–13 Jun 2025 (2 days)", date: "approved 10 Jun" },
            ]}
          />
        </Panel>
      </PanelRow>
    </div>
  );
}
