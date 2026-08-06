import type { ReactNode } from "react"
import { Search, SlidersHorizontal } from "lucide-react"

interface SearchFilterProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  children?: ReactNode
}

export function SearchFilter({ value, onChange, placeholder = "Search…", children }: SearchFilterProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg outline-none focus:ring-2 bg-white"
          style={{ borderColor: "#E8EDF5", focusRingColor: "#4F6FAF" } as React.CSSProperties}
        />
      </div>
      <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
      {children}
    </div>
  )
}
