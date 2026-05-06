import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { ProductCard } from "./ProductCard"
import { ScrollReveal } from "@/components/shared/ScrollReveal"
import type { Product } from "@/types"

interface FeaturedGridProps {
  products: Product[]
}

export function FeaturedGrid({ products }: FeaturedGridProps) {
  if (products.length === 0) return null

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="font-display text-5xl md:text-7xl tracking-widest">DESTACADOS</h2>
            <Link
              href="/catalogo"
              className="text-xs uppercase tracking-widest hover:text-kult-neon transition-colors flex items-center gap-1"
              style={{ color: "var(--muted)" }}
            >
              Ver todo <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
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
