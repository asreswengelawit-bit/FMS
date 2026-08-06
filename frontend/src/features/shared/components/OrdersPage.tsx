import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shared/components/ui/card"
import { Button } from "@/features/shared/components/ui/button"
import { Input } from "@/features/shared/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/features/shared/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shared/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/features/shared/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/features/shared/components/ui/tabs"
import { Plus, Search, Filter, Eye, Edit, Truck, ShoppingCart, Clock, CheckCircle2, Package } from "lucide-react"

const orders = [
  { id: "ORD-001", customer: "ABC Mart", customerEmail: "orders@abcmart.com", date: "2025-07-18", status: "Processing", total: 2450.00, items: 15, paymentStatus: "Paid", shippingAddress: "Bole Sub-city, Addis Ababa" },
  { id: "ORD-002", customer: "QuickStop Store", customerEmail: "purchasing@quickstop.com", date: "2025-07-17", status: "Shipped", total: 1890.50, items: 8, paymentStatus: "Paid", shippingAddress: "Kirkos Sub-city, Addis Ababa" },
  { id: "ORD-003", customer: "Daily Needs Co", customerEmail: "orders@dailyneeds.com", date: "2025-07-16", status: "Delivered", total: 3200.75, items: 22, paymentStatus: "Paid", shippingAddress: "Yeka Sub-city, Addis Ababa" },
  { id: "ORD-004", customer: "Corner Shop", customerEmail: "shop@corner.com", date: "2025-07-15", status: "Processing", total: 980.25, items: 5, paymentStatus: "Pending", shippingAddress: "Arada Sub-city, Addis Ababa" },
  { id: "ORD-005", customer: "Fresh Market", customerEmail: "orders@freshmarket.com", date: "2025-07-14", status: "Pending", total: 1650.00, items: 12, paymentStatus: "Pending", shippingAddress: "Lideta Sub-city, Addis Ababa" },
  { id: "ORD-006", customer: "Mega Wholesale", customerEmail: "mega@wholesale.com", date: "2025-07-13", status: "Delivered", total: 4200.00, items: 30, paymentStatus: "Paid", shippingAddress: "Nifas Silk Sub-city, Addis Ababa" },
]

const orderItems = [
  { product: "All-Purpose Cleaner 500ml", quantity: 24, price: 3.99, total: 95.76 },
  { product: "Hand Soap 250ml", quantity: 36, price: 2.49, total: 89.64 },
  { product: "Paper Towels 6-pack", quantity: 12, price: 12.99, total: 155.88 },
  { product: "Instant Coffee 200g", quantity: 18, price: 7.99, total: 143.82 },
]

const statusConfig: Record<string, { color: string; bg: string }> = {
  Pending: { color: "#D97706", bg: "#FFFBEB" },
  Processing: { color: "#2563EB", bg: "#EEF2FF" },
  Shipped: { color: "#7C3AED", bg: "#F5F3FF" },
  Delivered: { color: "#16A34A", bg: "#F0FDF4" },
  Cancelled: { color: "#C8102E", bg: "#FFF1F3" },
}

const paymentConfig: Record<string, { color: string; bg: string }> = {
  Paid: { color: "#16A34A", bg: "#F0FDF4" },
  Pending: { color: "#D97706", bg: "#FFFBEB" },
  Failed: { color: "#C8102E", bg: "#FFF1F3" },
}

export function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null)

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter
    return matchesSearch && matchesStatus && matchesPayment
  })

  const stats = [
    { label: "Total Orders", value: orders.length, icon: ShoppingCart, color: "#1D4ED8", bg: "#EEF2FF" },
    { label: "Processing", value: orders.filter(o => o.status === "Processing").length, icon: Clock, color: "#D97706", bg: "#FFFBEB" },
    { label: "Shipped", value: orders.filter(o => o.status === "Shipped").length, icon: Truck, color: "#7C3AED", bg: "#F5F3FF" },
    { label: "Delivered", value: orders.filter(o => o.status === "Delivered").length, icon: CheckCircle2, color: "#16A34A", bg: "#F0FDF4" },
  ]

  return (
    <div className="p-6 space-y-6 h-full overflow-auto bg-background">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#0B1E3D", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Order Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Track and manage wholesale orders</p>
        </div>
        <Button
          className="text-white text-sm font-medium gap-2"
          style={{ background: "linear-gradient(135deg, #C8102E, #A50E26)" }}
        >
          <Plus className="h-4 w-4" />
          New Order
        </Button>
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
                  <p className="text-xl font-bold" style={{ color: "#0B1E3D" }}>{s.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Revenue Summary */}
      <Card className="border-0 shadow-sm" style={{ background: "linear-gradient(135deg, #0B1E3D, #1E3A6E)" }}>
        <CardContent className="p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-200">Total Revenue — All Orders</p>
            <p className="text-3xl font-bold text-white mt-1">
              ETB {orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-200">Avg. Order Value</p>
            <p className="text-xl font-bold text-white">
              ETB {(orders.reduce((sum, o) => sum + o.total, 0) / orders.length).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex gap-3 flex-wrap items-center">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 min-w-56 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders or customers..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Payment" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3 border-b" style={{ borderColor: "#E8EDF5" }}>
          <CardTitle className="text-base flex items-center gap-2" style={{ color: "#0B1E3D" }}>
            <ShoppingCart className="h-4 w-4" style={{ color: "#2563EB" }} />
            Orders ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow style={{ background: "#F8FAFC" }}>
                {["Order ID", "Customer", "Date", "Items", "Total", "Payment", "Status", "Actions"].map(h => (
                  <TableHead key={h} className="text-xs font-semibold" style={{ color: "#64748B" }}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const sc = statusConfig[order.status]
                const pc = paymentConfig[order.paymentStatus]
                return (
                  <TableRow key={order.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="font-mono text-xs font-semibold" style={{ color: "#2563EB" }}>{order.id}</TableCell>
                    <TableCell>
                      <p className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>{order.customer}</p>
                      <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{order.date}</TableCell>
                    <TableCell className="text-sm">{order.items} items</TableCell>
                    <TableCell className="text-sm font-bold" style={{ color: "#0B1E3D" }}>ETB {order.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: pc.color, background: pc.bg }}>
                        {order.paymentStatus}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: sc.color, background: sc.bg }}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => setSelectedOrder(order)}>
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle style={{ color: "#0B1E3D" }}>Order Details — {selectedOrder?.id}</DialogTitle>
                              <DialogDescription>Complete order information</DialogDescription>
                            </DialogHeader>
                            {selectedOrder && (
                              <Tabs defaultValue="details">
                                <TabsList>
                                  <TabsTrigger value="details">Details</TabsTrigger>
                                  <TabsTrigger value="items">Items</TabsTrigger>
                                  <TabsTrigger value="tracking">Tracking</TabsTrigger>
                                </TabsList>
                                <TabsContent value="details" className="space-y-4 pt-2">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-lg" style={{ background: "#F8FAFC" }}>
                                      <h4 className="text-sm font-semibold mb-2" style={{ color: "#0B1E3D" }}>Customer</h4>
                                      <p className="text-sm font-medium">{selectedOrder.customer}</p>
                                      <p className="text-xs text-muted-foreground">{selectedOrder.customerEmail}</p>
                                    </div>
                                    <div className="p-4 rounded-lg" style={{ background: "#F8FAFC" }}>
                                      <h4 className="text-sm font-semibold mb-2" style={{ color: "#0B1E3D" }}>Order Summary</h4>
                                      <p className="text-sm">Total: <strong>ETB {selectedOrder.total}</strong></p>
                                      <p className="text-sm">Items: {selectedOrder.items}</p>
                                      <p className="text-sm">Date: {selectedOrder.date}</p>
                                    </div>
                                  </div>
                                  <div className="p-4 rounded-lg" style={{ background: "#F8FAFC" }}>
                                    <h4 className="text-sm font-semibold mb-1" style={{ color: "#0B1E3D" }}>Shipping Address</h4>
                                    <p className="text-sm text-muted-foreground">{selectedOrder.shippingAddress}</p>
                                  </div>
                                </TabsContent>
                                <TabsContent value="items">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Qty</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Total</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {orderItems.map((item, i) => (
                                        <TableRow key={i}>
                                          <TableCell className="text-sm">{item.product}</TableCell>
                                          <TableCell className="text-sm">{item.quantity}</TableCell>
                                          <TableCell className="text-sm">ETB {item.price}</TableCell>
                                          <TableCell className="text-sm font-semibold">ETB {item.total}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TabsContent>
                                <TabsContent value="tracking" className="space-y-3 pt-2">
                                  {[
                                    { label: "Order Placed", time: "July 18, 2025 — 10:30 AM", done: true },
                                    { label: "Processing", time: "July 18, 2025 — 2:15 PM", done: true },
                                    { label: "Shipped", time: "Pending...", done: false },
                                    { label: "Delivered", time: "Pending...", done: false },
                                  ].map((step, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                      <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0" style={{ background: step.done ? "#C8102E" : "#D1D9E8" }} />
                                      <div>
                                        <p className="text-sm font-medium" style={{ color: "#0B1E3D" }}>{step.label}</p>
                                        <p className="text-xs text-muted-foreground">{step.time}</p>
                                      </div>
                                    </div>
                                  ))}
                                </TabsContent>
                              </Tabs>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                          <Edit className="h-3.5 w-3.5" />
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
