"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, X, ChevronDown } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { GlassButton } from "./themed-button"

interface NavItem {
  title: string
  href: string
  description?: string
  children?: NavItem[]
}

const navItems: NavItem[] = [
  { 
    title: "Home", 
    href: "/" 
  },
  { 
    title: "Theme", 
    href: "/theme-showcase",
    description: "View all theme components and styles" 
  },
  { 
    title: "Features", 
    href: "#",
    children: [
      { title: "Feature 1", href: "#feature-1" },
      { title: "Feature 2", href: "#feature-2" },
      { title: "Feature 3", href: "#feature-3" },
    ]
  },
  { 
    title: "About", 
    href: "#" 
  },
  { 
    title: "Contact", 
    href: "#" 
  },
]

export function ThemeNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  const toggleDropdown = (title: string) => {
    setOpenDropdown(openDropdown === title ? null : title)
  }

  const isActive = (href: string) => {
    return pathname === href
  }

  return (
    <nav className="glass-effect sticky top-0 z-40 w-full border-b border-[hsl(var(--border)/0.2)]">
      <div className="layout-container">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold gradient-text">TinaApp</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navItems.map((item) => (
              <div key={item.title} className="relative">
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(item.title)}
                      className={cn(
                        "nav-link flex items-center gap-1",
                        openDropdown === item.title && "nav-link-active"
                      )}
                    >
                      {item.title}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {openDropdown === item.title && (
                      <div className="absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] overflow-hidden">
                        <div className="py-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.title}
                              href={child.href}
                              className="block px-4 py-2 text-sm hover:bg-[hsl(var(--accent))] transition-colors"
                            >
                              {child.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "nav-link",
                      isActive(item.href) && "nav-link-active"
                    )}
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="hidden md:block">
              <GlassButton>Sign In</GlassButton>
            </div>
            <button
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-[hsl(var(--background))] border-t border-[hsl(var(--border))]">
          <div className="space-y-1 px-4 py-3">
            {navItems.map((item) => (
              <div key={item.title}>
                {item.children ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => toggleDropdown(item.title)}
                      className={cn(
                        "nav-link w-full flex items-center justify-between",
                        openDropdown === item.title && "nav-link-active"
                      )}
                    >
                      {item.title}
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform",
                        openDropdown === item.title && "rotate-180"
                      )} />
                    </button>
                    {openDropdown === item.title && (
                      <div className="ml-4 space-y-1 border-l-2 border-[hsl(var(--border))] pl-4">
                        {item.children.map((child) => (
                          <Link
                            key={child.title}
                            href={child.href}
                            className="nav-link block"
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "nav-link block",
                      isActive(item.href) && "nav-link-active"
                    )}
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4">
              <GlassButton className="w-full">Sign In</GlassButton>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
} 