import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-body font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dralena-accent disabled:pointer-events-none disabled:opacity-40 select-none",
  {
    variants: {
      variant: {
        primary: "bg-dralena-ink text-[var(--background)] hover:bg-dralena-accent active:scale-[0.98]",
        secondary:
          "bg-transparent border border-[#C9B4B0] text-dralena-ink hover:border-dralena-ink active:scale-[0.98]",
        ghost: "bg-transparent text-dralena-ink hover:text-dralena-accent active:scale-[0.98]",
        fire: "bg-dralena-fire text-white hover:brightness-110 active:scale-[0.98]",
        dark: "bg-[var(--surface)] border border-[var(--border)] text-dralena-ink hover:border-dralena-accent active:scale-[0.98]",
      },
      size: {
        sm: "h-9 px-4 text-[11px] tracking-[0.16em] uppercase",
        md: "h-11 px-6 text-xs tracking-[0.16em] uppercase",
        lg: "h-14 px-8 text-[12.5px] tracking-[0.16em] uppercase",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)
