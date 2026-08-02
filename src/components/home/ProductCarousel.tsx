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
  eyebrow?: string
}

export function ProductCarousel({
  products,
  title = "Novedades",
  eyebrow = "Recién llegado",
}: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    // El autoplay se reanuda tras arrastrar y solo pausa mientras el cursor está encima
    [Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })]
  )

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  if (products.length === 0) return null

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-9">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#B98A8F] mb-2.5">
                {eyebrow}
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-light leading-none">{title}</h2>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/catalogo"
                className="text-xs uppercase tracking-[0.14em] border-b border-[#C9B4B0] pb-1 hover:text-dralena-accent hover:border-dralena-accent transition-colors hidden md:flex items-center gap-1"
                style={{ color: "#5c524d" }}
              >
                Ver todo <ArrowUpRight className="h-3 w-3" />
              </Link>
              <div className="flex gap-2">
                <button
                  onClick={scrollPrev}
                  className="h-11 w-11 rounded-full border border-[var(--border)] text-dralena-muted grid place-items-center hover:border-dralena-ink hover:text-dralena-ink transition-colors"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={scrollNext}
                  className="h-11 w-11 rounded-full border border-dralena-ink text-dralena-ink grid place-items-center hover:bg-dralena-ink hover:text-[var(--background)] transition-colors"
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
