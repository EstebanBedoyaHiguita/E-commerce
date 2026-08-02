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
            className="text-[10.5px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: "#5c524d" }}
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "w-full h-12 px-4 bg-white border font-body text-sm",
            "placeholder:text-[#B0A49E] text-[var(--foreground)]",
            "focus:outline-none focus:border-dralena-accent transition-colors duration-200",
            error
              ? "border-dralena-fire"
              : "border-[#E0D0CC] hover:border-[var(--muted)]",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-dralena-fire">{error}</p>
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
