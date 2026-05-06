import { cn } from "@/lib/utils"

const items = [
  "NUEVA COLECCIÓN",
  "STREETWEAR MULTIMARCA",
  "ENVÍO A TODO COLOMBIA",
  "PAGO SEGURO",
  "KULT",
  "NUEVA COLECCIÓN",
  "STREETWEAR MULTIMARCA",
  "ENVÍO A TODO COLOMBIA",
  "PAGO SEGURO",
  "KULT",
]

interface MarqueeProps {
  className?: string
  reverse?: boolean
  accent?: boolean
}

export function Marquee({ className, reverse = false, accent = false }: MarqueeProps) {
  const content = (
    <span className="flex items-center gap-8 pr-8">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-8 whitespace-nowrap">
          <span>{item}</span>
          <span className={cn("text-2xl", accent ? "text-kult-neon" : "opacity-30")}>•</span>
        </span>
      ))}
    </span>
  )

  return (
    <div
      className={cn(
        "overflow-hidden border-y border-[var(--border)] py-3 select-none",
        accent ? "bg-kult-neon text-kult-bg" : "bg-[var(--surface)]",
        className
      )}
    >
      <div
        className={cn(
          "flex w-max",
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        )}
      >
        {content}
        {content}
      </div>
    </div>
  )
}
