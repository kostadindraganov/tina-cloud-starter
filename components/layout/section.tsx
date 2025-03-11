import React from "react";
import { useLayout } from "../layout/layout-context";

export const Section = ({ children, color = "", className = "" }) => {
  const { theme } = useLayout();
  const sectionColor = {
    default:
      "text-gray-800 dark:text-gray-50 bg-gradient-to-tl from-gray-50 dark:from-gray-900 via-transparent to-transparent",
    tint: "text-gray-900 dark:text-gray-100 bg-gradient-to-br from-gray-100 dark:from-gray-1000 to-transparent",
    primary: {
      blue: "text-white bg-blue-500 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700",
      teal: "text-white bg-teal-500 bg-gradient-to-br from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700",
      green:
        "text-white bg-green-600 bg-gradient-to-br from-green-600 to-green-700 dark:from-green-700 dark:to-green-800",
      red: "text-white bg-red-500 bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700",
      pink: "text-white bg-pink-500 bg-gradient-to-br from-pink-500 to-pink-600 dark:from-pink-600 dark:to-pink-700",
      purple:
        "text-white bg-purple-500 bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700",
      orange:
        "text-white bg-orange-500 bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700",
      yellow:
        "text-white bg-yellow-500 bg-gradient-to-br from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700",
    },
  };
  const sectionColorCss =
    color === "primary" && theme?.color
      ? sectionColor.primary[theme.color as keyof typeof sectionColor.primary] || sectionColor.default
      : sectionColor[color as keyof typeof sectionColor]
      ? sectionColor[color as keyof typeof sectionColor]
      : sectionColor.default;

  return (
    <section
      className={`flex-1 relative transition duration-150 ease-out body-font overflow-hidden ${sectionColorCss} ${className}`}
    >
      {children}
    </section>
  );
};
