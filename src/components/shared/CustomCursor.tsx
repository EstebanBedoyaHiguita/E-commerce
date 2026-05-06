"use client"

import { useEffect, useRef } from "react"

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const follower = followerRef.current
    if (!cursor || !follower) return

    let mouseX = 0
    let mouseY = 0
    let followerX = 0
    let followerY = 0

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`
    }

    const onEnterLink = () => {
      cursor.style.width = "40px"
      cursor.style.height = "40px"
      cursor.style.backgroundColor = "#e8ff00"
      cursor.style.mixBlendMode = "difference"
    }

    const onLeaveLink = () => {
      cursor.style.width = "8px"
      cursor.style.height = "8px"
      cursor.style.backgroundColor = "#e8ff00"
      cursor.style.mixBlendMode = "normal"
    }

    window.addEventListener("mousemove", onMove)

    const links = document.querySelectorAll("a, button, [data-cursor-grow]")
    links.forEach((el) => {
      el.addEventListener("mouseenter", onEnterLink)
      el.addEventListener("mouseleave", onLeaveLink)
    })

    let rafId: number
    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.1
      followerY += (mouseY - followerY) * 0.1
      follower.style.transform = `translate(${followerX - 16}px, ${followerY - 16}px)`
      rafId = requestAnimationFrame(animateFollower)
    }
    rafId = requestAnimationFrame(animateFollower)

    return () => {
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(rafId)
      links.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterLink)
        el.removeEventListener("mouseleave", onLeaveLink)
      })
    }
  }, [])

  return (
    <>
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-2 w-2 rounded-full bg-kult-neon transition-all duration-100 hidden lg:block"
        style={{ willChange: "transform" }}
      />
      <div
        ref={followerRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] h-8 w-8 rounded-full border border-kult-neon/40 hidden lg:block"
        style={{ willChange: "transform" }}
      />
    </>
  )
}
