/**
 * Death Note Effects Component
 * 
 * This component renders visual effects that are displayed when the app is in "Shinigami" theme mode.
 * It adds floating feathers, ember particles, and atmospheric visual effects to create a Death Note-inspired
 * aesthetic throughout the application.
 * 
 * All effects are applied client-side only and use Framer Motion for animations.
 * 
 * @module components/death-note-effects
 */

"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { AnimatePresence, motion } from "framer-motion"

/**
 * DeathNoteEffects Component
 * 
 * Provides visual theming effects for the Shinigami theme mode.
 * Includes floating feathers, ember particles, vignette effects, and atmospheric overlays.
 * 
 * @returns A React component that renders visual effects or null if not in Shinigami mode
 */
export const DeathNoteEffects = () => {
  const { theme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)
  
  // Ensure we're only rendering this client-side
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  if (!isMounted) return null
  
  // Only show the effects in Shinigami mode
  if (theme !== "shinigami") return null
  
  return (
    <>
      {/* Floating feathers - a subtle nod to Ryuk's appearance */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`feather-${i}`}
              className="absolute"
              initial={{ 
                opacity: 0,
                top: `${Math.random() * 100}%`, 
                left: `${Math.random() * 100}%`,
                rotate: 0 
              }}
              animate={{ 
                opacity: [0, 0.7, 0.3, 0],
                top: [`${Math.random() * 100}%`, "110%"],
                left: [`${Math.random() * 100}%`, `${(Math.random() * 40) + 30}%`],
                rotate: [0, Math.random() > 0.5 ? 360 : -360]
              }}
              transition={{ 
                duration: 15 + (Math.random() * 20),
                ease: "easeInOut",
                repeat: Infinity,
                delay: i * 3
              }}
            >
              <div 
                className="h-8 w-2 bg-red-800/20 shadow-lg blur-[1px]"
                style={{ 
                  clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)", 
                  transform: `scale(${0.5 + (Math.random() * 0.5)})` 
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Ember particles - floating fire-like elements */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={`ember-${i}`}
              className="absolute rounded-full"
              initial={{ 
                opacity: 0,
                scale: 0.2 + (Math.random() * 0.8),
                bottom: `-5%`, 
                left: `${Math.random() * 100}%`,
              }}
              animate={{ 
                opacity: [0, 0.6, 0.8, 0.3, 0],
                scale: [0.2, 0.5, 0.3],
                bottom: [`-5%`, `${60 + (Math.random() * 40)}%`],
                left: [`${Math.random() * 100}%`, `${(Math.random() * 100)}%`]
              }}
              transition={{ 
                duration: 4 + (Math.random() * 6),
                ease: "easeOut",
                repeat: Infinity,
                delay: i * 0.5
              }}
              style={{
                width: `${3 + (Math.random() * 6)}px`,
                height: `${3 + (Math.random() * 6)}px`,
                background: `rgb(${200 + Math.random() * 55}, ${50 + Math.random() * 50}, 0)`,
                boxShadow: `0 0 ${2 + Math.random() * 4}px ${1 + Math.random() * 2}px rgba(${200 + Math.random() * 55}, ${50 + Math.random() * 50}, 0, 0.6)`
              }}
            />
          ))}
        </AnimatePresence>
      </div>
      
      {/* Red vignette effect around the edges - darker and more intense */}
      <div className="fixed inset-0 pointer-events-none z-40" 
        style={{ 
          background: "radial-gradient(circle at center, transparent 40%, rgba(120, 0, 0, 0.4) 100%)",
          mixBlendMode: "multiply"
        }} 
      />
      
      {/* Subtle pulsing glow effect - more intense */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-30 bg-red-900/10"
        animate={{ opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Dark overlay for a more sinister atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-20 bg-black/30" />
    </>
  )
} 