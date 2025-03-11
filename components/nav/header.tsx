"use client";

import React from "react";
import Link from "next/link";
import { Container } from "../layout/container";
import { cn } from "../../lib/utils";
import { tinaField } from "tinacms/dist/react";
import { Icon } from "../icon";
import NavItems from "./nav-items";
import { useLayout } from "../layout/layout-context";
import { ThemeToggle } from "../ui/theme-toggle";

const headerColor = {
  default:
    "text-[hsl(var(--foreground))] from-[hsl(var(--background)/0.8)] to-[hsl(var(--background))] transition-colors duration-200",
  primary: {
    blue: "text-white from-blue-300 to-blue-500",
    teal: "text-white from-teal-400 to-teal-500",
    green: "text-white from-green-400 to-green-500",
    red: "text-white from-red-400 to-red-500",
    pink: "text-white from-pink-400 to-pink-500",
    purple: "text-white from-purple-400 to-purple-500",
    orange: "text-white from-orange-400 to-orange-500",
    yellow: "text-white from-yellow-400 to-yellow-500",
  },
};

export default function Header() {
  const layoutData = useLayout();
  const globalSettings = layoutData?.globalSettings || { header: undefined };
  const theme = layoutData?.theme || { color: "blue", darkMode: "" };
  const header = globalSettings.header || { 
    color: "default", 
    icon: { name: "", color: "", style: "" }, 
    name: "",
    nav: []
  };
console.log(globalSettings)
  const headerColorCss =
    header.color === "primary" && theme.color
      ? headerColor.primary[theme.color as keyof typeof headerColor.primary]
      : headerColor.default;

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-b ${headerColorCss}`}
    >
      <Container size="custom" className="py-0 relative z-10 max-w-8xl">
        <div className="flex flex-wrap items-center justify-between lg:gap-6">
          <h4 className="select-none text-lg font-bold tracking-tight lg:my-4 mt-4 transition duration-150 ease-out transform">
            <Link
              href="/"
              className="flex gap-1 items-center whitespace-nowrap tracking-[.002em] hover:text-[hsl(var(--primary))] transition-colors duration-200"
            >
              <Icon
                tinaField={header.icon ? tinaField(header, "icon") : ""}
                parentColor={header.color || ""}
                data={{
                  name: header.icon?.name || "",
                  color: header.icon?.color || "",
                  style: header.icon?.style || "",
                }}
              />{" "}
              <span data-tina-field={tinaField(header, "name")}>
                {header.name}
              </span>
            </Link>
          </h4>
          <div className="flex items-center gap-4">
            <NavItems navs={header.nav} />
            <ThemeToggle />
          </div>
        </div>
        <div
          className={cn(
            `absolute h-1 bg-gradient-to-r from-transparent`,
            theme.darkMode === "primary"
              ? `via-white`
              : `via-[hsl(var(--foreground)/0.2)] dark:via-[hsl(var(--foreground)/0.1)]`,
            "to-transparent bottom-0 left-4 right-4 -z-1 opacity-5 transition-colors duration-200"
          )}
        />
      </Container>
    </div>
  );
}
