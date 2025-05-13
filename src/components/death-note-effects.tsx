"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { AnimatePresence, motion } from "framer-motion"

// Component to add Death Note-specific effects when in Shinigami mode
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
      
      {/* Red vignette effect around the edges */}
      <div className="fixed inset-0 pointer-events-none z-40" 
        style={{ 
          background: "radial-gradient(circle at center, transparent 60%, rgba(150, 0, 0, 0.2) 100%)",
          mixBlendMode: "multiply"
        }} 
      />
      
      {/* Subtle pulsing glow effect */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-30 bg-red-900/5"
        animate={{ opacity: [0.02, 0.05, 0.02] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  )
} 