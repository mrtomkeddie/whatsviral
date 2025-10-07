
'use client';

import type { HashtagInsights as HashtagInsightsType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AtSign, Hash, Layers, Heart, MessageCircle } from 'lucide-react';
import React from 'react';

function formatMetric(num?: number): string {
    if (num === undefined) return '0';
    if (num < 1000) return num.toString();
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
    return `${(num / 1000000).toFixed(1)}M`;
}

function formatMediaType(type: string) {
    if (!type) return 'N/A';
    return type.replace('_', ' ').toLowerCase();
}

export function HashtagInsights({ insights }: { insights: HashtagInsightsType }) {
  const [showAllTags, setShowAllTags] = React.useState(false);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMetric(insights.avgLikes)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Comments</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMetric(insights.avgComments)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Format</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold capitalize">{formatMediaType(insights.topFormat)}</div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>Top Related Hashtags</span>
              <Hash className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {insights.topRelatedHashtags.length > 0 ? (
              (() => {
                const MAX_TAGS = 6;
                const tags = insights.topRelatedHashtags;
                const hasOverflow = tags.length > MAX_TAGS;
                const first = hasOverflow ? tags.slice(0, MAX_TAGS) : tags;
                const rest = hasOverflow ? tags.slice(MAX_TAGS) : [];

                return (
                  <div className="flex flex-wrap items-center gap-2">
                    {first.map((item) => (
                      <Badge key={item.hashtag} variant="secondary">{item.hashtag}</Badge>
                    ))}
                    {hasOverflow && !showAllTags && (
                      <button
                        type="button"
                        className="text-xs text-muted-foreground hover:underline"
                        onClick={() => setShowAllTags(true)}
                        aria-label={`Show ${rest.length} more hashtags`}
                      >
                        Show more (+{rest.length})
                      </button>
                    )}
                    {showAllTags && rest.map((item) => (
                      <Badge key={item.hashtag} variant="secondary">{item.hashtag}</Badge>
                    ))}
                    {hasOverflow && showAllTags && (
                      <button
                        type="button"
                        className="text-xs text-muted-foreground hover:underline"
                        onClick={() => setShowAllTags(false)}
                        aria-label="Show fewer hashtags"
                      >
                        Show less
                      </button>
                    )}
                  </div>
                );
              })()
            ) : (
              <p className="text-xs text-muted-foreground">None found</p>
            )}
          </CardContent>
        </Card>
      </div>

    </>
  );
}


HashtagInsights.Skeleton = function HashtagInsightsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {[...Array(5)].map((_, i) => (
                 <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-3/5" />
                        <Skeleton className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-2/5" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
