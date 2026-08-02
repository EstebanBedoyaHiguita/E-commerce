import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { ProductCard } from "./ProductCard"
import { ScrollReveal } from "@/components/shared/ScrollReveal"
import type { Product } from "@/types"

interface NewArrivalsGridProps {
  products: Product[]
}

export function NewArrivalsGrid({ products }: NewArrivalsGridProps) {
  if (products.length === 0) return null

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-9">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#B98A8F] mb-2.5">
                Recién llegado
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-light leading-none">
                Novedades
              </h2>
            </div>
            <Link
              href="/catalogo?orden=newest"
              className="text-xs uppercase tracking-[0.14em] border-b border-[#C9B4B0] pb-1 hover:text-dralena-accent hover:border-dralena-accent transition-colors flex items-center gap-1"
              style={{ color: "#5c524d" }}
            >
              Ver todo <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {products.map((product, i) => (
            <ScrollReveal key={product.id} delay={i * 0.08}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
