
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
import { Search, Youtube, Rss, Instagram, Loader2 } from "lucide-react";
import { PostCard } from "@/components/app/PostCard";
import type { Post } from "@/lib/types";
import { searchContent } from "@/ai/flows/search-flow";

export default function Home() {
  const [platform, setPlatform] = React.useState("youtube");
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<Post[]>([]);
  const [searchPerformed, setSearchPerformed] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [searchMode, setSearchMode] = React.useState("keyword");

  const handleFetchContent = async () => {
    setSearchPerformed(true);
    setIsLoading(true);
    setResults([]);
    
    try {
      const response = await searchContent({
        platform: platform as 'youtube' | 'reddit' | 'instagram',
        query,
        searchMode,
      });
      setResults(response.posts);
    } catch (error) {
      console.error("Failed to fetch content:", error);
      // Optionally, show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <Header />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold font-headline tracking-tight">
              Find The Next Viral Hit
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Enter a keyword, hashtag, or channel to discover trending content
              from YouTube, Reddit, and Instagram before it takes off.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 bg-card p-2 rounded-xl border shadow-sm">
            <Select value={searchMode} onValueChange={setSearchMode}>
              <SelectTrigger className="md:col-span-1 h-12 text-base rounded-lg">
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
                className="w-full h-12 pl-10 text-base rounded-lg"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Platforms:
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="data-[active=true]:bg-secondary data-[active=true]:border-primary/50 data-[active=true]:text-primary"
                data-active={platform === "youtube"}
                onClick={() => setPlatform("youtube")}
              >
                <Youtube className="mr-2" /> YouTube
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="data-[active=true]:bg-secondary data-[active=true]:border-primary/50 data-[active=true]:text-primary"
                data-active={platform === "reddit"}
                onClick={() => setPlatform("reddit")}
              >
                <Rss className="mr-2" /> Reddit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="data-[active=true]:bg-secondary data-[active=true]:border-primary/50 data-[active=true]:text-primary"
                data-active={platform === "instagram"}
                onClick={() => setPlatform("instagram")}
              >
                <Instagram className="mr-2" /> Instagram
              </Button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button
              size="lg"
              className="w-full sm:w-auto"
              onClick={handleFetchContent}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 animate-spin" />
              ) : (
                <Search className="mr-2" />
              )}
              {isLoading ? "Fetching Content..." : "Fetch Content"}
            </Button>
          </div>

          <div className="mt-12">
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <PostCard.Skeleton key={i} />
                ))}
              </div>
            )}
            {!isLoading && searchPerformed && results.length === 0 && (
               <div className="text-center py-16 px-4 bg-card border rounded-xl">
                  <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No Results Found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    No trending items match your filters. Try expanding the time range or lowering thresholds.
                  </p>
              </div>
            )}
            {!isLoading && results.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
