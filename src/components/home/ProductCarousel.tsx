"use client"

import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { useCallback } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react"
import { ProductCard } from "./ProductCard"
import { ScrollReveal } from "@/components/shared/ScrollReveal"
import type { Product } from "@/types"

interface ProductCarouselProps {
  products: Product[]
  title?: string
}

export function ProductCarousel({ products, title = "NUEVOS INGRESOS" }: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  )

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  if (products.length === 0) return null

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="font-display text-5xl md:text-7xl tracking-widest">{title}</h2>
            <div className="flex items-center gap-4">
              <Link
                href="/catalogo"
                className="text-xs uppercase tracking-widest hover:text-kult-neon transition-colors hidden md:flex items-center gap-1"
                style={{ color: "var(--muted)" }}
              >
                Ver todo <ArrowUpRight className="h-3 w-3" />
              </Link>
              <div className="flex gap-1">
                <button
                  onClick={scrollPrev}
                  className="p-2 border border-[var(--border)] hover:border-kult-neon hover:text-kult-neon transition-colors"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={scrollNext}
                  className="p-2 border border-[var(--border)] hover:border-kult-neon hover:text-kult-neon transition-colors"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-3 md:gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-none w-[48%] sm:w-[33%] md:w-[25%] lg:w-[20%]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
