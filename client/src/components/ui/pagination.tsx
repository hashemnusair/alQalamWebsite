import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { ButtonProps } from "@/components/ui/button"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-2", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">

const PaginationLink = ({
  className,
  isActive,
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      // Base styles for all page links
      "inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 select-none",
      // Default (inactive) state - readable on light backgrounds
      "border border-slate-200 bg-white text-slate-700 shadow-sm",
      // Hover state
      "hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 hover:shadow-md",
      // Active/current page state - dark, bold contrast
      isActive && "border-slate-900 bg-slate-900 text-white shadow-lg hover:bg-slate-800 hover:text-white hover:border-slate-800",
      // Focus state
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <a
    aria-label="Go to previous page"
    className={cn(
      "inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-all duration-200 select-none",
      "border border-slate-200 bg-white text-slate-700 shadow-sm",
      "hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 hover:shadow-md",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
      className
    )}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </a>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <a
    aria-label="Go to next page"
    className={cn(
      "inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-all duration-200 select-none",
      "border border-slate-200 bg-white text-slate-700 shadow-sm",
      "hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 hover:shadow-md",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
      className
    )}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </a>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-10 w-10 items-center justify-center text-slate-500", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
