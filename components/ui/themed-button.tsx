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
    success: "bg-green-500 text-white hover:bg-green-600",
    warning: "bg-amber-500 text-white hover:bg-amber-600",
    info: "bg-blue-500 text-white hover:bg-blue-600",
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
        "relative overflow-hidden bg-blue-600 text-white",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-600 before:to-cyan-500 before:hover:opacity-100 before:opacity-0 before:transition-opacity",
        "after:absolute after:inset-0 after:bg-gradient-to-r after:from-blue-600 after:to-cyan-500 after:blur-xl after:hover:opacity-100 after:opacity-0 after:transition-opacity",
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
        "rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 bg-blue-600 text-white",
        "transition-all duration-300 hover:bg-blue-700",
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
        "backdrop-blur-md bg-white/80 border-gray-200/30",
        "text-gray-900 hover:bg-white",
        "shadow-sm hover:shadow transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
} 