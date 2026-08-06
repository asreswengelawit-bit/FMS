import { Button } from "@/features/shared/components/ui/button"
import { Plus, Warehouse, Users, Edit } from "lucide-react"
import { warehouses } from "./mms.data"

export function MMSWarehouses() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{warehouses.length} warehouses configured</p>
        <Button className="text-white gap-2 text-sm" style={{ background: "#2563EB" }}>
          <Plus className="h-4 w-4" /> Add Warehouse
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {warehouses.map(wh => {
          const usePct = Math.round((wh.used / wh.capacity) * 100)
          const barColor = usePct > 85 ? "#C8102E" : usePct > 70 ? "#D97706" : "#16A34A"
          return (
            <div key={wh.id} className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow p-5" style={{ borderColor: "#E8EDF5" }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#EEF2FF" }}>
                    <Warehouse className="h-5 w-5" style={{ color: "#2563EB" }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold" style={{ color: "#0B1E3D" }}>{wh.name}</h3>
                    <p className="text-xs font-mono" style={{ color: "#2563EB" }}>{wh.id}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "#F0F4FF", color: "#0B1E3D" }}>{wh.type}</span>
              </div>

              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Capacity Used</span>
                  <span className="font-bold" style={{ color: barColor }}>{usePct}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "#E8EDF5" }}>
                  <div className="h-2 rounded-full" style={{ width: `${usePct}%`, background: barColor }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{wh.used.toLocaleString()} used</span>
                  <span>{wh.capacity.toLocaleString()} total</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs border-t pt-3" style={{ borderColor: "#E8EDF5" }}>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium" style={{ color: "#0B1E3D" }}>{wh.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Manager</span>
                  <span className="font-semibold" style={{ color: "#2563EB" }}>{wh.manager}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Item Lines</span>
                  <span className="font-bold" style={{ color: "#0B1E3D" }}>{wh.items}</span>
                </div>
              </div>

              <div className="flex gap-1.5 mt-3">
                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs gap-1"><Edit className="h-3 w-3" /> Edit</Button>
                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs gap-1"><Users className="h-3 w-3" /> Stock</Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
