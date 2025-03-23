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
    <ul className="flex gap-6 sm:gap-8 lg:gap-10 tracking-[.002em] -mx-4">
      {navs.map((item) => {
        return (
          <li
            key={item.href}
            className={
              currentPath === `/${item.href}`
                ? activeItemClasses[theme!.color!]
                : ""
            }
          >
            <Link
              data-tina-field={tinaField(item, "label")}
              href={`/${item.href}`}
              className={`relative select-none	text-base inline-block tracking-wide transition duration-150 ease-out hover:opacity-100 py-8 px-4`}
            >
              {item.label}
              {currentPath === `/${item.href}` && (
                <NavActive
                  backgroundColor={activeBackgroundClasses[theme!.color!]}
                />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
