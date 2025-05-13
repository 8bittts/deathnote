import React, { useEffect, useRef } from "react";
import { Skull } from "lucide-react";
import { cn } from "@/lib/utils";
import "@/styles/logo-animation.css";

interface DeathNoteLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const DeathNoteLogo: React.FC<DeathNoteLogoProps> = ({ size = "md", className = "" }) => {
  // Define sizes based on the size prop
  const sizes = {
    sm: {
      container: "h-10 w-10",
      icon: "h-6 w-6",
      flameHeight: "h-5",
    },
    md: {
      container: "h-16 w-16",
      icon: "h-10 w-10",
      flameHeight: "h-8",
    },
    lg: {
      container: "h-20 w-20",
      icon: "h-14 w-14",
      flameHeight: "h-10",
    },
    xl: {
      container: "h-24 w-24",
      icon: "h-16 w-16",
      flameHeight: "h-12",
    }
  };

  const currentSize = sizes[size];
  const logoRef = useRef<HTMLDivElement>(null);

  // Randomize ember positions on mount and hover
  useEffect(() => {
    const randomizeEmbers = () => {
      if (logoRef.current) {
        // Generate 8 random values and set them as CSS variables
        for (let i = 1; i <= 8; i++) {
          const randomValue = Math.random();
          logoRef.current.style.setProperty(`--random-${i}`, randomValue.toString());
        }
      }
    };

    // Initial randomization
    randomizeEmbers();

    // Add event listener for hover to randomize again
    const logoElement = logoRef.current;
    if (logoElement) {
      logoElement.addEventListener('mouseenter', randomizeEmbers);
      
      // Cleanup event listener on unmount
      return () => {
        logoElement.removeEventListener('mouseenter', randomizeEmbers);
      };
    }
  }, []);

  return (
    <div ref={logoRef} className={cn("death-note-logo relative group", className)}>
      {/* Main logo with rounded square border */}
      <div className={cn(
        "rounded-lg border-2 border-muted flex items-center justify-center transition-colors duration-300", 
        "group-hover:bg-black group-hover:border-orange-700",
        currentSize.container
      )}>
        <Skull 
          className={cn(
            "text-primary transition-colors duration-300", 
            "group-hover:text-white",
            currentSize.icon
          )} 
          strokeWidth={1.5} 
        />
        
        {/* Fire elements - only visible on hover */}
        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Main fire on top of skull */}
          <div className={cn("absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-full", currentSize.flameHeight)}>
            <div className="skull-fire"></div>
          </div>
          
          {/* Floating embers above the fire */}
          <div className="embers absolute w-full -top-8 left-0 h-12 overflow-visible">
            <div className="ember ember-1"></div>
            <div className="ember ember-2"></div>
            <div className="ember ember-3"></div>
            <div className="ember ember-4"></div>
            <div className="ember ember-5"></div>
            <div className="ember ember-6"></div>
            <div className="ember ember-7"></div>
            <div className="ember ember-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeathNoteLogo; 