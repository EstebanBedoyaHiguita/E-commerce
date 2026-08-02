"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ScrollReveal } from "@/components/shared/ScrollReveal"

interface OfferCountdownProps {
  endsAt: Date | string
  title?: string
  eyebrow?: string
  note?: string
}

const pad = (n: number) => String(n).padStart(2, "0")

export function OfferCountdown({
  endsAt,
  title = "30% en conjuntos seleccionados",
  eyebrow = "Solo esta semana",
  note = "Aplica automáticamente al finalizar tu compra.",
}: OfferCountdownProps) {
  // null en el primer paint (server + hidratación): el server no conoce la hora del cliente
  const [left, setLeft] = useState<number | null>(null)

  useEffect(() => {
    const target = new Date(endsAt).getTime()
    const tick = () => setLeft(Math.max(0, Math.floor((target - Date.now()) / 1000)))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [endsAt])

  const boxes =
    left === null
      ? [
          { value: "--", label: "HORAS" },
          { value: "--", label: "MIN" },
          { value: "--", label: "SEG" },
        ]
      : [
          { value: pad(Math.floor(left / 3600)), label: "HORAS" },
          { value: pad(Math.floor(left / 60) % 60), label: "MIN" },
          { value: pad(left % 60), label: "SEG" },
        ]

  return (
    <ScrollReveal>
      <section className="bg-dralena-ink text-[#F6EFEC]">
        <div className="container mx-auto px-4 md:px-8 py-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
          <div className="flex flex-col gap-2.5">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#C79398]">{eyebrow}</p>
            <h2 className="font-display text-4xl md:text-5xl font-light leading-tight">{title}</h2>
            <p className="text-sm mt-1.5 max-w-md text-[#A89490]">{note}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {boxes.map((b) => (
              <div
                key={b.label}
                className="text-center border border-[#4B3E3A] px-6 py-5 min-w-[82px]"
              >
                <div className="font-display text-4xl leading-none">{b.value}</div>
                <div className="text-[9.5px] tracking-[0.18em] text-[#A89490] mt-1.5">{b.label}</div>
              </div>
            ))}
            <Link
              href="/catalogo?oferta=true"
              className="ml-2 bg-dralena-accent-soft text-dralena-ink px-8 py-5 text-[12.5px] uppercase tracking-[0.16em] hover:bg-white transition-colors"
            >
              Ver ofertas
            </Link>
          </div>
        </div>
      </section>
    </ScrollReveal>
  )
}
