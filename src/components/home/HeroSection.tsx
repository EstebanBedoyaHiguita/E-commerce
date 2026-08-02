"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden -mt-16 md:-mt-20">
      {/* Background image */}
      <div className="absolute inset-0 bg-dralena-ink">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.pexels.com/photos/26761370/pexels-photo-26761370.jpeg?auto=compress&cs=tinysrgb&w=1800"
          alt=""
          className="h-full w-full object-cover object-[60%_45%]"
        />
        {/* Velo oscuro: la foto es cálida y con mucho detalle, el texto va en claro sobre él */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2A2320]/90 via-[#2A2320]/55 to-[#2A2320]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2A2320]/70 via-transparent to-[#2A2320]/35" />
        <div className="absolute inset-x-0 bottom-0 h-1/6 bg-gradient-to-t from-[var(--background)] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full container mx-auto px-4 md:px-8 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-[#E8C3C8] text-[11px] uppercase tracking-[0.26em] mb-6"
          >
            Nueva colección · Flor de Loto
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-display text-[clamp(3.5rem,7vw,5.5rem)] font-light leading-[0.95] tracking-tight text-[#FBF7F5] [text-shadow:0_2px_28px_rgba(30,22,20,0.45)]"
          >
            Resalta la
            <br />
            <em className="italic text-[#F0BFC6]">magia</em> que
            <br />
            hay en ti
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-[#FBF7F5]/85 text-base md:text-[17px] leading-relaxed mt-7 max-w-md font-body [text-shadow:0_1px_16px_rgba(30,22,20,0.5)]"
          >
            Encaje, tul y satín diseñados y confeccionados en Colombia. Piezas que se sienten tan
            bien como se ven.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 mt-10"
          >
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center h-14 px-8 bg-[#FBF7F5] text-dralena-ink text-[12.5px] uppercase tracking-[0.16em] font-medium hover:bg-dralena-accent hover:text-[#FBF7F5] transition-all duration-300"
            >
              Ver la colección
            </Link>
            <Link
              href="/tallas"
              className="inline-flex items-center justify-center h-14 px-8 border border-[#FBF7F5]/60 text-[#FBF7F5] text-[12.5px] uppercase tracking-[0.16em] font-medium hover:bg-[#FBF7F5] hover:text-dralena-ink transition-all duration-300"
            >
              Encuentra tu talla
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="absolute bottom-10 right-8 hidden md:flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.28em] text-[#FBF7F5]/70">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="h-9 w-px bg-gradient-to-b from-[#FBF7F5]/80 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  )
}
