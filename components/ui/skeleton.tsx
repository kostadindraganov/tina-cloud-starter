import * as React from "react"
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-[hsl(var(--muted)/0.7)] before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-[hsl(var(--background)/0.4)] before:to-transparent transition-colors duration-200",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
