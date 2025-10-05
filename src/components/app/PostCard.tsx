
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
  Plus,
} from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import Image from 'next/image';
import { Button } from '../ui/button';
import { useSavedPosts } from '@/context/SavedPostsContext';
import { Badge } from '../ui/badge';
import React from 'react';
import { SaveToCollectionDialog } from './SaveToCollectionDialog';
import { cn } from '@/lib/utils';

function formatMetric(num?: number): string {
    if (num === undefined) return '0';
    if (num < 1000) return num.toString();
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
    return `${(num / 1000000).toFixed(1)}M`;
}

function TimeAgo({ dateString }: { dateString: string }) {
    const [ago, setAgo] = React.useState('');

    React.useEffect(() => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) {
            setAgo(`${Math.floor(interval)}y ago`);
            return;
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            setAgo(`${Math.floor(interval)}mo ago`);
            return;
        }
        interval = seconds / 86400;
        if (interval > 1) {
            setAgo(`${Math.floor(interval)}d ago`);
            return;
        }
        interval = seconds / 3600;
        if (interval > 1) {
            setAgo(`${Math.floor(interval)}h ago`);
            return;
        }
        interval = seconds / 60;
        if (interval > 1) {
            setAgo(`${Math.floor(interval)}m ago`);
            return;
        }
        setAgo(`${Math.floor(seconds)}s ago`);
    }, [dateString]);

    return <>{ago}</>;
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

function PerformanceBadge({ score }: { score: number }) {
  let variant: 'default' | 'secondary' | 'destructive' = 'secondary';
  let text = 'Normal';
  let className = '';

  if (score >= 350) {
    variant = 'default';
    text = 'Viral';
    className = 'bg-green-500/20 text-green-400 border-green-500/30';
  } else if (score >= 150) {
    variant = 'secondary';
    text = 'Rising';
    className = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  } else {
     className = 'bg-muted text-muted-foreground border-border';
  }

  return (
    <Badge variant="outline" className={cn('font-semibold', className)}>
      {text}
    </Badge>
  )
}

export function PostCard({ post, activeTab }: { post: InstagramPost, activeTab: 'trending' | 'top' }) {
  const { savedPosts, addSavedPost, removeSavedPost } = useSavedPosts();
  const [isSaveDialogOpen, setSaveDialogOpen] = React.useState(false);
  const isSaved = savedPosts.some(p => p.id === post.id);

  const score = activeTab === 'trending' ? post.metrics.trendingScore : post.metrics.topScore;
  const scoreLabel = activeTab === 'trending' ? 'Trending Score' : 'Top Score';
  const ScoreIcon = activeTab === 'trending' ? TrendingUp : Award;

  const scoreDescription = activeTab === 'trending' 
    ? 'Based on recent engagement velocity (likes & comments over time). Higher scores mean the post is gaining popularity quickly.'
    : 'Based on total engagement (likes & comments). Higher scores indicate strong overall performance.';


  return (
    <>
    <Card className="flex flex-col transition-all hover:shadow-xl hover:-translate-y-1">
      {post.thumbnailUrl && (
        <div className="aspect-square relative">
            <Image src={post.thumbnailUrl} alt={post.caption} fill className="object-cover" />
            <div className="absolute top-2 right-2 flex flex-col items-end gap-2">
              <MediaTypeIndicator type={post.mediaType} />
              {post.metrics.topScore && <PerformanceBadge score={post.metrics.topScore} />}
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
          <span className="text-xs text-muted-foreground"><TimeAgo dateString={post.publishedAt} /></span>
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
                <div className="max-w-xs p-1">
                  <p className="font-bold text-base mb-1">{scoreLabel}: {score.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">{scoreDescription}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          )}
        </div>
        <div className="w-full border-t pt-3 flex">
            <Button variant={isSaved ? "secondary" : "ghost"} size="sm" className="flex-1 justify-center" onClick={() => setSaveDialogOpen(true)}>
                {isSaved ? <BookmarkCheck className="mr-2"/> : <Save className="mr-2"/>}
                {isSaved ? "Saved" : "Save"}
            </Button>
        </div>
      </CardFooter>
    </Card>
    <SaveToCollectionDialog 
        isOpen={isSaveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        post={post}
    />
    </>
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
