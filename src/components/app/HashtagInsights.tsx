
'use client';

import type { HashtagInsights } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AtSign, BarChart2, Hash, Users } from 'lucide-react';
import React from 'react';

function formatMetric(num?: number): string {
    if (num === undefined) return '0';
    if (num < 1000) return num.toString();
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
    return `${(num / 1000000).toFixed(1)}M`;
}

export function HashtagInsights({ insights }: { insights: HashtagInsights }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Posts in Sample</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMetric(insights.totalPosts)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Engagement Rate</CardTitle>
          <BarChart2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{insights.avgEngagementRate.toFixed(2)}%</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span>Top Related Hashtags</span>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {insights.topRelatedHashtags.length > 0 ? insights.topRelatedHashtags.map((item) => (
              <Badge key={item.hashtag} variant="secondary">{item.hashtag}</Badge>
            )) : <p className="text-xs text-muted-foreground">None found</p>}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span>Top Mentioned Users</span>
             <AtSign className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {insights.topMentionedUsers.length > 0 ? insights.topMentionedUsers.map((item) => (
              <a key={item.username} href={`https://instagram.com/${item.username}`} target="_blank" rel="noopener noreferrer" className="text-xs font-medium hover:underline">@{item.username}</a>
            )) : <p className="text-xs text-muted-foreground">None found</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


HashtagInsights.Skeleton = function HashtagInsightsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-3/5" />
                    <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-2/5" />
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-3/5" />
                    <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-2/5" />
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="pb-2">
                     <Skeleton className="h-4 w-4/5" />
                </CardHeader>
                <CardContent>
                   <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-14" />
                   </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="pb-2">
                     <Skeleton className="h-4 w-4/5" />
                </CardHeader>
                <CardContent>
                   <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                   </div>
                </CardContent>
            </Card>
        </div>
    )
}
