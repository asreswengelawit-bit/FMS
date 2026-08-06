import { Tabs, TabsContent } from "@/features/shared/components/ui/tabs"
import { Package, Warehouse, TrendingDown, ArrowLeftRight, ClipboardList } from "lucide-react"
import { KPICard, PageHeader } from "@/features/shared/components"
import { MMSItems }        from "./MMSItems"
import { MMSWarehouses }   from "./MMSWarehouses"
import { MMSStockLevels }  from "./MMSStockLevels"
import { MMSMovements }    from "./MMSMovements"
import { MMSRequisitions } from "./MMSRequisitions"
import { items } from "./mms.data"

interface MMSPageProps { activePage?: string }

export function MMSPage({ activePage }: MMSPageProps) {
  const activeTab   = activePage ?? "items"
  const lowStock    = items.filter(i => i.status === "Low Stock").length
  const outOfStock  = items.filter(i => i.status === "Out of Stock").length
  const totalValue  = items.reduce((s, i) => s + i.onHand * i.unitCost, 0)

  return (
    <div className="p-6 space-y-5 h-full overflow-auto" style={{ background: "#F4F6FA" }}>
      <PageHeader
        title="Material Management System"
        subtitle="Item Master · Warehouses · Stock Levels · Movements · Requisitions"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <KPICard label="Total Item Lines"  value={String(items.length)} sub="Across all warehouses"       icon={Package}       color="#2563EB" bg="#EEF2FF" />
        <KPICard label="Low Stock Items"   value={String(lowStock)}     sub="Below reorder level"         icon={TrendingDown}  color="#D97706" bg="#FFFBEB" />
        <KPICard label="Out of Stock"      value={String(outOfStock)}   sub="Immediate action needed"     icon={TrendingDown}  color="#C8102E" bg="#FFF1F3" />
        <KPICard label="Warehouses"        value="3"                    sub="1 cold chain"                icon={Warehouse}     color="#0B1E3D" bg="#F0F4FF" />
        <KPICard label="Inventory Value"   value={`ETB ${(totalValue/1000000).toFixed(1)}M`} sub="Current stock value" icon={Package} color="#16A34A" bg="#F0FDF4" />
      </div>

      <Tabs value={activeTab}>
        <TabsContent value="items"        className="mt-0"><MMSItems /></TabsContent>
        <TabsContent value="warehouses"   className="mt-0"><MMSWarehouses /></TabsContent>
        <TabsContent value="stock-levels" className="mt-0"><MMSStockLevels /></TabsContent>
        <TabsContent value="movements"    className="mt-0"><MMSMovements /></TabsContent>
        <TabsContent value="requisitions" className="mt-0"><MMSRequisitions /></TabsContent>
      </Tabs>
    </div>
  )
}
