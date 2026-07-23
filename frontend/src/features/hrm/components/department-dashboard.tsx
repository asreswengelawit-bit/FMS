import {
  PageHead,
  KpiRow,
  Panel,
  PanelRow,
  ProgressList,
  ActivityList,
} from "./widgets";

export default function DepartmentDashboard() {
  return (
    <div className="hrm">
      <PageHead
        title="My Department"
        subtitle="My Team · Team Attendance · Approvals"
        action={{ label: "+ Request Headcount", color: "#2563eb" }}
      />

      <KpiRow
        items={[
          { icon: "👥", value: "12", label: "Team Size", note: "Warehouse dept.", tone: "blue" },
          { icon: "🟢", value: "10", label: "Present Today", note: "83% attendance", tone: "green" },
          { icon: "🌴", value: "1", label: "On Leave", note: "1 returning tomorrow", tone: "violet" },
          { icon: "⏳", value: "2", label: "Pending Approvals", note: "Leave requests", tone: "amber" },
        ]}
      />

      <PanelRow>
        <Panel title="📈 My Team Attendance">
          <ProgressList
            total={12}
            rows={[
              { label: "Present", value: 10, tone: "green" },
              { label: "Absent", value: 0, tone: "red" },
              { label: "Late", value: 1, tone: "amber" },
              { label: "On Leave", value: 1, tone: "violet" },
            ]}
          />
        </Panel>
        <Panel title="✅ Pending Leave Approvals">
          <ActivityList
            items={[
              { type: "Awaiting You", text: "Annual leave · Kebede Alemu · 24–26 Jul (3 days)", date: "submitted 20 Jul" },
              { type: "Awaiting You", text: "Sick leave · Tigist Haile · 23 Jul (1 day)", date: "submitted 22 Jul" },
              { type: "Approved", text: "Annual leave · Yonas Girma · 15–16 Jul", date: "approved 12 Jul" },
            ]}
          />
        </Panel>
      </PanelRow>
    </div>
  );
}
