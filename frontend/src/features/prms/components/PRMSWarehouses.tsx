import { Warehouse, Info } from "lucide-react"
import { SectionCard, AlertBanner } from "@/features/shared/components"
import { warehouses } from "@/features/mms/components/mms.data"

export function PRMSWarehouses() {
  return (
    <div className="space-y-4">
      <AlertBanner
        type="info"
        message="<strong>Read-only view</strong> — Warehouse data is managed by the Materials Management team. Contact them for capacity or configuration changes."
      />

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Warehouses",  value: String(warehouses.length),                                                          color: "#4F6FAF" },
          { label: "Total Capacity",    value: `${warehouses.reduce((s, w) => s + w.capacity, 0).toLocaleString()} units`,         color: "#0B1E3D" },
          { label: "Total Items Stored",value: String(warehouses.reduce((s, w) => s + w.items, 0)),                                color: "#16A34A" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5", borderLeftWidth: 3, borderLeftColor: s.color }}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold mt-0.5" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {warehouses.map(wh => {
          const pct = Math.round((wh.used / wh.capacity) * 100)
          const barColor = pct > 90 ? "#C8102E" : pct > 70 ? "#D97706" : "#16A34A"
          return (
            <div key={wh.id} className="bg-white rounded-xl border shadow-sm p-5" style={{ borderColor: "#E8EDF5" }}>
              <div className="flex items-start justify-between mb-4">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: "#EEF2FF" }}>
                  <Warehouse className="h-5 w-5" style={{ color: "#4F6FAF" }} />
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded" style={{ background: "#F1F5F9", color: "#4F6FAF" }}>{wh.id}</span>
              </div>
              <p className="text-base font-bold" style={{ color: "#0B1E3D" }}>{wh.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{wh.location}</p>
              <p className="text-xs mt-1" style={{ color: "#4F6FAF" }}>Manager: {wh.manager}</p>

              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Capacity Utilization</span>
                  <span className="font-bold" style={{ color: barColor }}>{pct}%</span>
                </div>
                <div className="h-2.5 rounded-full" style={{ background: "#F1F5F9" }}>
                  <div className="h-2.5 rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{wh.used.toLocaleString()} / {wh.capacity.toLocaleString()} units used</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t" style={{ borderColor: "#F1F5F9" }}>
                <div>
                  <p className="text-base font-bold" style={{ color: "#4F6FAF" }}>{wh.items}</p>
                  <p className="text-xs text-muted-foreground">Items Stored</p>
                </div>
                <div>
                  <p className="text-base font-bold" style={{ color: "#0B1E3D" }}>{wh.type}</p>
                  <p className="text-xs text-muted-foreground">Type</p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-xs" style={{ color: "#D97706" }}>
                <Info className="h-3.5 w-3.5" />
                View only — contact MMS to update
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
