
"use client";

import * as React from "react";
import { AppLayout } from "@/components/app/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Instagram, Loader2, Image as ImageIcon, Video, Layers, Calendar, ArrowDownUp, Heart, MessageCircle, Clock, Percent, TrendingUp, Award, Info } from "lucide-react";
import { PostCard } from "@/components/app/PostCard";
import { searchInstagramContent } from "@/ai/flows/search-flow";
import type { InstagramPost, HashtagInsights as HashtagInsightsType } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { HashtagInsights } from "@/components/app/HashtagInsights";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type TimeRange = "all" | "24h" | "7d" | "30d";
type MediaType = "all" | "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
type SortBy = "trending" | "top" | "likes" | "comments" | "newest" | "engagementRate";

const POSTS_PER_PAGE = 8;

const ScoreGuide = () => (
  <Card className="mt-8 bg-accent/50">
    <CardHeader className="pb-4">
      <CardTitle className="text-lg flex items-center gap-2">
        <Info className="h-5 w-5" />
        Understanding Scores
      </CardTitle>
    </CardHeader>
    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
      <div>
        <div className="flex items-center gap-2 font-semibold mb-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span>Trending Score</span>
        </div>
        <p className="text-muted-foreground mb-3">
          Measures recent engagement velocity. A high score means the post is gaining traction quickly right now.
        </p>
      </div>
      <div>
        <div className="flex items-center gap-2 font-semibold mb-2">
          <Award className="h-5 w-5 text-primary" />
          <span>Top Score</span>
        </div>
        <p className="text-muted-foreground mb-3">
          Measures total overall engagement (likes and comments). A high score indicates strong all-time performance.
        </p>
      </div>
       <div className="md:col-span-2">
         <p className="text-muted-foreground text-xs text-center">
            Performance badges are based on these scores: <Badge variant="outline" className="mx-1 bg-green-500/20 text-green-400 border-green-500/30">Viral (350+)</Badge> <Badge variant="outline" className="mx-1 bg-amber-500/20 text-amber-400 border-amber-500/30">Rising (150-349)</Badge> <Badge variant="outline" className="mx-1 bg-muted text-muted-foreground border-border">Normal (&lt;150)</Badge>
        </p>
      </div>
    </CardContent>
  </Card>
);


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
  const [minLikes, setMinLikes] = React.useState('');
  const [minComments, setMinComments] = React.useState('');

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
        handleFetchContent(newTab);
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

    // Filter by min likes
    if (minLikes) {
        const likes = parseInt(minLikes, 10);
        if (!isNaN(likes)) {
            results = results.filter(post => (post.metrics.likes || 0) >= likes);
        }
    }

    // Filter by min comments
    if (minComments) {
        const comments = parseInt(minComments, 10);
        if (!isNaN(comments)) {
            results = results.filter(post => (post.metrics.comments || 0) >= comments);
        }
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
  }, [allResults, timeRange, mediaType, sortBy, minLikes, minComments]);

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
            {searchPerformed && <ScoreGuide />}
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
                      <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-muted-foreground" />
                          <Input
                              type="number"
                              placeholder="Min likes"
                              className="w-[120px] h-9"
                              value={minLikes}
                              onChange={(e) => setMinLikes(e.target.value)}
                          />
                      </div>
                      <div className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-muted-foreground" />
                          <Input
                              type="number"
                              placeholder="Min comments"
                              className="w-[120px] h-9"
                              value={minComments}
                              onChange={(e) => setMinComments(e.target.value)}
                          />
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
                                    <SelectItem value="trending">Trending</SelectItem>
                                  ) : (
                                    <SelectItem value="top">Top Posts</SelectItem>
                                  )}
                                  <SelectItem value="engagementRate">Engagement Rate</SelectItem>
                                  <SelectItem value="likes">Most Likes</SelectItem>
                                  <SelectItem value="comments">Most Comments</SelectItem>
                                  <SelectItem value="newest">Newest</SelectItem>
                              </SelectContent>
                          </Select>
                      </div>
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

    