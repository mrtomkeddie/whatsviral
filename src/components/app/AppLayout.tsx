
"use client";

import * as React from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Home,
  Save,
  Bell,
  User,
  Settings,
  HelpCircle,
  Search,
  Bookmark,
  LineChart,
  LayoutGrid,
  Send,
  BarChart3,
  Wallet
} from "lucide-react";
import { Logo } from "@/components/icons/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/">
                <SidebarMenuButton asChild isActive={pathname === '/'} tooltip="Hashtag Search">
                  <span>
                    <LayoutGrid />
                    Hashtag Search
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <Link href="/analytics">
                <SidebarMenuButton asChild isActive={pathname === '/analytics'} tooltip="Public Analytics">
                  <span>
                    <Send />
                    Public Analytics
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem>
               <Link href="/me">
                <SidebarMenuButton asChild isActive={pathname === '/me'} tooltip="My Analytics">
                  <span>
                    <BarChart3 />
                    My Analytics
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/saved">
                <SidebarMenuButton asChild isActive={pathname === '/saved'} tooltip="Saved Items">
                  <span>
                    <Bookmark />
                    Saved Items
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <Link href="/alerts">
                <SidebarMenuButton asChild isActive={pathname === '/alerts'} tooltip="Alerts">
                  <span>
                    <Wallet />
                    Alerts
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu className="p-2">
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Support">
                <HelpCircle />
                Support
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Settings">
                <Settings />
                Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-col flex-1 min-w-0">{children}</div>
    </SidebarProvider>
  );
}
