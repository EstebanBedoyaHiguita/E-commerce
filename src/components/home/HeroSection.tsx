"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowDownRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75
    }
  }, [])

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden -mt-16 md:-mt-20">
      {/* Background image */}
      <div className="absolute inset-0 bg-kult-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1800&q=80"
          alt=""
          className="h-full w-full object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-kult-bg/80 via-kult-bg/40 to-kult-bg/10" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[var(--background)] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full container mx-auto px-4 md:px-8 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="max-w-5xl"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-kult-neon text-xs uppercase tracking-[0.3em] mb-4 font-semibold"
          >
            Nueva Colección 2026
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-display text-[clamp(5rem,14vw,14rem)] leading-none tracking-tight text-white"
          >
            SIN
            <br />
            <span className="text-kult-neon">REGLAS.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-white/60 text-base md:text-lg mt-6 max-w-md font-body"
          >
            Streetwear multimarca. Piezas que definen tu identidad, no que la siguen.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 mt-10"
          >
            <Link href="/catalogo" className={buttonVariants({ size: "lg" })}>Explorar colección</Link>
            <Link href="/catalogo?genero=hombre" className={buttonVariants({ variant: "secondary", size: "lg" })}>Ver hombre</Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ArrowDownRight className="h-5 w-5 text-kult-neon rotate-90" />
          </motion.div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Scroll</span>
        </motion.div>
      </div>
    </section>
  )
}
