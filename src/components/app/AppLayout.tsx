"use client";

import * as React from "react";
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
  Shield,
  BookOpen,
  History,
  Instagram
} from "lucide-react";
import { Logo } from "@/components/icons/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" isActive tooltip="Home">
                <Home />
                Home
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Saved Searches">
                <History />
                Saved Searches
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Alerts">
                <Bell />
                Alerts
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <SidebarMenuButton href="#" tooltip="Connect Instagram">
                <Instagram />
                Connect Instagram
              </SidebarMenuButton>
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
            <SidebarMenuButton asChild size="icon" className="h-8 w-8">
              <a href="#"><Settings /></a>
            </SidebarMenuButton>
          </div>
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-col flex-1 min-w-0">{children}</div>
    </SidebarProvider>
  );
}
