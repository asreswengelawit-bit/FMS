import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shared/components/ui/card"
import { Button } from "@/features/shared/components/ui/button"
import { Input } from "@/features/shared/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/features/shared/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/features/shared/components/ui/dialog"
import { Label } from "@/features/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shared/components/ui/select"
import { Textarea } from "@/features/shared/components/ui/textarea"
import { Plus, Search, Filter, Truck, MapPin, Phone, Mail, Edit, Trash2, Star, Package, DollarSign } from "lucide-react"

const suppliers = [
  { id: "SUP-001", name: "CleanCorp Industries", email: "orders@cleancorp.com", phone: "+251 911 987 654", address: "Addis Ababa, Nifas Silk Sub-city", category: "Cleaning Supplies", status: "Active", rating: 4.8, totalOrders: 156, totalPurchased: 245000.00, lastOrder: "2025-07-18", paymentTerms: "Net 30", leadTime: "3-5 days" },
  { id: "SUP-002", name: "SoapWorks Ltd", email: "sales@soapworks.com", phone: "+251 911 876 543", address: "Addis Ababa, Kolfe Sub-city", category: "Personal Care", status: "Active", rating: 4.6, totalOrders: 98, totalPurchased: 156000.50, lastOrder: "2025-07-17", paymentTerms: "Net 15", leadTime: "2-4 days" },
  { id: "SUP-003", name: "PaperPlus Manufacturing", email: "wholesale@paperplus.com", phone: "+251 911 765 432", address: "Addis Ababa, Bole Sub-city", category: "Household Items", status: "Active", rating: 4.4, totalOrders: 72, totalPurchased: 98000.75, lastOrder: "2025-07-15", paymentTerms: "Net 45", leadTime: "5-7 days" },
  { id: "SUP-004", name: "BevCorp Distributors", email: "orders@bevcorp.com", phone: "+251 911 654 321", address: "Addis Ababa, Kirkos Sub-city", category: "Food & Beverages", status: "Active", rating: 4.2, totalOrders: 134, totalPurchased: 187000.25, lastOrder: "2025-07-18", paymentTerms: "COD", leadTime: "1-3 days" },
  { id: "SUP-005", name: "QuickSupply Co", email: "sales@quicksupply.com", phone: "+251 911 543 210", address: "Addis Ababa, Akaki Sub-city", category: "General Supplies", status: "Inactive", rating: 3.8, totalOrders: 24, totalPurchased: 32000.00, lastOrder: "2025-05-10", paymentTerms: "Net 30", leadTime: "7-10 days" },
]

const statusConfig: Record<string, { color: string; bg: string }> = {
  Active: { color: "#16A34A", bg: "#F0FDF4" },
  Inactive: { color: "#64748B", bg: "#F1F5F9" },
  Suspended: { color: "#C8102E", bg: "#FFF1F3" },
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
        />
      ))}
      <span className="text-xs font-semibold ml-1" style={{ color: "#0B1E3D" }}>{rating}</span>
    </div>
  )
}

export function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredSuppliers = suppliers.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || s.status === statusFilter
    const matchesCategory = categoryFilter === "all" || s.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const totalPurchased = suppliers.reduce((s, sup) => s + sup.totalPurchased, 0)
  const avgRating = suppliers.reduce((s, sup) => s + sup.rating, 0) / suppliers.length

  const stats = [
    { label: "Total Suppliers", value: suppliers.length, color: "#1D4ED8", bg: "#EEF2FF", icon: Truck },
    { label: "Active Suppliers", value: suppliers.filter(s => s.status === "Active").length, color: "#16A34A", bg: "#F0FDF4", icon: Package },
    { label: "Total Purchased (ETB)", value: totalPurchased.toLocaleString(), color: "#C8102E", bg: "#FFF1F3", icon: DollarSign },
    { label: "Avg Rating", value: avgRating.toFixed(1), color: "#D97706", bg: "#FFFBEB", icon: Star },
  ]

  return (
    <div className="p-6 space-y-6 h-full overflow-auto bg-background">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#0B1E3D", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Supplier Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage vendors, contracts, and purchase history</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="text-white text-sm font-medium gap-2" style={{ background: "linear-gradient(135deg, #C8102E, #A50E26)" }}>
              <Plus className="h-4 w-4" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle style={{ color: "#0B1E3D" }}>Add New Supplier</DialogTitle>
              <DialogDescription>Enter supplier details to register a new vendor.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input placeholder="Enter company name" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cleaning">Cleaning Supplies</SelectItem>
                      <SelectItem value="personal">Personal Care</SelectItem>
                      <SelectItem value="food">Food & Beverages</SelectItem>
                      <SelectItem value="household">Household Items</SelectItem>
                      <SelectItem value="general">General Supplies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="supplier@company.com" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input placeholder="+251 911 123 456" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea placeholder="Enter full address" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Payment Terms</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select terms" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cod">COD</SelectItem>
                      <SelectItem value="net15">Net 15</SelectItem>
                      <SelectItem value="net30">Net 30</SelectItem>
                      <SelectItem value="net45">Net 45</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Lead Time</Label>
                  <Input placeholder="e.g., 3-5 days" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button style={{ background: "#C8102E" }} className="text-white">Add Supplier</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon
          return (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: s.bg }}>
                  <Icon className="h-5 w-5" style={{ color: s.color }} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-lg font-bold" style={{ color: "#0B1E3D" }}>{s.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex gap-3 flex-wrap items-center">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 min-w-56 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search suppliers..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-44"><SelectValue placeholder="All Categories" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Cleaning Supplies">Cleaning Supplies</SelectItem>
                <SelectItem value="Personal Care">Personal Care</SelectItem>
                <SelectItem value="Food & Beverages">Food & Beverages</SelectItem>
                <SelectItem value="Household Items">Household Items</SelectItem>
                <SelectItem value="General Supplies">General Supplies</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3 border-b" style={{ borderColor: "#E8EDF5" }}>
          <CardTitle className="text-base flex items-center gap-2" style={{ color: "#0B1E3D" }}>
            <Truck className="h-4 w-4" style={{ color: "#2563EB" }} />
            Suppliers ({filteredSuppliers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow style={{ background: "#F8FAFC" }}>
                {["Supplier", "Contact", "Category", "Rating", "Orders", "Total Purchased", "Terms", "Status", "Actions"].map(h => (
                  <TableHead key={h} className="text-xs font-semibold" style={{ color: "#64748B" }}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((sup) => {
                const sc = statusConfig[sup.status]
                return (
                  <TableRow key={sup.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell>
                      <p className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{sup.name}</p>
                      <p className="text-xs font-mono" style={{ color: "#2563EB" }}>{sup.id}</p>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Mail className="h-3 w-3" /> {sup.email}</div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Phone className="h-3 w-3" /> {sup.phone}</div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {sup.address.split(',')[0]}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{sup.category}</TableCell>
                    <TableCell><StarRating rating={sup.rating} /></TableCell>
                    <TableCell className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{sup.totalOrders}</TableCell>
                    <TableCell className="text-sm font-bold" style={{ color: "#0B1E3D" }}>ETB {sup.totalPurchased.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <p className="font-medium">{sup.paymentTerms}</p>
                        <p className="text-muted-foreground">{sup.leadTime}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: sc.color, background: sc.bg }}>
                        {sup.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="h-7 w-7 p-0"><Edit className="h-3.5 w-3.5" /></Button>
                        <Button variant="outline" size="sm" className="h-7 w-7 p-0 hover:border-red-300 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></Button>
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
