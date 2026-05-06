import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest px-2 py-0.5",
  {
    variants: {
      variant: {
        default: "bg-[var(--border)] text-[var(--foreground)]",
        neon: "bg-kult-neon text-kult-bg",
        fire: "bg-kult-fire text-white",
        outline: "border border-current text-[var(--foreground)]",
        muted: "text-[var(--muted)] border border-[var(--border)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />
}
