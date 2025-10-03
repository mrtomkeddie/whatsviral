"use client";

import * as React from "react";
import { AppLayout } from "@/components/app/AppLayout";
import { Header } from "@/components/app/Header";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Youtube, Rss, Instagram } from "lucide-react";

export default function Home() {
  return (
    <AppLayout>
      <Header />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold font-headline tracking-tight">
              Find The Next Viral Hit
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Search content from YouTube, Reddit, and Instagram to uncover trends before they take off.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 bg-card p-2 rounded-lg border shadow-sm">
              <Select defaultValue="keyword">
                <SelectTrigger className="md:col-span-1 h-12 text-base">
                  <SelectValue placeholder="Search Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="keyword">Keyword</SelectItem>
                  <SelectItem value="hashtag">Hashtag</SelectItem>
                  <SelectItem value="channel">Channel</SelectItem>
                  <SelectItem value="subreddit">Subreddit</SelectItem>
                </SelectContent>
              </Select>
            <div className="relative md:col-span-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Enter a keyword, hashtag, channel..."
                className="w-full h-12 pl-10 text-base"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-center items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Platforms:
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="data-[active=true]:bg-secondary data-[active=true]:border-primary/50" data-active="true"><Youtube className="mr-2"/> YouTube</Button>
                <Button variant="outline" size="sm" className="data-[active=true]:bg-secondary data-[active=true]:border-primary/50" data-active="true"><Rss className="mr-2"/> Reddit</Button>
                <Button variant="outline" size="sm" className="data-[active=true]:bg-secondary data-[active=true]:border-primary/50" data-active="false"><Instagram className="mr-2"/> Instagram</Button>
            </div>
          </div>
          
           <div className="mt-8 text-center">
             <Button size="lg" className="w-full sm:w-auto">
                <Search className="mr-2"/>
                Fetch Content
            </Button>
           </div>
        </div>
      </main>
    </AppLayout>
  );
}
