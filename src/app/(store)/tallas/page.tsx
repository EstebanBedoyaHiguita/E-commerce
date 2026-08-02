import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { ScrollReveal } from "@/components/shared/ScrollReveal"

export const metadata: Metadata = {
  title: "Guía de tallas",
  description:
    "Cómo medirte para encontrar tu talla en DRALENA: banda y copa para brasier, y talla numérica del 6 al 16.",
}

// ⚠️ Medidas de referencia — ajústalas a los patrones reales de DRALENA
const bandRows = [
  ["32", "68-72"],
  ["34", "73-77"],
  ["36", "78-82"],
  ["38", "83-87"],
  ["40", "88-92"],
  ["42", "93-97"],
]

const cupRows = [
  ["A", "12 cm"],
  ["B", "14 cm"],
  ["C", "16 cm"],
  ["D", "18 cm"],
  ["DD", "20 cm"],
]

const numberRows = [
  ["6", "82-86", "62-66", "88-93"],
  ["8", "87-90", "67-70", "94-97"],
  ["10", "91-94", "71-75", "98-102"],
  ["12", "95-100", "76-81", "103-108"],
  ["14", "101-106", "82-88", "109-115"],
  ["16", "107-112", "89-95", "116-122"],
]

const steps = [
  {
    title: "Contorno de banda",
    desc: "Mide justo debajo del busto, con la cinta ajustada y paralela al piso. Ese número te da la banda: 32, 34, 36…",
  },
  {
    title: "Contorno de busto",
    desc: "Mide sobre la parte más amplia del busto, sin apretar. La diferencia con la banda define la copa.",
  },
  {
    title: "Cintura y cadera",
    desc: "Cintura en la parte más estrecha del torso y cadera en la parte más ancha. Con eso eliges la talla numérica.",
  },
]

function Table({
  headers,
  rows,
}: {
  headers: string[]
  rows: string[][]
}) {
  return (
    <div className="overflow-x-auto border border-[var(--border)]">
      <table className="w-full text-sm border-collapse min-w-[420px]">
        <thead>
          <tr className="bg-[var(--surface)]">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left py-3.5 px-5 text-[10.5px] uppercase tracking-[0.16em] font-semibold"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-t border-[var(--border)]">
              {row.map((cell, i) => (
                <td
                  key={i}
                  className={
                    i === 0
                      ? "py-3.5 px-5 font-medium"
                      : "py-3.5 px-5 text-[#7d746e]"
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function TallasPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-14 max-w-4xl">
      <ScrollReveal>
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#B98A8F] mb-3">
          Inicio / Guía de tallas
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-light leading-none">
          Encuentra tu talla
        </h1>
        <p className="mt-5 text-lg leading-relaxed max-w-2xl" style={{ color: "#6b625c" }}>
          Toma tus medidas con una cinta métrica sobre la piel, sin ropa gruesa. Si quedas entre dos
          tallas, escribe por WhatsApp y te ayudamos a elegir.
        </p>
      </ScrollReveal>

      {/* Cómo medirse */}
      <ScrollReveal delay={0.1}>
        <section className="mt-14">
          <h2 className="font-display text-3xl md:text-4xl font-light mb-7">Cómo medirte</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={s.title} className="flex flex-col gap-3">
                <div className="h-11 w-11 rounded-full border border-[#C9A9AC] grid place-items-center text-dralena-accent text-sm">
                  0{i + 1}
                </div>
                <h3 className="font-display text-2xl">{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#7d746e" }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Brasier */}
      <ScrollReveal delay={0.1}>
        <section className="mt-16">
          <h2 className="font-display text-3xl md:text-4xl font-light mb-6">Talla de brasier</h2>
          <p className="text-sm mb-5" style={{ color: "#7d746e" }}>
            Tu talla se arma con dos datos: la banda (el número) y la copa (la letra). Por ejemplo,
            banda 34 con copa B es una 34B.
          </p>
          <Table headers={["Banda", "Contorno bajo el busto (cm)"]} rows={bandRows} />
          <h3 className="font-display text-2xl mt-10 mb-4">Copa</h3>
          <p className="text-sm mb-5" style={{ color: "#7d746e" }}>
            Resta el contorno de banda al contorno de busto. Esa diferencia es tu copa:
          </p>
          <Table headers={["Copa", "Diferencia busto − banda"]} rows={cupRows} />
        </section>
      </ScrollReveal>

      {/* Numérica */}
      <ScrollReveal delay={0.1}>
        <section className="mt-16">
          <h2 className="font-display text-3xl md:text-4xl font-light mb-6">Talla numérica</h2>
          <p className="text-sm mb-5" style={{ color: "#7d746e" }}>
            Los conjuntos, panties, bodies y tops se manejan en talla numérica:
          </p>
          <Table
            headers={["Talla", "Busto (cm)", "Cintura (cm)", "Cadera (cm)"]}
            rows={numberRows}
          />
          <p className="text-xs mt-4" style={{ color: "#9c908a" }}>
            Si estás entre dos tallas, te recomendamos la mayor. Escríbenos por WhatsApp y te
            ayudamos a elegir.
          </p>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal delay={0.1}>
        <section className="mt-16 border-t border-[var(--border)] pt-12 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-light mb-4">
            ¿Sigues con dudas?
          </h2>
          <p className="text-sm mb-6" style={{ color: "#7d746e" }}>
            Te asesoramos por WhatsApp antes de que compres.
          </p>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 text-[12.5px] uppercase tracking-[0.16em] text-dralena-accent border-b border-[#DCC1C4] pb-1.5 hover:border-dralena-accent transition-colors"
          >
            Explorar el catálogo <ArrowUpRight className="h-4 w-4" />
          </Link>
        </section>
      </ScrollReveal>
    </div>
  )
}
