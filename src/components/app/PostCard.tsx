
'use client';

import type { Post } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  ArrowUp,
  MessageCircle,
  Heart,
  Youtube,
  Rss,
  Instagram,
  Eye,
  TrendingUp
} from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import Image from 'next/image';

const platformIcons: Record<string, React.ReactNode> = {
  youtube: <Youtube className="w-4 h-4" />,
  reddit: <Rss className="w-4 h-4" />,
  instagram: <Instagram className="w-4 h-4" />,
};

function formatMetric(num?: number): string {
    if (num === undefined) return '0';
    if (num < 1000) return num.toString();
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
    return `${(num / 1000000).toFixed(1)}M`;
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
      {post.thumbnailUrl && (
        <div className="aspect-video relative">
            <Image src={post.thumbnailUrl} alt={post.title} fill className="object-cover" />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-secondary rounded-full">
            {platformIcons[post.platform]}
          </div>
          <CardDescription className="font-medium text-xs uppercase tracking-wider">
            {post.platform}
          </CardDescription>
        </div>
        <CardTitle className="text-lg leading-snug">
          <a href={post.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {post.title}
          </a>
        </CardTitle>
        <CardDescription className="text-xs pt-1">
          by {post.author} &middot; {new Date(post.publishedAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      
      <CardFooter className="flex-col items-start gap-3 mt-auto">
        <div className="w-full flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex gap-4 items-center">
            {post.metrics.views !== undefined && (
                <div className="flex items-center gap-1.5" title="Views">
                    <Eye className="w-4 h-4" />
                    <span>{formatMetric(post.metrics.views)}</span>
                </div>
            )}
             {post.metrics.upvotes !== undefined && (
                <div className="flex items-center gap-1.5" title="Upvotes">
                    <ArrowUp className="w-4 h-4" />
                    <span>{formatMetric(post.metrics.upvotes)}</span>
                </div>
            )}
            {post.metrics.likes !== undefined && (
                <div className="flex items-center gap-1.5" title="Likes">
                    <Heart className="w-4 h-4" />
                    <span>{formatMetric(post.metrics.likes)}</span>
                </div>

            )}
            {post.metrics.comments !== undefined && (
                 <div className="flex items-center gap-1.5" title="Comments">
                    <MessageCircle className="w-4 h-4" />
                    <span>{formatMetric(post.metrics.comments)}</span>
                </div>
            )}
          </div>
          {post.metrics.trendingScore !== undefined && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 font-semibold text-primary cursor-pointer">
                  <TrendingUp className="w-4 h-4" />
                  <span>{post.metrics.trendingScore.toFixed(1)}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Trending Score: {post.metrics.trendingScore.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Based on recent engagement velocity.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

PostCard.Skeleton = function PostCardSkeleton() {
    return (
        <Card className="flex flex-col">
            <Skeleton className="aspect-video w-full" />
            <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
                 <Skeleton className="h-3 w-1/2 mt-1" />
            </CardHeader>
            <CardFooter className="flex-col items-start gap-3 mt-auto">
                <div className="w-full flex justify-between items-center">
                    <div className="flex gap-4">
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-5 w-12" />
                    </div>
                    <Skeleton className="h-6 w-10" />
                </div>
            </CardFooter>
        </Card>
    )
}
