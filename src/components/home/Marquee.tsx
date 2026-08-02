import { cn } from "@/lib/utils"

const defaultItems = [
  "Envío gratis desde $180.000",
  "Empaque discreto garantizado",
  "Paga seguro con Bold",
  "Asesoría de talla por WhatsApp",
  "Envío gratis desde $180.000",
  "Empaque discreto garantizado",
  "Paga seguro con Bold",
  "Asesoría de talla por WhatsApp",
]

const serifItems = [
  "DRALENA",
  "Hecho en Colombia",
  "Encaje & tul",
  "Para ti, primero",
  "DRALENA",
  "Hecho en Colombia",
  "Encaje & tul",
  "Para ti, primero",
]

interface MarqueeProps {
  className?: string
  reverse?: boolean
  accent?: boolean
  serif?: boolean
}

export function Marquee({ className, reverse = false, accent = false, serif = false }: MarqueeProps) {
  const items = serif ? serifItems : defaultItems

  const content = (
    <span className="flex items-center gap-10 pr-10">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-10 whitespace-nowrap">
          <span>{item}</span>
          <span className={cn(serif ? "opacity-60" : "text-[#C79398]")}>{serif ? "·" : "✦"}</span>
        </span>
      ))}
    </span>
  )

  return (
    <div
      className={cn(
        "overflow-hidden border-y select-none",
        serif
          ? "py-4 border-[var(--border)] bg-[var(--background)] font-display text-2xl tracking-[0.12em] text-[#C9B4B0]"
          : "py-3 text-[11px] uppercase tracking-[0.22em]",
        !serif && accent
          ? "bg-dralena-accent-soft text-[#7A4B50] border-[#E3D0CC]"
          : !serif && "bg-[var(--surface)] border-[var(--border)]",
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
