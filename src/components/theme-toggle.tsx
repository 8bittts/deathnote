/**
 * Theme Toggle Component
 * 
 * This component provides a dropdown menu for switching between different theme modes:
 * Light, Dark, and Shinigami (custom Death Note-inspired theme).
 * 
 * It displays different icons based on the current theme and provides visual feedback
 * when the Shinigami theme is active through custom styling and effects.
 * 
 * @module components/theme-toggle
 */

"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, Skull } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/**
 * ThemeToggle Component
 * 
 * A dropdown menu that allows users to switch between light, dark, and Shinigami themes.
 * Shows a different icon based on the current theme and adds special effects for the Shinigami theme.
 * 
 * @returns A React component that renders a theme selection dropdown
 */
export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className={`h-9 w-9 border border-border p-0 relative transition-all duration-300 ${
            theme === 'shinigami' ? 'border-red-800 shadow-[0_0_15px_rgba(200,0,0,0.4)]' : ''
          }`}
        >
          <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 shinigami:-rotate-90 shinigami:scale-0" />
          <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 shinigami:-rotate-90 shinigami:scale-0" />
          <Skull 
            className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all shinigami:rotate-0 shinigami:scale-100" 
            strokeWidth={theme === 'shinigami' ? 2 : 1.5}
            color={theme === 'shinigami' ? '#ef4444' : 'currentColor'}
          />
          <span className="sr-only">Toggle theme</span>
          
          {/* Enhanced red glow for Shinigami mode */}
          {theme === 'shinigami' && (
            <>
              <span className="absolute inset-0 rounded-md bg-red-600/15 blur-[3px] animate-pulse" />
              <span className="absolute -inset-1 rounded-md bg-red-600/10 blur-[6px]" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2">
          <Sun className="h-4 w-4" />
          <span>Light</span>
          {theme === 'light' && <span className="ml-auto text-xs opacity-60">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2">
          <Moon className="h-4 w-4" />
          <span>Dark</span>
          {theme === 'dark' && <span className="ml-auto text-xs opacity-60">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("shinigami")} className="gap-2">
          <Skull className="h-4 w-4" color={theme === 'shinigami' ? '#ef4444' : undefined} />
          <span className={theme === 'shinigami' ? 'text-red-500' : undefined}>Shinigami</span>
          {theme === 'shinigami' && <span className="ml-auto text-xs text-red-500 opacity-80">死神</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 