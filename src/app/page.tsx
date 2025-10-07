
"use client";

import * as React from "react";
import { AppLayout } from "@/components/app/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Instagram, Loader2, Image as ImageIcon, Video, Layers, Calendar, ArrowDownUp, Clock, Percent, TrendingUp, Award, Info } from "lucide-react";
import { PostCard } from "@/components/app/PostCard";
import { searchInstagramContent } from "@/ai/flows/search-flow";
import type { InstagramPost, HashtagInsights as HashtagInsightsType } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { HashtagInsights } from "@/components/app/HashtagInsights";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type TimeRange = "all" | "24h" | "7d" | "30d";
type MediaType = "all" | "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
type SortBy = "trending" | "top" | "likes" | "comments" | "newest" | "engagementRate";

const POSTS_PER_PAGE = 8;

const ScoreGuide = ({ activeTab }: { activeTab: "trending" | "top" }) => {
  const isTrending = activeTab === "trending";

  return (
    <Card className="mt-8 overflow-hidden border border-border/50 bg-gradient-to-br from-background/60 to-accent/40 rounded-xl">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/15 text-primary p-2 ring-1 ring-primary/20">
               {isTrending ? (
                 <TrendingUp className="h-5 w-5" />
               ) : (
                 <Award className="h-5 w-5" />
               )}
             </div>
             <div>
               <CardTitle className="text-xl font-semibold">
                 {isTrending ? "Trending Score" : "Top Score"}{" "}
                 <span className="text-muted-foreground font-normal">(1–10)</span>
               </CardTitle>
               <p className="text-xs text-muted-foreground">Understanding Scores</p>
             </div>
          </div>

          {/* Helper icon removed */}
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="max-w-3xl">
          <p className="text-base leading-relaxed text-muted-foreground">
            {isTrending
              ? "Measures recent engagement velocity. A high score means the post is gaining traction quickly."
              : "Measures total overall engagement relative to other posts for the hashtag. A high score indicates strong all-time performance."}
          </p>
          <div className="text-base leading-relaxed text-muted-foreground mt-2">
            Posts with a score of 8+ are marked as{" "}
            <Badge
              variant="outline"
              className="align-middle text-xs bg-green-500/15 text-green-400 border-green-500/30 inline-flex items-center"
            >
              Viral
            </Badge>
            .
          </div>

          {/* Tip line removed */}
        </div>
      </CardContent>
    </Card>
  );
};


export default function Home() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [allResults, setAllResults] = React.useState<InstagramPost[]>([]);
  const [filteredResults, setFilteredResults] = React.useState<InstagramPost[]>([]);
  const [insights, setInsights] = React.useState<HashtagInsightsType | null>(null);
  const [searchPerformed, setSearchPerformed] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"trending" | "top">("trending");

  const [timeRange, setTimeRange] = React.useState<TimeRange>("all");
  const [mediaType, setMediaType] = React.useState<MediaType>("all");
  const [sortBy, setSortBy] = React.useState<SortBy>("trending");

  const [visiblePosts, setVisiblePosts] = React.useState<InstagramPost[]>([]);
  const [numVisiblePosts, setNumVisiblePosts] = React.useState(POSTS_PER_PAGE);
  
  const handleFetchContent = async (mode: "trending" | "top") => {
    if (!query) return;
    setSearchPerformed(true);
    setIsLoading(true);
    setAllResults([]);
    setInsights(null);
    setNumVisiblePosts(POSTS_PER_PAGE);
    
    try {
      const response = await searchInstagramContent({
        hashtag: query,
        mode: mode,
      });
      setAllResults(response.posts);
      if (response.insights) {
        setInsights(response.insights);
      }
    } catch (error) {
      console.error("Failed to fetch content:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const onTabChange = (value: string) => {
    const newTab = value as "trending" | "top";
    setActiveTab(newTab);
    setSortBy(newTab);
    if(searchPerformed) {
        // No need to re-fetch, just re-sort and filter.
        // The sorting logic in useEffect will handle it.
    }
  }

  const handleSearch = () => {
    handleFetchContent(activeTab);
  }

  React.useEffect(() => {
    let results = [...allResults];

    // Filter by time range
    if (timeRange !== 'all') {
      const now = new Date();
      const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 24 * 7 : 24 * 30;
      results = results.filter(post => {
        const postDate = new Date(post.publishedAt);
        const diffHours = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);
        return diffHours <= hours;
      });
    }

    // Filter by media type
    if (mediaType !== 'all') {
      results = results.filter(post => post.mediaType === mediaType);
    }


    
    // Sort results
    results.sort((a, b) => {
      switch (sortBy) {
        case 'trending':
          return (b.metrics.trendingScore || 0) - (a.metrics.trendingScore || 0);
        case 'top':
          return (b.metrics.topScore || 0) - (a.metrics.topScore || 0);
        case 'likes':
          return (b.metrics.likes || 0) - (a.metrics.likes || 0);
        case 'comments':
          return (b.metrics.comments || 0) - (a.metrics.comments || 0);
        case 'newest':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'engagementRate':
             const engagementRateA = a.metrics.engagementRate || 0;
             const engagementRateB = b.metrics.engagementRate || 0;
             return engagementRateB - engagementRateA;
        default:
          return (b.metrics.trendingScore || 0) - (a.metrics.trendingScore || 0);
      }
    });

    setFilteredResults(results);
    setNumVisiblePosts(POSTS_PER_PAGE);
  }, [allResults, timeRange, mediaType, sortBy, activeTab]);

  React.useEffect(() => {
    setVisiblePosts(filteredResults.slice(0, numVisiblePosts));
  }, [filteredResults, numVisiblePosts]);

  const handleLoadMore = () => {
    setNumVisiblePosts(prev => prev + POSTS_PER_PAGE);
  };


  return (
    <AppLayout>
      
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
            {isLoading && <HashtagInsights.Skeleton />}
            {insights && <HashtagInsights insights={insights} />}
            {/* Compact popover replaces large ScoreGuide card */}
            {/* {searchPerformed && <ScoreGuide activeTab={activeTab} />} */}
            <Tabs value={activeTab} onValueChange={onTabChange} className="w-full mt-8">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="top">Top Posts</TabsTrigger>
              </TabsList>

              {searchPerformed && (
                <div className="my-6">
                  <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
                              <SelectTrigger className="w-[120px] h-9">
                                  <SelectValue placeholder="Time range" />
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="all">All Time</SelectItem>
                                  <SelectItem value="24h">Last 24h</SelectItem>
                                  <SelectItem value="7d">Last 7d</SelectItem>
                                  <SelectItem value="30d">Last 30d</SelectItem>
                              </SelectContent>
                          </Select>
                      </div>
                      <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-muted-foreground" />
                          <Select value={mediaType} onValueChange={(v) => setMediaType(v as MediaType)}>
                              <SelectTrigger className="w-[120px] h-9">
                                  <SelectValue placeholder="Media Type" />
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="all">All Media</SelectItem>
                                  <SelectItem value="IMAGE">Image</SelectItem>
                                  <SelectItem value="VIDEO">Video</SelectItem>
                                  <SelectItem value="CAROUSEL_ALBUM">Carousel</SelectItem>
                              </SelectContent>
                          </Select>
                      </div>
                      <Separator orientation="vertical" className="h-6 mx-2 hidden sm:block" />
                      <div className="flex items-center gap-2">
                          <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
                          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
                              <SelectTrigger className="w-[150px] h-9">
                                  <SelectValue placeholder="Sort by" />
                              </SelectTrigger>
                              <SelectContent>
                                  {activeTab === 'trending' ? (
                                    <SelectItem value="trending">Trending Score</SelectItem>
                                  ) : (
                                    <SelectItem value="top">Top Score</SelectItem>
                                  )}
                                  <SelectItem value="engagementRate">Engagement Rate</SelectItem>
                                  <SelectItem value="likes">Most Likes</SelectItem>
                                  <SelectItem value="comments">Most Comments</SelectItem>
                                  <SelectItem value="newest">Newest</SelectItem>
                              </SelectContent>
                          </Select>
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-9 px-3">
                            <Info className="h-4 w-4 mr-2" />
                            Score guide
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4">
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">{activeTab === 'trending' ? 'Trending Score (1–10)' : 'Top Score (1–10)'}</h4>
                            <p className="text-sm text-muted-foreground">
                              {activeTab === 'trending'
                                ? 'Measures recent engagement velocity. A higher score means the post is gaining traction quickly.'
                                : 'Measures total overall engagement relative to other posts for the hashtag. A high score indicates strong all-time performance.'}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{activeTab === 'trending' ? 'Viral' : 'Top'}</Badge>
                              <span className="text-xs text-muted-foreground sm:hidden">
                                {activeTab === 'trending' ? 'Viral at 8+' : 'Top at 8+'}
                              </span>
                              <span className="text-xs text-muted-foreground hidden sm:inline">
                                {activeTab === 'trending'
                                  ? 'Viral badge appears for scores of 8 or higher'
                                  : 'Top badge appears for scores of 8 or higher'}
                              </span>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                  </div>

                  {visiblePosts.length > 0 && (
                    <div className="text-center mt-6 text-sm text-muted-foreground">
                      Showing {visiblePosts.length} of {filteredResults.length} posts
                    </div>
                  )}
                </div>
              )}

              <TabsContent value="trending">
                {renderResults()}
              </TabsContent>
              <TabsContent value="top">
                {renderResults()}
              </TabsContent>
            </Tabs>

            {visiblePosts.length < filteredResults.length && !isLoading && (
              <div className="mt-8 text-center">
                <Button onClick={handleLoadMore}>Load More</Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </AppLayout>
  );

  function renderResults() {
    if (isLoading && visiblePosts.length === 0) {
      return (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(POSTS_PER_PAGE)].map((_, i) => (
            <PostCard.Skeleton key={i} />
          ))}
        </div>
      );
    }

    if (searchPerformed && visiblePosts.length === 0 && !isLoading) {
      return (
        <div className="mt-8 text-center py-16 px-4 bg-card border rounded-xl">
          <Instagram className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Results Found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            No items match your search. Try a different hashtag or adjust your filters.
          </p>
        </div>
      );
    }

    if (visiblePosts.length > 0) {
      return (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visiblePosts.map((post) => (
            <PostCard key={post.id} post={post} activeTab={activeTab} />
          ))}
        </div>
      );
    }

    return null;
  }
}

    