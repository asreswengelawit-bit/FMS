import { AlertCircle, Info, CheckCircle2 } from "lucide-react"

interface AlertBannerProps {
  type?: "warning" | "info" | "success"
  message: string
}

const config = {
  warning: { icon: AlertCircle, color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  info:    { icon: Info,        color: "#2563EB", bg: "#EEF2FF", border: "#BFDBFE" },
  success: { icon: CheckCircle2,color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
}

export function AlertBanner({ type = "warning", message }: AlertBannerProps) {
  const { icon: Icon, color, bg, border } = config[type]
  return (
    <div className="flex items-start gap-3 rounded-xl px-4 py-3 border text-sm"
      style={{ background: bg, borderColor: border, color }}>
      <Icon className="h-4 w-4 mt-0.5 shrink-0" />
      <span dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  )
}
