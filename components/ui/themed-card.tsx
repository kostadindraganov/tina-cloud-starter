import React, { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ThemedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: "default" | "outline" | "glass" | "gradient"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function ThemedCard({
  children,
  variant = "default",
  size = "md",
  className,
  ...props
}: ThemedCardProps) {
  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  }

  const variantClasses = {
    default: "bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow transition-colors duration-300",
    outline: "border border-[hsl(var(--border))] bg-[hsl(var(--background))] transition-colors duration-300",
    glass: "glass-effect border border-[hsl(var(--border)/0.3)] transition-all duration-300",
    gradient: "bg-gradient-to-br from-[hsl(var(--primary)/0.1)] via-[hsl(var(--background))] to-[hsl(var(--secondary)/0.1)] dark:from-[hsl(var(--primary)/0.05)] dark:via-[hsl(var(--background)/0.98)] dark:to-[hsl(var(--background))] transition-colors duration-300",
  }

  return (
    <div
      className={cn(
        "rounded-lg card-hover",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface ThemedCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function ThemedCardHeader({
  className,
  children,
  ...props
}: ThemedCardHeaderProps) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5", className)}
      {...props}
    >
      {children}
    </div>
  )
}

interface ThemedCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string
}

export function ThemedCardTitle({
  className,
  children,
  ...props
}: ThemedCardTitleProps) {
  return (
    <h3
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

interface ThemedCardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string
}

export function ThemedCardDescription({
  className,
  children,
  ...props
}: ThemedCardDescriptionProps) {
  return (
    <p
      className={cn("text-sm text-[hsl(var(--muted-foreground))]", className)}
      {...props}
    >
      {children}
    </p>
  )
}

interface ThemedCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function ThemedCardContent({
  className,
  children,
  ...props
}: ThemedCardContentProps) {
  return (
    <div className={cn("pt-4", className)} {...props}>
      {children}
    </div>
  )
}

interface ThemedCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function ThemedCardFooter({
  className,
  children,
  ...props
}: ThemedCardFooterProps) {
  return (
    <div
      className={cn("flex items-center pt-4", className)}
      {...props}
    >
      {children}
    </div>
  )
} 