import { forwardRef } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-")
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "w-full h-12 px-4 pr-10 bg-[var(--background)] border appearance-none",
              "font-body text-sm text-[var(--foreground)] cursor-pointer",
              "focus:outline-none focus:border-dralena-accent transition-colors duration-200",
              error
                ? "border-dralena-fire"
                : "border-[var(--border)] hover:border-[var(--muted)]",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: "var(--muted)" }}
          />
        </div>
        {error && <p className="text-xs text-dralena-fire">{error}</p>}
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
