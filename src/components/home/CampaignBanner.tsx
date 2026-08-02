import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { ScrollReveal } from "@/components/shared/ScrollReveal"
import { buttonVariants } from "@/components/ui/button-variants"

interface CampaignBannerProps {
  image?: string
  tagline?: string
  title?: string
  subtitle?: string
  ctaText?: string
  ctaHref?: string
}

export function CampaignBanner({
  image = "https://images.pexels.com/photos/5253436/pexels-photo-5253436.jpeg?auto=compress&cs=tinysrgb&w=1800",
  tagline = "Tallas de la 32A a la 42DD",
  title = "Para todos los cuerpos",
  subtitle = "Probamos cada pieza en cuerpos reales antes de lanzarla. Encaje suave que no pica y varillas que no marcan.",
  ctaText = "Encuentra tu talla",
  ctaHref = "/tallas",
}: CampaignBannerProps) {
  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      <Image
        src={image}
        alt="Mujeres de distintos cuerpos en lencería DRALENA"
        fill
        className="object-cover object-center"
        priority={false}
      />
      {/* Velo: la foto es clara y el texto va centrado encima, necesita fondo parejo sin apagarla */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#2A2320]/75 via-[#2A2320]/45 to-[#2A2320]/35" />

      <div className="relative z-10 h-full container mx-auto px-4 md:px-8 flex flex-col items-center justify-center text-center">
        <ScrollReveal delay={0.1}>
          <p className="text-[#F0BFC6] text-[11px] uppercase tracking-[0.26em] mb-5">{tagline}</p>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <h2 className="font-display text-[clamp(3rem,7vw,4.75rem)] font-light leading-none text-[var(--background)]">
            {title}
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.35}>
          <p className="text-[var(--background)]/78 mt-5 max-w-md text-base leading-relaxed">
            {subtitle}
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.45}>
          <div className="mt-8">
            <Link
              href={ctaHref}
              className={
                buttonVariants({ size: "lg" }) +
                " inline-flex items-center gap-2 !bg-[var(--background)] !text-dralena-ink hover:!bg-dralena-accent-soft"
              }
            >
              {ctaText} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
