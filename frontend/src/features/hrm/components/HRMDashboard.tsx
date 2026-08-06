import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/features/shared/components/ui/button"
import { SectionCard, UserAvatar } from "@/features/shared/components"
import { departments, dailyAttendance, leaveRequests, deptChartData, attendanceChartData, joinersLeaversData } from "./hrm.data"

export function HRMDashboard() {
  const present = dailyAttendance.filter(a => a.status === "PRESENT").length
  const pending  = leaveRequests.filter(l => l.status === "PENDING")

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <SectionCard title="Headcount by Department" icon={undefined}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart id="hrm-dash-bar-dept" data={deptChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="dept" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E8EDF5" }} />
                <Bar key="bar-count" dataKey="count" fill="#4F6FAF" radius={[4, 4, 0, 0]} name="Employees" />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>

        <SectionCard title="Today's Attendance">
          <div className="space-y-2">
            <div className="flex justify-between text-xs mb-3">
              <span className="text-muted-foreground">Present today</span>
              <span className="font-bold" style={{ color: "#0B1E3D" }}>{present}/{dailyAttendance.length}</span>
            </div>
            {departments.slice(0, 5).map(d => {
              const pct = Math.round(Math.random() * 30 + 70)
              return (
                <div key={d.id}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-muted-foreground">{d.code}</span>
                    <span className="font-semibold" style={{ color: "#0B1E3D" }}>{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "#F1F5F9" }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: pct >= 90 ? "#16A34A" : pct >= 70 ? "#4F6FAF" : "#D97706" }} />
                  </div>
                </div>
              )
            })}
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectionCard title="Pending Leave Requests" count={pending.length}>
          <div className="space-y-2">
            {pending.length === 0 && <p className="text-sm text-muted-foreground">No pending requests.</p>}
            {pending.map(lr => (
              <div key={lr.id} className="flex items-center justify-between p-2.5 rounded-lg" style={{ background: "#F8FAFC" }}>
                <div className="flex items-center gap-2">
                  <UserAvatar name={lr.employee} size={28} />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "#0B1E3D" }}>{lr.employee}</p>
                    <p className="text-xs text-muted-foreground">{lr.type} · {lr.days}d</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" className="h-7 w-7 p-0" style={{ background: "#16A34A" }}>
                    <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 w-7 p-0" style={{ borderColor: "#C8102E", color: "#C8102E" }}>
                    <XCircle className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Joiners & Leavers Trend">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart id="hrm-dash-line-jl" data={joinersLeaversData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E8EDF5" }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line key="line-joiners" type="monotone" dataKey="joiners" stroke="#16A34A" strokeWidth={2} dot={{ r: 3 }} name="Joiners" />
              <Line key="line-leavers" type="monotone" dataKey="leavers" stroke="#C8102E" strokeWidth={2} dot={{ r: 3 }} name="Leavers" />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>
    </div>
  )
}
