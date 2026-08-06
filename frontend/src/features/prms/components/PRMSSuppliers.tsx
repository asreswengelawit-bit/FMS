import { useState } from "react"
import { Button } from "@/features/shared/components/ui/button"
import { Building2, Plus, Star, Phone, Mail, MapPin, Eye, Edit } from "lucide-react"
import { SearchFilter, SectionCard } from "@/features/shared/components"
import { suppliers, statusConfig } from "./prms.data"

function Badge({ label }: { label: string }) {
  const s = statusConfig[label] ?? { color: "#64748B", bg: "#F1F5F9" }
  return <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: s.color, background: s.bg }}>{label}</span>
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star key={n} className="h-3 w-3" fill={n <= Math.round(rating) ? "#F59E0B" : "none"} style={{ color: "#F59E0B" }} />
      ))}
      <span className="text-xs font-bold ml-1" style={{ color: "#0B1E3D" }}>{rating.toFixed(1)}</span>
    </div>
  )
}

export function PRMSSuppliers() {
  const [search, setSearch] = useState("")
  const [catFilter, setCatFilter] = useState("All")

  const categories = ["All", ...Array.from(new Set(suppliers.map(s => s.category)))]
  const filtered = suppliers.filter(s =>
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase())) &&
    (catFilter === "All" || s.category === catFilter)
  )

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Suppliers",    value: String(suppliers.length),                                            color: "#4F6FAF" },
          { label: "Preferred",          value: String(suppliers.filter(s => s.status === "Preferred").length),     color: "#2563EB" },
          { label: "Active",             value: String(suppliers.filter(s => s.status === "Active").length),        color: "#16A34A" },
          { label: "Total Spend",        value: `ETB ${(suppliers.reduce((s, sup) => s + sup.totalValue, 0) / 1000000).toFixed(1)}M`, color: "#0B1E3D" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border shadow-sm p-4" style={{ borderColor: "#E8EDF5", borderLeftWidth: 3, borderLeftColor: s.color }}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold mt-0.5" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <SearchFilter value={search} onChange={setSearch} placeholder="Search suppliers…">
        <div className="flex gap-1 flex-wrap">
          {categories.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className="text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap"
              style={{ background: catFilter === c ? "#0B1E3D" : "#F1F5F9", color: catFilter === c ? "white" : "#64748B" }}>
              {c}
            </button>
          ))}
        </div>
        <Button className="gap-1.5 text-xs h-9 text-white whitespace-nowrap" style={{ background: "#4F6FAF" }}>
          <Plus className="h-3.5 w-3.5" /> Register Supplier
        </Button>
      </SearchFilter>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(sup => (
          <div key={sup.id} className="bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-shadow" style={{ borderColor: "#E8EDF5" }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #4F6FAF, #0B1E3D)" }}>
                    {sup.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: "#0B1E3D" }}>{sup.name}</p>
                    <p className="text-xs text-muted-foreground">{sup.category}</p>
                  </div>
                </div>
              </div>
              <Badge label={sup.status} />
            </div>

            <Stars rating={sup.rating} />

            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="h-3 w-3 flex-shrink-0" />{sup.phone}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="h-3 w-3 flex-shrink-0" />{sup.email}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 flex-shrink-0" />{sup.city} · TIN: {sup.tin}
              </div>
            </div>

            <div className="mt-3 pt-3 grid grid-cols-3 gap-2 text-center border-t" style={{ borderColor: "#F1F5F9" }}>
              <div>
                <p className="text-base font-bold" style={{ color: "#4F6FAF" }}>{sup.orders}</p>
                <p className="text-xs text-muted-foreground">Orders</p>
              </div>
              <div>
                <p className="text-base font-bold" style={{ color: "#0B1E3D" }}>ETB {(sup.totalValue / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-muted-foreground">Total Value</p>
              </div>
              <div>
                <p className="text-base font-bold" style={{ color: "#16A34A" }}>{sup.paymentTerms}</p>
                <p className="text-xs text-muted-foreground">Payment</p>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 h-7 text-xs gap-1"><Eye className="h-3 w-3" />View</Button>
              <Button variant="outline" size="sm" className="flex-1 h-7 text-xs gap-1"><Edit className="h-3 w-3" />Edit</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
