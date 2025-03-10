"use client"

import * as React from "react"
import { Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "./button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="rounded-full w-9 h-9 border-primary/20 bg-background hover:bg-background transition-all duration-300"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-effect animate-in fade-in-50 slide-in-from-top-1">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="flex gap-2 items-center cursor-pointer transition-colors"
        >
          <Sun className="h-4 w-4" />
          <span>Light</span>
          {theme === "light" && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"></span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="flex gap-2 items-center cursor-pointer transition-colors"
        >
          <Moon className="h-4 w-4" />
          <span>Dark</span>
          {theme === "dark" && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"></span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="flex gap-2 items-center cursor-pointer transition-colors"
        >
          <Laptop className="h-4 w-4" />
          <span>System</span>
          {theme === "system" && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"></span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 