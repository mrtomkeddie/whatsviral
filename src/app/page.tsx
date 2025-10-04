
"use client";

import * as React from "react";
import { AppLayout } from "@/components/app/AppLayout";
import { Header } from "@/components/app/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Instagram, Loader2 } from "lucide-react";
import { PostCard } from "@/components/app/PostCard";
import { searchInstagramContent } from "@/ai/flows/search-flow";
import type { InstagramPost } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function Home() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<InstagramPost[]>([]);
  const [searchPerformed, setSearchPerformed] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"trending" | "top">("trending");

  const handleFetchContent = async (mode: "trending" | "top") => {
    if (!query) return;
    setSearchPerformed(true);
    setIsLoading(true);
    setResults([]);
    
    try {
      const response = await searchInstagramContent({
        hashtag: query,
        mode: mode,
      });
      setResults(response.posts);
    } catch (error) {
      console.error("Failed to fetch content:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const onTabChange = (value: string) => {
    const newTab = value as "trending" | "top";
    setActiveTab(newTab);
    if(searchPerformed) {
        handleFetchContent(newTab);
    }
  }

  const handleSearch = () => {
    handleFetchContent(activeTab);
  }

  return (
    <AppLayout>
      <Header />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold font-headline tracking-tight">
              Find Viral Instagram Content
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Search Instagram by hashtag to see Trending and Top Posts.
            </p>
          </div>

          <div className="flex items-center gap-2 max-w-xl mx-auto">
              <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                      type="search"
                      placeholder="Search by #hashtag..."
                      className="w-full h-12 pl-10 text-base rounded-lg"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
              </div>
              <Button
                  size="lg"
                  className="h-12"
                  onClick={handleSearch}
                  disabled={isLoading}
              >
                  {isLoading ? (
                      <Loader2 className="mr-2 animate-spin" />
                  ) : (
                      <Search className="mr-2" />
                  )}
                  Search
              </Button>
          </div>

          <div className="mt-12">
            <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="top">Top Posts</TabsTrigger>
              </TabsList>
              <TabsContent value="trending">
                {renderResults()}
              </TabsContent>
              <TabsContent value="top">
                {renderResults()}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </AppLayout>
  );

  function renderResults() {
    if (isLoading) {
      return (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <PostCard.Skeleton key={i} />
          ))}
        </div>
      );
    }

    if (searchPerformed && results.length === 0) {
      return (
        <div className="mt-8 text-center py-16 px-4 bg-card border rounded-xl">
          <Search className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Results Found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            No items match your search. Try a different hashtag.
          </p>
        </div>
      );
    }

    if (results.length > 0) {
      return (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      );
    }

    return null;
  }
}
