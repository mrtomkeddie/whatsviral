
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
  Bookmark
} from "lucide-react";
import { Logo } from "@/components/icons/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/" passHref legacyBehavior>
                <SidebarMenuButton asChild isActive={pathname === '/'} tooltip="Hashtag Search">
                  <a
                  >
                    <Search />
                    Hashtag Search
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <Link href="/analytics" passHref legacyBehavior>
                <SidebarMenuButton asChild isActive={pathname === '/analytics'} tooltip="User Analytics">
                  <a>
                    <User />
                    User Analytics
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/saved" passHref legacyBehavior>
                <SidebarMenuButton asChild isActive={pathname === '/saved'} tooltip="Saved Items">
                  <a>
                    <Bookmark />
                    Saved Items
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <Link href="/alerts" passHref legacyBehavior>
                <SidebarMenuButton asChild isActive={pathname === '/alerts'} tooltip="Alerts">
                  <a>
                    <Bell />
                    Alerts
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border">
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
          <Separator />
          <div className="flex items-center gap-3 p-4">
            <Avatar>
              <AvatarImage src="https://picsum.photos/seed/user/40/40" data-ai-hint="person" />
              <AvatarFallback>GU</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="truncate font-semibold text-sm">Guest User</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-col flex-1 min-w-0">{children}</div>
    </SidebarProvider>
  );
}
