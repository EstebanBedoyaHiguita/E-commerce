import { forwardRef } from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-")

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
            style={{ color: "var(--muted)" }}
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "w-full h-12 px-4 bg-transparent border font-body text-sm",
            "placeholder:text-[var(--muted)] text-[var(--foreground)]",
            "focus:outline-none focus:border-kult-neon transition-colors duration-200",
            error
              ? "border-kult-fire"
              : "border-[var(--border)] hover:border-[var(--muted)]",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-kult-fire">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs" style={{ color: "var(--muted)" }}>{hint}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
