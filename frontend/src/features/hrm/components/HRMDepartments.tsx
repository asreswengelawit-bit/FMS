import { Button } from "@/features/shared/components/ui/button"
import { Building2, Plus, Users } from "lucide-react"
import { PageHeader } from "@/features/shared/components"
import { departments } from "./hrm.data"

export function HRMDepartments() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>All Departments ({departments.length})</p>
        <Button className="gap-1.5 text-xs h-9 text-white" style={{ background: "#4F6FAF" }}>
          <Plus className="h-3.5 w-3.5" /> Create Department
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {departments.map(d => (
          <div key={d.id} className="bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-shadow"
            style={{ borderColor: "#E8EDF5" }}>
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center font-bold text-white text-sm"
                style={{ background: "linear-gradient(135deg, #4F6FAF, #0B1E3D)" }}>
                {d.code}
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded" style={{ background: "#EEF2FF", color: "#4F6FAF" }}>
                {d.id}
              </span>
            </div>
            <p className="text-sm font-bold leading-tight" style={{ color: "#0B1E3D" }}>{d.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{d.head}</p>
            <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: "#F1F5F9" }}>
              <div className="flex items-center gap-1 text-xs" style={{ color: "#4F6FAF" }}>
                <Users className="h-3.5 w-3.5" />
                <span className="font-bold">{d.employees}</span> staff
              </div>
              <span className="text-xs text-muted-foreground">ETB {(d.budget / 1000000).toFixed(1)}M</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
