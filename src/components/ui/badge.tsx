import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 text-[11.5px] uppercase tracking-[0.12em] px-3 py-1.5",
  {
    variants: {
      variant: {
        default: "bg-[var(--surface)] text-[var(--foreground)]",
        neon: "bg-dralena-accent text-white",
        fire: "bg-dralena-fire text-white",
        outline: "border border-[#E0D0CC] text-[#5c524d]",
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
