import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full border border-transparent px-6 py-2.5 text-sm font-semibold tracking-tight text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60 shadow-[0_18px_38px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 hover:shadow-[0_24px_48px_rgba(0,0,0,0.45)] active:translate-y-0 active:shadow-[0_14px_30px_rgba(0,0,0,0.55)] before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-white/20 before:via-transparent before:to-white/20 before:opacity-0 before:transition-opacity before:duration-300 before:content-[''] group-hover:before:opacity-100 after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:border after:border-[var(--button-outline)] after:opacity-70 after:content-[''] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-white/20 bg-gradient-to-r from-primary via-primary/90 to-primary/70 text-primary-foreground",
        destructive:
          "border-destructive-border bg-gradient-to-r from-destructive via-destructive/90 to-destructive/80 text-destructive-foreground",
        outline:
          "border-white/30 bg-transparent text-white/80 hover:bg-white/5 hover:text-white",
        secondary:
          "border-secondary-border bg-gradient-to-r from-secondary/60 via-secondary to-secondary/80 text-secondary-foreground",
        ghost:
          "border-transparent bg-transparent text-white/70 shadow-none hover:bg-white/5 hover:text-white",
      },
      size: {
        default: "min-h-11",
        sm: "min-h-9 px-4 py-2 text-xs",
        lg: "min-h-12 px-8 text-base",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
