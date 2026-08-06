import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shared/components/ui/card"
import { Button } from "@/features/shared/components/ui/button"
import { Input } from "@/features/shared/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/features/shared/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/features/shared/components/ui/dialog"
import { Label } from "@/features/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shared/components/ui/select"
import { Textarea } from "@/features/shared/components/ui/textarea"
import { Plus, Search, Filter, Users, MapPin, Phone, Mail, Edit, Trash2, DollarSign, TrendingUp } from "lucide-react"

const customers = [
  { id: "CUST-001", name: "ABC Mart", email: "orders@abcmart.com", phone: "+251 911 123 456", address: "Bole Sub-city, Addis Ababa", type: "Retail Store", status: "Active", totalOrders: 24, totalSpent: 18750.00, lastOrder: "2025-07-18", creditLimit: 25000, paymentTerms: "Net 30" },
  { id: "CUST-002", name: "QuickStop Store", email: "purchasing@quickstop.com", phone: "+251 911 234 567", address: "Kirkos Sub-city, Addis Ababa", type: "Convenience Store", status: "Active", totalOrders: 18, totalSpent: 12400.50, lastOrder: "2025-07-17", creditLimit: 15000, paymentTerms: "Net 15" },
  { id: "CUST-003", name: "Daily Needs Co", email: "orders@dailyneeds.com", phone: "+251 911 345 678", address: "Yeka Sub-city, Addis Ababa", type: "Wholesale Distributor", status: "Active", totalOrders: 42, totalSpent: 45200.75, lastOrder: "2025-07-16", creditLimit: 50000, paymentTerms: "Net 45" },
  { id: "CUST-004", name: "Corner Shop", email: "shop@corner.com", phone: "+251 911 456 789", address: "Arada Sub-city, Addis Ababa", type: "Small Market", status: "Inactive", totalOrders: 8, totalSpent: 3200.25, lastOrder: "2025-06-15", creditLimit: 5000, paymentTerms: "COD" },
  { id: "CUST-005", name: "Fresh Market", email: "orders@freshmarket.com", phone: "+251 911 567 890", address: "Lideta Sub-city, Addis Ababa", type: "Supermarket", status: "Active", totalOrders: 36, totalSpent: 28650.00, lastOrder: "2025-07-14", creditLimit: 35000, paymentTerms: "Net 30" },
]

const statusConfig: Record<string, { color: string; bg: string }> = {
  Active: { color: "#16A34A", bg: "#F0FDF4" },
  Inactive: { color: "#64748B", bg: "#F1F5F9" },
  Suspended: { color: "#C8102E", bg: "#FFF1F3" },
}

export function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || c.status === statusFilter
    const matchesType = typeFilter === "all" || c.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0)
  const totalOrders = customers.reduce((s, c) => s + c.totalOrders, 0)

  const stats = [
    { label: "Total Customers", value: customers.length, color: "#1D4ED8", bg: "#EEF2FF", icon: Users },
    { label: "Active Customers", value: customers.filter(c => c.status === "Active").length, color: "#16A34A", bg: "#F0FDF4", icon: Users },
    { label: "Total Revenue (ETB)", value: totalRevenue.toLocaleString(), color: "#C8102E", bg: "#FFF1F3", icon: DollarSign },
    { label: "Avg Order Value", value: `ETB ${(totalRevenue / totalOrders).toFixed(0)}`, color: "#7C3AED", bg: "#F5F3FF", icon: TrendingUp },
  ]

  return (
    <div className="p-6 space-y-6 h-full overflow-auto bg-background">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#0B1E3D", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Customer Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage wholesale customer accounts and credit</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="text-white text-sm font-medium gap-2" style={{ background: "linear-gradient(135deg, #C8102E, #A50E26)" }}>
              <Plus className="h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle style={{ color: "#0B1E3D" }}>Add New Customer</DialogTitle>
              <DialogDescription>Enter customer details to create a new account.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input placeholder="Enter company name" />
                </div>
                <div className="space-y-2">
                  <Label>Customer Type</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail Store</SelectItem>
                      <SelectItem value="convenience">Convenience Store</SelectItem>
                      <SelectItem value="wholesale">Wholesale Distributor</SelectItem>
                      <SelectItem value="supermarket">Supermarket</SelectItem>
                      <SelectItem value="small">Small Market</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="company@email.com" />
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
                  <Label>Credit Limit (ETB)</Label>
                  <Input type="number" placeholder="0" />
                </div>
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
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button style={{ background: "#C8102E" }} className="text-white">Add Customer</Button>
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
              <Input placeholder="Search customers..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48"><SelectValue placeholder="All Types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Retail Store">Retail Store</SelectItem>
                <SelectItem value="Convenience Store">Convenience Store</SelectItem>
                <SelectItem value="Wholesale Distributor">Wholesale Distributor</SelectItem>
                <SelectItem value="Supermarket">Supermarket</SelectItem>
                <SelectItem value="Small Market">Small Market</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3 border-b" style={{ borderColor: "#E8EDF5" }}>
          <CardTitle className="text-base flex items-center gap-2" style={{ color: "#0B1E3D" }}>
            <Users className="h-4 w-4" style={{ color: "#2563EB" }} />
            Customers ({filteredCustomers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow style={{ background: "#F8FAFC" }}>
                {["Customer", "Contact", "Type", "Orders", "Total Spent", "Credit Limit", "Status", "Actions"].map(h => (
                  <TableHead key={h} className="text-xs font-semibold" style={{ color: "#64748B" }}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((c) => {
                const sc = statusConfig[c.status]
                return (
                  <TableRow key={c.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell>
                      <p className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{c.name}</p>
                      <p className="text-xs font-mono" style={{ color: "#2563EB" }}>{c.id}</p>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" /> {c.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" /> {c.phone}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" /> {c.address.split(',')[0]}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{c.type}</TableCell>
                    <TableCell className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{c.totalOrders}</TableCell>
                    <TableCell className="text-sm font-bold" style={{ color: "#0B1E3D" }}>ETB {c.totalSpent.toLocaleString()}</TableCell>
                    <TableCell className="text-sm">ETB {c.creditLimit.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: sc.color, background: sc.bg }}>
                        {c.status}
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
