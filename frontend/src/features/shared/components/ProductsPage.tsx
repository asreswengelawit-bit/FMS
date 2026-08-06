import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shared/components/ui/card"
import { Button } from "@/features/shared/components/ui/button"
import { Input } from "@/features/shared/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/features/shared/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shared/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/features/shared/components/ui/dialog"
import { Label } from "@/features/shared/components/ui/label"
import { Textarea } from "@/features/shared/components/ui/textarea"
import { Plus, Search, Filter, Edit, Trash2, Package, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

const products = [
  { id: "PRD-001", name: "All-Purpose Cleaner 500ml", category: "Cleaning Supplies", sku: "APC-500", stock: 150, price: 3.99, cost: 2.50, supplier: "CleanCorp", status: "In Stock" },
  { id: "PRD-002", name: "Hand Soap 250ml", category: "Personal Care", sku: "HS-250", stock: 89, price: 2.49, cost: 1.20, supplier: "SoapWorks", status: "In Stock" },
  { id: "PRD-003", name: "Paper Towels 6-pack", category: "Household Items", sku: "PT-6PK", stock: 8, price: 12.99, cost: 8.50, supplier: "PaperPlus", status: "Low Stock" },
  { id: "PRD-004", name: "Instant Coffee 200g", category: "Food & Beverages", sku: "IC-200", stock: 45, price: 7.99, cost: 4.80, supplier: "BevCorp", status: "In Stock" },
  { id: "PRD-005", name: "Dish Soap 1L", category: "Cleaning Supplies", sku: "DS-1L", stock: 0, price: 5.99, cost: 3.75, supplier: "CleanCorp", status: "Out of Stock" },
  { id: "PRD-006", name: "Laundry Detergent 2kg", category: "Cleaning Supplies", sku: "LD-2KG", stock: 62, price: 14.50, cost: 9.20, supplier: "CleanCorp", status: "In Stock" },
  { id: "PRD-007", name: "Shampoo 400ml", category: "Personal Care", sku: "SH-400", stock: 12, price: 6.99, cost: 3.90, supplier: "SoapWorks", status: "Low Stock" },
]

const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  "In Stock": { color: "#16A34A", bg: "#F0FDF4", icon: <CheckCircle className="h-3 w-3" /> },
  "Low Stock": { color: "#D97706", bg: "#FFFBEB", icon: <AlertTriangle className="h-3 w-3" /> },
  "Out of Stock": { color: "#C8102E", bg: "#FFF1F3", icon: <XCircle className="h-3 w-3" /> },
}

export function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="p-6 space-y-6 h-full overflow-auto bg-background">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#0B1E3D", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Inventory Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage products, stock levels, and pricing</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="text-white text-sm font-medium gap-2"
              style={{ background: "linear-gradient(135deg, #C8102E, #A50E26)" }}
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle style={{ color: "#0B1E3D" }}>Add New Product</DialogTitle>
              <DialogDescription>Enter product details to add to inventory.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input placeholder="Enter product name" />
                </div>
                <div className="space-y-2">
                  <Label>SKU</Label>
                  <Input placeholder="Enter SKU code" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cleaning">Cleaning Supplies</SelectItem>
                      <SelectItem value="personal">Personal Care</SelectItem>
                      <SelectItem value="food">Food & Beverages</SelectItem>
                      <SelectItem value="household">Household Items</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Supplier</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cleancorp">CleanCorp</SelectItem>
                      <SelectItem value="soapworks">SoapWorks</SelectItem>
                      <SelectItem value="paperplus">PaperPlus</SelectItem>
                      <SelectItem value="bevcorp">BevCorp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Cost Price (ETB)</Label>
                  <Input type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>Selling Price (ETB)</Label>
                  <Input type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>Initial Stock</Label>
                  <Input type="number" placeholder="0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Enter product description" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button style={{ background: "#C8102E" }} className="text-white">Add Product</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Products", value: products.length, color: "#1D4ED8", bg: "#EEF2FF" },
          { label: "Low Stock Items", value: products.filter(p => p.status === "Low Stock").length, color: "#D97706", bg: "#FFFBEB" },
          { label: "Out of Stock", value: products.filter(p => p.status === "Out of Stock").length, color: "#C8102E", bg: "#FFF1F3" },
        ].map((stat, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: stat.bg }}>
                <Package className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold" style={{ color: "#0B1E3D" }}>{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex gap-3 flex-wrap items-center">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 min-w-56 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or SKU..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-44"><SelectValue placeholder="All Categories" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Cleaning Supplies">Cleaning Supplies</SelectItem>
                <SelectItem value="Personal Care">Personal Care</SelectItem>
                <SelectItem value="Food & Beverages">Food & Beverages</SelectItem>
                <SelectItem value="Household Items">Household Items</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="In Stock">In Stock</SelectItem>
                <SelectItem value="Low Stock">Low Stock</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3 border-b" style={{ borderColor: "#E8EDF5" }}>
          <CardTitle className="text-base flex items-center gap-2" style={{ color: "#0B1E3D" }}>
            <Package className="h-4 w-4" style={{ color: "#2563EB" }} />
            Products ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow style={{ background: "#F8FAFC" }}>
                <TableHead className="text-xs font-semibold" style={{ color: "#64748B" }}>Product</TableHead>
                <TableHead className="text-xs font-semibold" style={{ color: "#64748B" }}>SKU</TableHead>
                <TableHead className="text-xs font-semibold" style={{ color: "#64748B" }}>Category</TableHead>
                <TableHead className="text-xs font-semibold" style={{ color: "#64748B" }}>Stock</TableHead>
                <TableHead className="text-xs font-semibold" style={{ color: "#64748B" }}>Cost</TableHead>
                <TableHead className="text-xs font-semibold" style={{ color: "#64748B" }}>Price</TableHead>
                <TableHead className="text-xs font-semibold" style={{ color: "#64748B" }}>Margin</TableHead>
                <TableHead className="text-xs font-semibold" style={{ color: "#64748B" }}>Status</TableHead>
                <TableHead className="text-xs font-semibold" style={{ color: "#64748B" }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const margin = ((product.price - product.cost) / product.cost * 100).toFixed(1)
                const sc = statusConfig[product.status]
                return (
                  <TableRow key={product.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.supplier}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs" style={{ color: "#64748B" }}>{product.sku}</TableCell>
                    <TableCell className="text-sm">{product.category}</TableCell>
                    <TableCell className="text-sm font-semibold" style={{ color: product.stock === 0 ? "#C8102E" : "#0B1E3D" }}>
                      {product.stock}
                    </TableCell>
                    <TableCell className="text-sm">ETB {product.cost}</TableCell>
                    <TableCell className="text-sm font-medium">ETB {product.price}</TableCell>
                    <TableCell>
                      <span className="text-sm font-semibold" style={{ color: "#16A34A" }}>{margin}%</span>
                    </TableCell>
                    <TableCell>
                      <span
                        className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ color: sc.color, background: sc.bg }}
                      >
                        {sc.icon}
                        {product.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 w-7 p-0 hover:border-red-300 hover:text-red-500">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
