import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Button } from "@/features/shared/components/ui/button"
import { BarChart2, TrendingUp, Download } from "lucide-react"
import { SectionCard } from "@/features/shared/components"
import { deptChartData, attendanceChartData, departments, employees } from "./hrm.data"

export function HRMReports() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>HR Reports — July 2025</p>
        <Button variant="outline" className="gap-1.5 text-xs h-9" style={{ borderColor: "#4F6FAF", color: "#4F6FAF" }}>
          <Download className="h-3.5 w-3.5" /> Export PDF
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Employees",   value: String(employees.length),                                     color: "#4F6FAF" },
          { label: "Active Staff",      value: String(employees.filter(e => e.status === "ACTIVE").length),  color: "#16A34A" },
          { label: "Departments",       value: String(departments.length),                                   color: "#0B1E3D" },
          { label: "Avg Salary (ETB)",  value: Math.round(employees.reduce((s,e)=>s+e.salary,0)/employees.length).toLocaleString(), color: "#D97706" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5", borderLeftWidth: 3, borderLeftColor: s.color }}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold mt-0.5" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectionCard title="Headcount by Department" icon={BarChart2}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart id="hrm-rpt-bar-dept" data={deptChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="dept" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E8EDF5" }} />
              <Bar key="bar-count" dataKey="count" fill="#4F6FAF" radius={[4, 4, 0, 0]} name="Employees" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Monthly Attendance Trend" icon={TrendingUp}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart id="hrm-rpt-line-att" data={attendanceChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E8EDF5" }} formatter={(v: any) => [`${v}%`, ""]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line key="line-present" type="monotone" dataKey="present" stroke="#16A34A" strokeWidth={2} dot={{ r: 3 }} name="Present %" />
              <Line key="line-absent" type="monotone" dataKey="absent" stroke="#C8102E" strokeWidth={2} dot={{ r: 3 }} name="Absent %" />
              <Line key="line-late" type="monotone" dataKey="late" stroke="#D97706" strokeWidth={2} dot={{ r: 3 }} name="Late %" />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>
    </div>
  )
}
