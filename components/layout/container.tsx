import React from "react";
import { cn } from "../../lib/utils";

export const Container = ({
  children,
  className = "",
  ...props
}) => {
  const verticalPadding = {
    custom: "py-0",
    small: "py-8",
    medium: "py-12",
    large: "py-24",
    default: "py-12",
  };
  const widthClass = {
    small: "max-w-4xl px-6 sm:px-8",
    medium: "max-w-5xl px-6 sm:px-8",
    large: "max-w-7xl px-6 sm:px-8",
    custom: "",
  };

  return (
    <div
      className={cn(
        widthClass[props.size || 'large'],
        `mx-auto`,
        verticalPadding[props.size || 'medium'],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
