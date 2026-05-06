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
  image = "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=1600&q=80",
  tagline = "Drop Exclusivo",
  title = "DEFINE\nTU\nESTILO.",
  subtitle = "Nuevas piezas de las marcas que marcan tendencia.",
  ctaText = "Explorar Drop",
  ctaHref = "/catalogo",
}: CampaignBannerProps) {
  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      <Image
        src={image}
        alt="Campaña KULT"
        fill
        className="object-cover"
        priority={false}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-kult-bg/90 via-kult-bg/50 to-transparent" />

      <div className="relative z-10 h-full container mx-auto px-4 md:px-8 flex flex-col justify-center">
        <ScrollReveal delay={0.1}>
          <p className="text-kult-neon text-xs uppercase tracking-[0.3em] mb-4 font-semibold">
            {tagline}
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <h2 className="font-display text-[clamp(4rem,10vw,10rem)] leading-none tracking-tight text-white whitespace-pre-line">
            {title}
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.35}>
          <p className="text-white/60 mt-4 max-w-sm text-base">{subtitle}</p>
        </ScrollReveal>
        <ScrollReveal delay={0.45}>
          <div className="mt-8">
            <Link href={ctaHref} className={buttonVariants({ size: "lg" }) + " inline-flex items-center gap-2"}>
              {ctaText} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
