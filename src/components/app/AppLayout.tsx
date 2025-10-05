
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
  Settings,
  Bookmark,
  LayoutGrid,
  Send,
  BarChart3,
  Wallet
} from "lucide-react";
import { Logo } from "@/components/icons/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="floating" defaultOpen={false}>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent className="p-4 justify-center">
          <SidebarMenu className="items-center">
            <SidebarMenuItem>
              <Link href="/" passHref>
                <SidebarMenuButton isActive={pathname === '/'} tooltip="Hashtag Search">
                  <LayoutGrid />
                  <span>Hashtag Search</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <Link href="/analytics" passHref>
                <SidebarMenuButton isActive={pathname === '/analytics'} tooltip="Public Analytics">
                  <Send />
                  <span>Public Analytics</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem>
               <Link href="/me" passHref>
                <SidebarMenuButton isActive={pathname === '/me'} tooltip="My Analytics">
                  <BarChart3 />
                  <span>My Analytics</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/saved" passHref>
                <SidebarMenuButton isActive={pathname === '/saved'} tooltip="Saved Items">
                  <Bookmark />
                  <span>Saved Items</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <Link href="/alerts" passHref>
                <SidebarMenuButton isActive={pathname === '/alerts'} tooltip="Alerts">
                  <Wallet />
                  <span>Alerts</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu className="p-4 items-center">
             <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Avatar className="h-9 w-9">
                  <AvatarFallback>N</AvatarFallback>
              </Avatar>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-col flex-1 min-w-0">{children}</div>
    </SidebarProvider>
  );
}
