"use client";
import { usePathname } from "next/navigation";
import React from "react";
import { tinaField } from "tinacms/dist/react";
import Link from "next/link";
import { useLayout } from "../layout/layout-context";
import { cn } from "../../lib/utils";

export default function NavItems({ navs }: { navs: any }) {
  const currentPath = usePathname();
  const layoutData = useLayout();
  const globalSettings = layoutData?.globalSettings || {};
  const themeColor = globalSettings?.theme?.color || layoutData?.theme?.color || "blue";
  
  if (!navs || navs.length === 0) {
    return null;
  }
  
  // Generate theme-specific classes based on themeColor
  const activeTextColor = `text-${themeColor}-700`;
  const activeBgColor = `bg-${themeColor}-50`;
  const activeBarColor = `bg-${themeColor}-500`;
  const hoverTextColor = `hover:text-${themeColor}-600`;
  const hoverBgColor = `hover:bg-${themeColor}-50`;
  
  return (
    <nav className="flex items-center">
      <ul className="flex items-center gap-1 md:gap-2">
        {navs.map((item) => {
          const isActive = currentPath === `/${item.href}`;
          return (
            <li
              key={item.href}
              className="relative"
            >
              <Link
                data-tina-field={tinaField(item, "label")}
                href={`/${item.href}`}
                className={cn(
                  "relative select-none text-sm md:text-base font-medium rounded-md px-3 py-2 transition-all duration-200",
                  isActive 
                    ? `${activeTextColor} ${activeBgColor}`
                    : `text-gray-700 ${hoverTextColor} ${hoverBgColor}`
                )}
              >
                {item.label}
                {isActive && (
                  <span className={`absolute inset-x-3 -bottom-px h-0.5 ${activeBarColor}`} />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}