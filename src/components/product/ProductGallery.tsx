"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ProductGalleryProps {
  images: string[]
  name: string
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [zoom, setZoom] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const containerRef = useRef<HTMLDivElement>(null)
  const safeImages = images.length > 0 ? images : ["/placeholder.jpg"]

  const prev = () => setActiveIdx((i) => (i - 1 + safeImages.length) % safeImages.length)
  const next = () => setActiveIdx((i) => (i + 1) % safeImages.length)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }

  return (
    <div className="flex flex-col md:flex-row gap-3">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-y-auto md:max-h-[600px]">
        {safeImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={`relative flex-shrink-0 h-16 w-14 md:h-20 md:w-16 overflow-hidden border-2 transition-all ${
              i === activeIdx ? "border-kult-neon" : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover object-top" />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div
        ref={containerRef}
        className="relative flex-1 aspect-[4/5] overflow-hidden bg-[var(--surface)] order-1 md:order-2 cursor-zoom-in"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={handleMouseMove}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={safeImages[activeIdx]}
              alt={`${name} - imagen ${activeIdx + 1}`}
              fill
              className="object-cover object-top transition-transform duration-200"
              style={zoom ? {
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transform: "scale(2.2)",
              } : {}}
              priority={activeIdx === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Nav arrows — hidden when zooming */}
        {safeImages.length > 1 && !zoom && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white hover:bg-kult-neon hover:text-kult-bg transition-colors z-10"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white hover:bg-kult-neon hover:text-kult-bg transition-colors z-10"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {!zoom && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 tracking-widest">
            {activeIdx + 1}/{safeImages.length}
          </div>
        )}
      </div>
    </div>
  )
}
