import type { LucideIcon } from "lucide-react"

interface KPICardProps {
  icon: LucideIcon
  label: string
  value: string
  subtext?: string
  sub?: string
  color?: string
  bg?: string
  trend?: { value: string; up: boolean }
}

export function KPICard({ icon: Icon, label, value, subtext, sub, color = "#4F6FAF", bg, trend }: KPICardProps) {
  const displaySub = subtext || sub;
  return (
    <div className="bg-white rounded-xl border shadow-sm p-4 flex flex-col gap-2 relative overflow-hidden"
      style={{ borderColor: "#E8EDF5", backgroundColor: bg || "#FFFFFF" }}>
      <div className="flex items-center justify-between">
        <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: color + "18" }}>
          <Icon className="h-4.5 w-4.5" style={{ color }} />
        </div>
        {trend && (
          <span className="text-xs font-bold" style={{ color: trend.up ? "#16A34A" : "#C8102E" }}>
            {trend.up ? "▲" : "▼"} {trend.value}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold leading-tight" style={{ color: "#0B1E3D" }}>{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        {displaySub && <p className="text-xs mt-0.5" style={{ color }}>{displaySub}</p>}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl" style={{ background: color }} />
    </div>
  )
}
