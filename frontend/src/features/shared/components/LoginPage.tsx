import { useState } from "react"
import { Button } from "@/features/shared/components/ui/button"
import { Input } from "@/features/shared/components/ui/input"
import { Label } from "@/features/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shared/components/ui/select"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { Eye, EyeOff, Shield, Lock, User } from "lucide-react"
import insaLogo from "../../imports/Logo_of_Ethiopian_INSA.png"

interface LoginPageProps {
  onLogin: (role: string, name: string) => void
}

const roles = [
  { value: "super_admin",         label: "Super Administrator",  description: "Full system access across all modules" },
  { value: "hr_manager",          label: "HR Manager",           description: "Human Resource Management" },
  { value: "procurement_officer", label: "Procurement Officer",  description: "Procurement & Resource Management" },
  { value: "inventory_manager",   label: "Inventory Manager",    description: "Material Management System" },
  { value: "sales_officer",       label: "Sales Officer",        description: "Sales & Customer Relations" },
  { value: "finance_officer",     label: "Finance Officer",      description: "Finance Management System" },
  { value: "auditor",             label: "Auditor",              description: "Read-only access across all modules" },
]

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail]               = useState("")
  const [password, setPassword]         = useState("")
  const [role, setRole]                 = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState("")

  const handleLogin = () => {
    if (!email || !password || !role) {
      setError("Please fill in all fields to continue.")
      return
    }
    setError("")
    setLoading(true)
    setTimeout(() => {
      const selected = roles.find(r => r.value === role)
      onLogin(role, selected?.label ?? "User")
      setLoading(false)
    }, 900)
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#F4F6FA" }}>

      {/* ── Left Panel — Visual Identity ── */}
      <div
        className="hidden lg:flex lg:w-5/12 flex-col items-center justify-center relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0B1E3D 0%, #12274F 55%, #0B1E3D 100%)" }}
      >
        {/* Decorative concentric rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[500px] rounded-full border opacity-[0.04]" style={{ borderColor: "#ffffff" }} />
          <div className="absolute w-[360px] h-[360px] rounded-full border opacity-[0.06]" style={{ borderColor: "#C8102E" }} />
          <div className="absolute w-[220px] h-[220px] rounded-full border opacity-[0.08]" style={{ borderColor: "#2563EB" }} />
        </div>
        {/* Colour blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full opacity-[0.08] blur-3xl" style={{ background: "#C8102E" }} />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-[0.08] blur-3xl" style={{ background: "#2563EB" }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-14">
          {/* INSA logo — large */}
          <div className="w-43 h-43 rounded-3xl  p-4 mb-8 ring-1 bg-white/10 backdrop-blur-sm ring-white/15   shadow-2xl">
            <ImageWithFallback src={insaLogo} alt="INSA Logo" className="w-full h-full object-contain" />
          </div>

          {/* Accent rule */}
          <div className="flex items-center gap-2 mb-6">
            <div className="h-px w-10" style={{ background: "#C8102E" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#C8102E" }} />
            <div className="h-px w-10" style={{ background: "#2563EB" }} />
          </div>

          <h1 className="text-3xl font-bold text-white mb-2 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Information Network Security Administration
          </h1>
          
          <p className="text-xs mt-1.5" style={{ color: "#475569" }}>Addis Ababa, Ethiopia</p>
        </div>

        {/* Bottom footer */}
        <div className="absolute bottom-6 left-0 right-0 px-10 text-center">
          <div className="h-px mb-4" style={{ background: "rgba(255,255,255,0.06)" }} />
          <p className="text-xs" style={{ color: "#475569" }}>
            © 2025 Information Network Security Administration
          </p>
        </div>
      </div>

      {/* ── Right Panel — Login Form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">

        {/* INSA logo above form */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-[100px] h-[100px] "
            style={{ borderColor: "#E8EDF5" }}
          >
            <ImageWithFallback src={insaLogo} alt="INSA Logo" className="w-full h-full object-contain" />
          </div>
          <p className="text-base font-bold" style={{ color: "#0B1E3D", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            INSA ERP System
          </p>
        </div>

        <div className="w-full max-w-[420px]">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg border p-8" style={{ borderColor: "#E8EDF5" }}>

            {/* Card header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-5 w-5" style={{ color: "#C8102E" }} />
                <h2 className="text-xl font-bold" style={{ color: "#0B1E3D", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Sign In
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter your credentials to access the system
              </p>
            </div>

            <div className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#64748B" }}>
                  Email Address
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@insa.gov.et"
                    className="pl-10"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                    style={{ borderColor: "#E8EDF5" }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#64748B" }}>
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                    style={{ borderColor: "#E8EDF5" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#64748B" }}>
                  System Role
                </Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger style={{ borderColor: "#E8EDF5" }}>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(r => (
                      <SelectItem key={r.value} value={r.value}>
                        <div>
                          <p className="font-medium text-sm">{r.label}</p>
                          <p className="text-xs text-muted-foreground">{r.description}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Error */}
              {error && (
                <div className="text-xs font-medium text-center py-2 px-3 rounded-lg"
                  style={{ color: "#C8102E", background: "#FFF1F3" }}>
                  {error}
                </div>
              )}

              {/* Sign-in button */}
              <Button
                className="w-full text-white font-semibold h-11 text-sm"
                style={{ background: loading ? "#64748B" : "linear-gradient(135deg, #C8102E, #A50E26)" }}
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin block" />
                    Authenticating…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Shield className="h-4 w-4" /> Sign In Securely
                  </span>
                )}
              </Button>
            </div>

            {/* Security notice */}
            <div className="mt-6 pt-5 border-t" style={{ borderColor: "#F1F5F9" }}>
              <div className="flex items-start gap-2">
                <Lock className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: "#CBD5E1" }} />
                <p className="text-xs leading-relaxed" style={{ color: "#94A3B8" }}>
                  This system is protected under the INSA Security Policy. Unauthorized access attempts are logged and monitored.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
