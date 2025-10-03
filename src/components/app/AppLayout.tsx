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
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  FileClock,
  Flame,
  Star,
  User,
  Settings,
  HelpCircle,
  BarChart,
  Bell,
  Sparkles,
  Shield,
  BookOpen,
  Github,
} from "lucide-react";
import { Logo } from "@/components/icons/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" isActive tooltip="Dashboard">
                <BarChart />
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Watchlists">
                <Star />
                Watchlists
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Alerts">
                <Bell />
                Alerts
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Swipe File">
                <FileClock />
                Swipe-File
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>Trust & Support</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton href="#">
                  <Shield />
                  Privacy & Data
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="#">
                  <BookOpen />
                  Attribution Guide
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="#">
                  <HelpCircle />
                  Support
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border">
          <div className="p-4 space-y-4">
             <div className="p-4 rounded-lg bg-sidebar-accent text-center">
                 <h4 className="font-semibold text-sidebar-accent-foreground">Upgrade to Pro</h4>
                 <p className="text-xs text-muted-foreground mt-1">Unlock unlimited alerts, full CSV exports, and more.</p>
                 <Button size="sm" className="w-full mt-3 bg-primary text-primary-foreground hover:bg-primary/90">
                    <Sparkles className="mr-2 h-4 w-4"/>
                    Upgrade
                 </Button>
            </div>
          </div>
          <SidebarSeparator />
          <div className="flex items-center gap-3 p-4">
            <Avatar>
              <AvatarImage src="https://picsum.photos/seed/user/40/40" />
              <AvatarFallback>GU</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="truncate font-semibold text-sm">Guest User</p>
              <p className="truncate text-xs text-muted-foreground">Free Plan</p>
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
