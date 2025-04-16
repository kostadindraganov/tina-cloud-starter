"use client";

import React from "react";
import { useAnimation } from "../layout/animation-context";
import { cn } from "@/lib/utils";

interface AnimatedTitleProps {
  className?: string;
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  animated?: boolean;
}

export function AnimatedTitle({ 
  className, 
  children, 
  as: Component = "h2",
  animated = false
}: AnimatedTitleProps) {
  const { isAnimated } = useAnimation();
  
  return (
    <Component 
      className={cn(
        className,
        isAnimated(animated) ? "position-banner-title" : ""
      )}
    >
      {children}
    </Component>
  );
} 