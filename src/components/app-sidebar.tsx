/**
 * AppSidebar Component
 * 
 * A responsive sidebar navigation component that provides the main navigation
 * structure for authenticated users. Shows user information at the bottom.
 * 
 * @module components/app-sidebar
 */

"use client";

import React from "react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { Calendar, Edit, Home, Settings, Users } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

/**
 * Navigation menu items configuration
 */
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

/**
 * AppSidebar Component
 * 
 * @returns A vertical sidebar with navigation options and user information
 */
export function AppSidebar() {
  const { user } = useUser();
  const firstName = user?.firstName || "";
  const lastName = user?.lastName || "";
  
  return (
    <Sidebar>
      <SidebarContent className="h-screen flex flex-col">
        <div className="py-4 px-4">
          <h2 className="text-xl font-bold">DeathNote</h2>
        </div>
        <Separator />
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center">
                      <item.icon className="h-4 w-4 mr-2" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="mt-auto p-4">
          <Separator className="mb-4" />
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <div className="flex flex-col">
              <p className="text-sm font-medium">{firstName} {lastName}</p>
              <p className="text-xs text-muted-foreground">Account</p>
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
} 