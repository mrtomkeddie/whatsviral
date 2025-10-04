
'use client';

import type { InstagramPost } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  MessageCircle,
  Heart,
  Instagram,
  TrendingUp,
  Save,
  BookmarkCheck,
  Image as ImageIcon,
  Video,
  Layers,
  Award,
} from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import Image from 'next/image';
import { Button } from '../ui/button';
import { useSavedPosts } from '@/context/SavedPostsContext';
import { Badge } from '../ui/badge';

function formatMetric(num?: number): string {
    if (num === undefined) return '0';
    if (num < 1000) return num.toString();
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
    return `${(num / 1000000).toFixed(1)}M`;
}

function timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)}y`;
  
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)}mo`;
  
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)}d`;
  
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)}h`;
  
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)}m`;
  
    return `${Math.floor(seconds)}s`;
}

function MediaTypeIndicator({ type }: { type: InstagramPost['mediaType']}) {
  const icon = {
    'IMAGE': <ImageIcon className="w-3 h-3" />,
    'VIDEO': <Video className="w-3 h-3" />,
    'CAROUSEL_ALBUM': <Layers className="w-3 h-3" />,
  }[type];

  return (
    <Badge variant="secondary" className="capitalize">
      {icon}
      <span className="ml-1.5">{type.replace('_', ' ').toLowerCase()}</span>
    </Badge>
  );
}

export function PostCard({ post, activeTab }: { post: InstagramPost, activeTab: 'trending' | 'top' }) {
  const { savedPosts, addSavedPost, removeSavedPost } = useSavedPosts();
  const isSaved = savedPosts.some(p => p.id === post.id);

  const handleSaveClick = () => {
    if (isSaved) {
      removeSavedPost(post.id);
    } else {
      addSavedPost(post);
    }
  };

  const score = activeTab === 'trending' ? post.metrics.trendingScore : post.metrics.topScore;
  const scoreLabel = activeTab === 'trending' ? 'Trending Score' : 'Top Score';
  const ScoreIcon = activeTab === 'trending' ? TrendingUp : Award;


  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
      {post.thumbnailUrl && (
        <div className="aspect-square relative">
            <Image src={post.thumbnailUrl} alt={post.caption} fill className="object-cover" />
            <div className="absolute top-2 right-2">
              <MediaTypeIndicator type={post.mediaType} />
            </div>
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between">
          <a href={`https://instagram.com/${post.author}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mb-2 group">
            <div className="p-1.5 bg-secondary rounded-full">
              <Instagram className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <CardDescription className="font-medium text-xs uppercase tracking-wider group-hover:text-primary transition-colors">
              @{post.author}
            </CardDescription>
          </a>
          <span className="text-xs text-muted-foreground">{timeAgo(post.publishedAt)} ago</span>
        </div>
        <CardDescription className="text-sm line-clamp-3 h-[3.75rem]">
          <a href={post.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {post.caption}
          </a>
        </CardDescription>
      </CardHeader>
      
      <CardFooter className="flex-col items-start gap-4 mt-auto">
        <div className="w-full flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex gap-4 items-center">
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
          {score !== undefined && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 font-semibold text-primary cursor-pointer">
                  <ScoreIcon className="w-4 h-4" />
                  <span>{score.toFixed(1)}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{scoreLabel}: {score.toFixed(1)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          )}
        </div>
        <div className="w-full border-t pt-3 flex">
            <Button variant={isSaved ? "secondary" : "ghost"} size="sm" className="flex-1 justify-center" onClick={handleSaveClick}>
                {isSaved ? <BookmarkCheck className="mr-2"/> : <Save className="mr-2"/>}
                {isSaved ? "Saved" : "Save"}
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

PostCard.Skeleton = function PostCardSkeleton() {
    return (
        <Card className="flex flex-col">
            <Skeleton className="aspect-square w-full" />
            <CardHeader>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-4 w-10" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardFooter className="flex-col items-start gap-3 mt-auto">
                <div className="w-full flex justify-between items-center">
                    <div className="flex gap-4">
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-5 w-12" />
                    </div>
                    <Skeleton className="h-6 w-10" />
                </div>
                <div className="w-full border-t pt-3 flex">
                    <Skeleton className="h-9 w-full" />
                </div>
            </CardFooter>
        </Card>
    )
}
