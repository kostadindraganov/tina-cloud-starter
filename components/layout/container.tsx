import React from "react";
import { cn } from "../../lib/utils";

export const Container = ({
  children,
  className = "",
  size = "large",
  verticalPadding = "medium",
  ...props
}) => {
  const verticalPaddingClass = {
    custom: "py-0",
    small: "py-6",
    medium: "py-8",
    large: "py-24",
    default: "py-12",
  };
  const widthClass = {
    small: "max-w-4xl px-6 sm:px-8",
    medium: "max-w-5xl px-6 sm:px-9",
    large: "max-w-7xl px-6 sm:px-10",
    custom: "w-full px-6 sm:px-10",
  };

  return (
    <div
      className={cn(
        widthClass[size],
        `mx-auto`,
        verticalPaddingClass[verticalPadding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
