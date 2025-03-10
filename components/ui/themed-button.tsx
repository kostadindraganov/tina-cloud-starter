import React, { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface ThemedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  icon?: ReactNode
  iconPosition?: "left" | "right"
  asChild?: boolean
}

export function ThemedButton({
  children,
  variant = "default",
  className,
  icon,
  iconPosition = "left",
  ...props
}: ThemedButtonProps) {
  const customClasses = {
    success: "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] hover:bg-[hsl(var(--success))]/90",
    warning: "bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))] hover:bg-[hsl(var(--warning))]/90",
    info: "bg-[hsl(var(--info))] text-[hsl(var(--info-foreground))] hover:bg-[hsl(var(--info))]/90",
  }

  // We're using color utility classes instead of variant prop for custom variants
  const getCustomClass = () => {
    switch (props["data-variant"]) {
      case "success":
        return customClasses.success
      case "warning":
        return customClasses.warning
      case "info":
        return customClasses.info
      default:
        return ""
    }
  }

  return (
    <Button
      variant={variant}
      className={cn(
        "transition-all duration-300 font-medium",
        getCustomClass(),
        className
      )}
      {...props}
    >
      {icon && iconPosition === "left" && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === "right" && (
        <span className="ml-2">{icon}</span>
      )}
    </Button>
  )
}

export function GradientButton({
  children,
  className,
  ...props
}: ThemedButtonProps) {
  return (
    <Button
      variant="default"
      className={cn(
        "relative overflow-hidden bg-primary text-primary-foreground",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary before:to-[hsl(var(--info))] before:hover:opacity-100 before:opacity-0 before:transition-opacity",
        "after:absolute after:inset-0 after:bg-gradient-to-r after:from-primary after:to-[hsl(var(--info))] after:blur-xl after:hover:opacity-100 after:opacity-0 after:transition-opacity",
        "transition-all duration-300",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </Button>
  )
}

export function FloatingButton({
  children,
  className,
  ...props
}: ThemedButtonProps) {
  return (
    <Button
      variant="default"
      className={cn(
        "rounded-full shadow-lg transition-all duration-300",
        "bg-primary text-primary-foreground",
        "hover:shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}

export function GlassButton({
  children,
  className,
  ...props
}: ThemedButtonProps) {
  return (
    <Button
      variant="outline"
      className={cn(
        "glass-effect border border-white/10 text-[hsl(var(--foreground))]",
        "hover:bg-[hsl(var(--background)/0.9)] hover:border-white/20",
        "transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
} 