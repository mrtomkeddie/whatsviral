"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Download,
  Filter,
  Search,
  Save,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function Header({ lastUpdated }: { lastUpdated: Date }) {
  const timeAgo = formatDistanceToNow(lastUpdated, { addSuffix: true });

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="flex items-center gap-2">
         <SidebarTrigger className="md:hidden" />
         <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
            <Clock className="h-4 w-4" />
            <span>Updated {timeAgo}</span>
        </div>
      </div>
     
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by keyword, channel, subreddit..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        <div className="flex items-center gap-2">
            <Select defaultValue="all">
            <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="reddit">Reddit</SelectItem>
            </SelectContent>
            </Select>

            <Select defaultValue="24h">
            <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="6h">Last 6 hours</SelectItem>
                <SelectItem value="12h">Last 12 hours</SelectItem>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
            </Select>
        </div>

        <Button variant="outline" size="sm" className="hidden sm:inline-flex">
          <Save className="mr-2 h-4 w-4" />
          Save to Swipe-File
        </Button>
        <Button size="sm" className="hidden sm:inline-flex">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
    </header>
  );
}
