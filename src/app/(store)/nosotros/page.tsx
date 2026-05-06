import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { ScrollReveal } from "@/components/shared/ScrollReveal"

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conoce la historia y misión de KULT, el e-commerce de streetwear multimarca de Colombia.",
}

const valores = [
  { title: "AUTENTICIDAD", desc: "Cubrimos marcas que tienen algo real que decir, no tendencias vacías." },
  { title: "CALIDAD", desc: "Cada pieza pasa por un filtro de calidad antes de llegar a ti." },
  { title: "COMUNIDAD", desc: "KULT es más que ropa — es un punto de encuentro para quienes viven la cultura urbana." },
  { title: "COLOMBIA", desc: "Nacimos acá y pensamos en el mercado local, con envíos rápidos y pagos en COP." },
]

export default function NosotrosPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1600&q=80"
          alt="KULT - Streetwear Multimarca"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-kult-bg via-kult-bg/40 to-transparent" />
        <div className="relative z-10 container mx-auto px-4 md:px-8 pb-16">
          <ScrollReveal>
            <p className="text-kult-neon text-xs uppercase tracking-[0.3em] mb-3 font-semibold">Nuestra historia</p>
            <h1 className="font-display text-6xl md:text-9xl tracking-widest text-white leading-none">KULT</h1>
          </ScrollReveal>
        </div>
      </section>

      {/* Misión */}
      <section className="container mx-auto px-4 md:px-8 py-20 max-w-3xl">
        <ScrollReveal>
          <h2 className="font-display text-4xl md:text-6xl tracking-widest mb-8">QUIÉNES SOMOS</h2>
          <p className="text-lg leading-relaxed mb-6" style={{ color: "var(--muted)" }}>
            KULT nació de una obsesión: hacer accesible lo mejor del streetwear multimarca en Colombia. Cansados de importar piezas con costos absurdos y tiempos de espera eternos, creamos un espacio donde las marcas que importan están a un clic.
          </p>
          <p className="text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
            No vendemos moda — vendemos cultura. Cada marca que encontrarás en KULT fue elegida a mano por su identidad, su historia y lo que representa dentro del mundo urbano.
          </p>
        </ScrollReveal>
      </section>

      {/* Valores */}
      <section className="border-t border-[var(--border)] py-20">
        <div className="container mx-auto px-4 md:px-8">
          <ScrollReveal>
            <h2 className="font-display text-4xl md:text-6xl tracking-widest mb-12">LO QUE NOS MUEVE</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px border border-[var(--border)]">
            {valores.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.1}>
                <div className="p-8 border-[var(--border)]">
                  <p className="text-kult-neon text-xs uppercase tracking-[0.3em] mb-4 font-semibold">0{i + 1}</p>
                  <h3 className="font-display text-2xl tracking-widest mb-3">{v.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <ScrollReveal>
          <h2 className="font-display text-5xl md:text-8xl tracking-widest mb-6">ÚNETE AL MOVIMIENTO</h2>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-widest font-semibold text-kult-neon hover:underline transition-colors"
          >
            Explorar catálogo <ArrowUpRight className="h-4 w-4" />
          </Link>
        </ScrollReveal>
      </section>
    </div>
  )
}
