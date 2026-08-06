import { Card, CardContent, CardHeader, CardTitle } from "@/features/shared/components/ui/card"
import { Button } from "@/features/shared/components/ui/button"
import { Input } from "@/features/shared/components/ui/input"
import { Label } from "@/features/shared/components/ui/label"
import { Switch } from "@/features/shared/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shared/components/ui/select"
import { Textarea } from "@/features/shared/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/features/shared/components/ui/tabs"
import { Separator } from "@/features/shared/components/ui/separator"
import { Settings, User, Bell, Shield, Database, Mail, Globe, Palette, CheckCircle } from "lucide-react"

export function SettingsPage() {
  return (
    <div className="p-6 space-y-6 h-full overflow-auto bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#0B1E3D", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            System Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Configure your INSA ERP system preferences</p>
        </div>
        <Button className="text-white gap-2" style={{ background: "linear-gradient(135deg, #C8102E, #A50E26)" }}>
          Save All Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="border-b rounded-none bg-transparent p-0 h-auto gap-6 w-full justify-start" style={{ borderColor: "#E8EDF5" }}>
          {[
            { value: "general", label: "General", icon: Settings },
            { value: "notifications", label: "Notifications", icon: Bell },
            { value: "security", label: "Security", icon: Shield },
            { value: "integrations", label: "Integrations", icon: Database },
            { value: "preferences", label: "Preferences", icon: Palette },
          ].map(tab => {
            const Icon = tab.icon
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C8102E] data-[state=active]:text-[#C8102E] pb-3 pt-1 px-0 text-sm font-medium bg-transparent shadow-none gap-1.5"
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {/* General */}
        <TabsContent value="general" className="space-y-5">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2" style={{ color: "#0B1E3D" }}>
                <Settings className="h-4 w-4" style={{ color: "#2563EB" }} />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input defaultValue="INSA Wholesale ERP System" />
                </div>
                <div className="space-y-2">
                  <Label>Business Type</Label>
                  <Select defaultValue="wholesale">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wholesale">Wholesale</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="distribution">Distribution</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Business Email</Label>
                  <Input type="email" defaultValue="info@insa.gov.et" />
                </div>
                <div className="space-y-2">
                  <Label>Business Phone</Label>
                  <Input defaultValue="+251 116 461 921" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Business Address</Label>
                <Textarea defaultValue="Information Network Security Administration, Addis Ababa, Ethiopia" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tax ID (TIN)</Label>
                  <Input defaultValue="ETH-2024-01234" />
                </div>
                <div className="space-y-2">
                  <Label>Default Currency</Label>
                  <Select defaultValue="etb">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="etb">ETB (Ethiopian Birr)</SelectItem>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2" style={{ color: "#0B1E3D" }}>
                <User className="h-4 w-4" style={{ color: "#2563EB" }} />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Administrator", email: "admin@insa.gov.et", role: "Owner", roleColor: "#C8102E", roleBg: "#FFF1F3" },
                { name: "Sales Manager", email: "sales@insa.gov.et", role: "Manager", roleColor: "#2563EB", roleBg: "#EEF2FF" },
                { name: "Warehouse Staff", email: "warehouse@insa.gov.et", role: "Staff", roleColor: "#16A34A", roleBg: "#F0FDF4" },
              ].map((user, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "#F8FAFC" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "linear-gradient(135deg, #0B1E3D, #2563EB)" }}>
                      {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "#0B1E3D" }}>{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: user.roleColor, background: user.roleBg }}>
                    {user.role}
                  </span>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2 gap-2">
                <User className="h-4 w-4" />
                Invite New User
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-5">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2" style={{ color: "#0B1E3D" }}>
                <Bell className="h-4 w-4" style={{ color: "#2563EB" }} />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              {[
                { label: "Order Notifications", desc: "Get notified when new orders are placed", on: true },
                { label: "Low Stock Alerts", desc: "Alert when inventory is running low", on: true },
                { label: "Payment Reminders", desc: "Remind about overdue payments", on: true },
                { label: "System Updates", desc: "Notifications about system updates", on: false },
                { label: "Weekly Reports", desc: "Receive weekly business reports via email", on: true },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <p className="text-sm font-medium" style={{ color: "#0B1E3D" }}>{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.on} />
                  </div>
                  {i < 4 && <Separator />}
                </div>
              ))}
              <div className="pt-4">
                <Label>Email Digest Frequency</Label>
                <Select defaultValue="immediate">
                  <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="hourly">Hourly Digest</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Digest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-5">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2" style={{ color: "#0B1E3D" }}>
                <Shield className="h-4 w-4" style={{ color: "#2563EB" }} />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              {[
                { label: "Two-Factor Authentication", desc: "Add an extra layer of security", on: false },
                { label: "Login Notifications", desc: "Get notified of new login sessions", on: true },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <p className="text-sm font-medium" style={{ color: "#0B1E3D" }}>{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.on} />
                  </div>
                  <Separator />
                </div>
              ))}
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm font-medium" style={{ color: "#0B1E3D" }}>Session Timeout</p>
                  <p className="text-xs text-muted-foreground">Auto-logout after inactivity</p>
                </div>
                <Select defaultValue="30min">
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15min">15 min</SelectItem>
                    <SelectItem value="30min">30 min</SelectItem>
                    <SelectItem value="1hour">1 hour</SelectItem>
                    <SelectItem value="4hours">4 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="pt-4 space-y-3">
                <p className="text-sm font-medium" style={{ color: "#0B1E3D" }}>Password Management</p>
                <Button variant="outline" className="gap-2">Change Password</Button>
                <div className="space-y-2">
                  <Label>Password Policy</Label>
                  <Select defaultValue="strong">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                      <SelectItem value="strong">Strong (12+ chars, mixed case, numbers)</SelectItem>
                      <SelectItem value="enterprise">Enterprise (complex requirements)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-5">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2" style={{ color: "#0B1E3D" }}>
                <Database className="h-4 w-4" style={{ color: "#2563EB" }} />
                System Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Email Service", desc: "Connected to SMTP Server", connected: true, iconColor: "#2563EB", iconBg: "#EEF2FF", icon: Mail },
                { name: "Accounting Software", desc: "Ethiopian Revenue Authority API", connected: false, iconColor: "#16A34A", iconBg: "#F0FDF4", icon: Database },
                { name: "E-commerce Platform", desc: "Online storefront sync", connected: false, iconColor: "#7C3AED", iconBg: "#F5F3FF", icon: Globe },
                { name: "Logistics Provider", desc: "Ethiopian Postal Service", connected: true, iconColor: "#D97706", iconBg: "#FFFBEB", icon: Settings },
              ].map((intg, i) => {
                const Icon = intg.icon
                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: "#E8EDF5" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: intg.iconBg }}>
                        <Icon className="h-4 w-4" style={{ color: intg.iconColor }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: "#0B1E3D" }}>{intg.name}</p>
                        <p className="text-xs text-muted-foreground">{intg.desc}</p>
                      </div>
                    </div>
                    {intg.connected
                      ? <span className="text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1" style={{ color: "#16A34A", background: "#F0FDF4" }}>
                          <CheckCircle className="h-3 w-3" /> Connected
                        </span>
                      : <Button variant="outline" size="sm" className="text-xs h-7" style={{ borderColor: "#2563EB", color: "#2563EB" }}>Connect</Button>
                    }
                  </div>
                )
              })}
              <div className="pt-3 space-y-3">
                <p className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>API Configuration</p>
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <div className="flex gap-2">
                    <Input value="insa_live_k8x2..." type="password" readOnly />
                    <Button variant="outline">Regenerate</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="space-y-5">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2" style={{ color: "#0B1E3D" }}>
                <Palette className="h-4 w-4" style={{ color: "#2563EB" }} />
                Display & Localization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Interface Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="am">Amharic (አማርኛ)</SelectItem>
                      <SelectItem value="om">Oromiffa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select defaultValue="eat">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eat">East Africa Time (EAT +3)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select defaultValue="dmy">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Records per Page</Label>
                  <Select defaultValue="25">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <p className="text-sm font-semibold" style={{ color: "#0B1E3D" }}>Dashboard Preferences</p>
              {[
                { label: "Show Quick Stats", desc: "Display overview metrics on dashboard", on: true },
                { label: "Auto-refresh Data", desc: "Automatically update dashboard data every 5 min", on: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#0B1E3D" }}>{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.on} />
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="flex justify-end gap-2">
            <Button variant="outline">Reset to Defaults</Button>
            <Button style={{ background: "#C8102E" }} className="text-white">Save Changes</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
