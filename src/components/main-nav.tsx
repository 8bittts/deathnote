"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface MainNavProps {
  className?: string;
}

export function MainNav({ className }: MainNavProps) {
  const pathname = usePathname();
  
  const items = [
    {
      name: "Dashboard",
      href: "/dashboard",
    },
    {
      name: "Contacts",
      href: "/contacts",
    },
    {
      name: "Editor",
      href: "/editor",
    },
    {
      name: "History",
      href: "/history",
    },
    {
      name: "Settings",
      href: "/settings",
    },
  ];

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
    >
      <Link
        href="/dashboard"
        className="text-lg font-semibold"
      >
        DeathNote
      </Link>
      
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
} 