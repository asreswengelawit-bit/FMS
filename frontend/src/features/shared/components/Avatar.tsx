const gradients = [
  ["#4F6FAF", "#0B1E3D"],
  ["#C8102E", "#7C0A1A"],
  ["#7C3AED", "#4C1D95"],
  ["#D97706", "#92400E"],
  ["#16A34A", "#14532D"],
  ["#2563EB", "#1E3A8A"],
]

function initials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
}

function pickGradient(name: string) {
  const idx = name.charCodeAt(0) % gradients.length
  return gradients[idx]
}

export function UserAvatar({ name, size = 32 }: { name: string; size?: number }) {
  const [from, to] = pickGradient(name)
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.35,
        background: `linear-gradient(135deg, ${from}, ${to})`,
      }}
    >
      {initials(name)}
    </div>
  )
}
