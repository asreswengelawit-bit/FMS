import {
  PageHead,
  KpiRow,
  Panel,
  PanelRow,
  BarChart,
  ActivityList,
} from "./widgets";

export default function RecruitmentDashboard() {
  return (
    <div className="hrm">
      <PageHead
        title="Recruitment"
        subtitle="Positions · Candidates · Interviews · Reports"
        action={{ label: "+ Post Vacancy", color: "#2563eb" }}
      />

      <KpiRow
        items={[
          { icon: "📋", value: "5", label: "Open Positions", note: "Across 4 departments", tone: "blue" },
          { icon: "🧑‍💼", value: "42", label: "Candidates", note: "In pipeline", tone: "violet" },
          { icon: "🎙️", value: "3", label: "Interviews Today", note: "2 technical · 1 HR", tone: "amber" },
          { icon: "📨", value: "2", label: "Offers Pending", note: "Awaiting response", tone: "green" },
        ]}
      />

      <PanelRow>
        <Panel title="📊 Recruitment Pipeline">
          <BarChart
            max={42}
            data={[
              { label: "Applied", value: 42 },
              { label: "Screening", value: 18 },
              { label: "Interview", value: 9 },
              { label: "Offer", value: 3 },
              { label: "Hired", value: 2 },
            ]}
          />
        </Panel>
        <Panel title="🗓️ Upcoming Interviews">
          <ActivityList
            items={[
              { type: "Technical", text: "Backend Engineer · Selam Bekele with panel of 3", date: "Today 10:00" },
              { type: "Technical", text: "Security Analyst · Dawit Alemu", date: "Today 14:00" },
              { type: "HR Round", text: "Procurement Officer · Rahel Tadesse", date: "Tomorrow 09:30" },
            ]}
          />
        </Panel>
      </PanelRow>
    </div>
  );
}
