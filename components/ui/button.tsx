import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useLayout } from "@/components/layout/layout-context"

// Theme-based color variants lookup
const themeColorStyles: Record<string, string> = {
  blue: "bg-blue-500 text-white hover:bg-blue-600",
  teal: "bg-teal-500 text-white hover:bg-teal-600",
  green: "bg-green-500 text-white hover:bg-green-600",
  red: "bg-red-500 text-white hover:bg-red-600",
  pink: "bg-pink-500 text-white hover:bg-pink-600",
  purple: "bg-purple-500 text-white hover:bg-purple-600",
  orange: "bg-orange-500 text-white hover:bg-orange-600",
  yellow: "bg-yellow-500 text-white hover:bg-yellow-600"
}

// Define buttonVariants for backward compatibility and direct color usage
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary)/0.9)]",
        destructive: "bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] hover:bg-[hsl(var(--destructive)/0.9)]",
        outline: "border border-[hsl(var(--input))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]",
        secondary: "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--secondary)/0.8)]",
        ghost: "hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]",
        link: "text-[hsl(var(--primary))] underline-offset-4 hover:underline",
        blue: "bg-blue-500 text-white hover:bg-blue-600",
        teal: "bg-teal-500 text-white hover:bg-teal-600",
        green: "bg-green-500 text-white hover:bg-green-600",
        red: "bg-red-500 text-white hover:bg-red-600",
        pink: "bg-pink-500 text-white hover:bg-pink-600",
        purple: "bg-purple-500 text-white hover:bg-purple-600",
        orange: "bg-orange-500 text-white hover:bg-orange-600",
        yellow: "bg-yellow-500 text-white hover:bg-yellow-600"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 
           'blue' | 'teal' | 'green' | 'red' | 'pink' | 'purple' | 'orange' | 'yellow'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  useThemeColor?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'default', 
    asChild = false, 
    useThemeColor = true, // Default to true so buttons automatically use theme color
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    const { theme } = useLayout()
    
    // Directly use the theme color if default variant and useThemeColor is true
    const effectiveVariant = React.useMemo(() => {
      if (useThemeColor && variant === 'default' && theme?.color) {
        return theme.color; // Use the theme color as the variant
      }
      return variant;
    }, [variant, useThemeColor, theme?.color]);
    
    // For debugging
    React.useEffect(() => {
      console.log('Current theme color:', theme?.color);
      console.log('Effective variant:', effectiveVariant);
      console.log('Button class:', buttonVariants({ variant: effectiveVariant as any, size }));
    }, [theme?.color, effectiveVariant, size]);
    
    return (
      <Comp
        className={cn(
          buttonVariants({ 
            variant: effectiveVariant as any, 
            size 
          }),
          // Add explicit theme color classes for extra specificity if needed
          useThemeColor && variant === 'default' && theme?.color && themeColorStyles[theme.color],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
