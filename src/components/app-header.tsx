"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { Calendar, Edit, Home, Menu, Settings, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Editor",
    url: "/editor",
    icon: Edit,
  },
  {
    title: "Contacts",
    url: "/contacts",
    icon: Users,
  },
  {
    title: "Verification",
    url: "/verification",
    icon: Calendar,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppHeader() {
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const firstName = user?.firstName || "";
  const lastName = user?.lastName || "";
  const initials = firstName && lastName ? `${firstName[0]}${lastName[0]}` : "UN";
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-6 flex">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-xl font-bold">DeathNote</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <Menubar className="hidden md:flex rounded-none border-none bg-transparent p-0">
          {menuItems.map((item) => (
            <MenubarMenu key={item.title}>
              <MenubarTrigger
                className={cn(
                  "relative px-3 py-1.5 text-sm font-medium transition-colors hover:text-foreground focus:text-foreground",
                  pathname === item.url ? "text-foreground" : "text-muted-foreground"
                )}
                onClick={() => router.push(item.url)}
              >
                <div className="flex items-center gap-1.5">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </div>
              </MenubarTrigger>
            </MenubarMenu>
          ))}
        </Menubar>
        
        {/* Mobile Navigation */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Navigation</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {menuItems.map((item) => (
              <DropdownMenuItem key={item.title} asChild>
                <Link href={item.url} className="flex items-center gap-2 w-full">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden md:flex flex-col items-end mr-1.5">
            <p className="text-sm font-medium leading-none">{firstName} {lastName}</p>
            <p className="text-xs text-muted-foreground mt-1">Account</p>
          </div>
          
          <div className="flex items-center gap-1.5">
            {user?.imageUrl ? (
              <UserButton 
                afterSignOutUrl="/" 
                appearance={{
                  elements: {
                    userButtonAvatarBox: {
                      width: '2.25rem',
                      height: '2.25rem',
                      borderRadius: '0.375rem',
                      padding: '0'
                    },
                    userButtonAvatar: {
                      width: '2.25rem',
                      height: '2.25rem',
                      borderRadius: '0.375rem',
                      objectFit: 'cover'
                    }
                  }
                }}
              />
            ) : (
              <Avatar className="h-9 w-9 border rounded-md overflow-hidden p-0">
                <AvatarImage src={user?.imageUrl} alt={`${firstName} ${lastName}`} className="object-cover" />
                <AvatarFallback className="bg-primary text-primary-foreground rounded-md text-xs">{initials}</AvatarFallback>
              </Avatar>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
} 