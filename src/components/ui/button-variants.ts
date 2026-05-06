import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-body font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kult-neon disabled:pointer-events-none disabled:opacity-40 select-none",
  {
    variants: {
      variant: {
        primary: "bg-kult-neon text-kult-bg hover:bg-white active:scale-95",
        secondary: "bg-transparent border border-current text-foreground hover:bg-foreground hover:text-background active:scale-95",
        ghost: "bg-transparent hover:bg-white/10 text-foreground active:scale-95",
        fire: "bg-kult-fire text-white hover:brightness-110 active:scale-95",
        dark: "bg-kult-surface border border-kult-border text-white hover:border-kult-neon active:scale-95",
      },
      size: {
        sm: "h-8 px-4 text-xs tracking-wider uppercase",
        md: "h-11 px-6 text-sm tracking-wider uppercase",
        lg: "h-14 px-8 text-base tracking-widest uppercase",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)
