import { cn } from "@/lib/utils"
import * as React from "react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)

    const handleFocus = () => {
      setIsFocused(true)
    }

    const handleBlur = () => {
      setIsFocused(false)
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-[#CDDFE9] bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006A86] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-1",
          className
        )}
        ref={ref}
        style={{
          boxShadow: isFocused
            ? "0px 0px 0px 2px rgba(0, 106, 134, 0.25)"
            : "none",
          border: isFocused ? "1px solid #006A86" : "1px solid #CDDFE9"
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }
