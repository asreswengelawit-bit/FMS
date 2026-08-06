import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

interface SectionCardProps {
  title: string
  icon?: LucideIcon
  count?: number
  action?: ReactNode
  children: ReactNode
  noPadding?: boolean
}

export function SectionCard({ title, icon: Icon, count, action, children, noPadding }: SectionCardProps) {
  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: "#E8EDF5" }}>
      <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: "#F1F5F9" }}>
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4" style={{ color: "#4F6FAF" }} />}
          <span className="text-sm font-bold" style={{ color: "#0B1E3D" }}>{title}</span>
          {count !== undefined && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "#EEF2FF", color: "#4F6FAF" }}>
              {count}
            </span>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className={noPadding ? "" : "p-5"}>{children}</div>
    </div>
  )
}
