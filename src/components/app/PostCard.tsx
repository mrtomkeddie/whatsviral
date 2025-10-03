"use client";

import type { Post } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Info, ThumbsUp, MessageCircle } from "lucide-react";
import { RedditIcon, YouTubeIcon } from "@/components/icons/PlatformIcons";
import { formatDistanceToNow } from "date-fns";
import { SparklineChart } from "./SparklineChart";

const platformIcons = {
  reddit: <RedditIcon className="h-5 w-5" />,
  youtube: <YouTubeIcon className="h-5 w-5" />,
};

const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
}

export function PostCard({ post }: { post: Post }) {
  const timeAgo = formatDistanceToNow(new Date(post.publishedAt), {
    addSuffix: true,
  });

  return (
    <TooltipProvider>
      <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1.5 border-transparent hover:border-primary/30 bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-4">
             <div className="p-2 bg-secondary rounded-full">
                {platformIcons[post.platform]}
             </div>
             <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0">
                        <Info className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs z-20">
                    <h4 className="font-bold mb-2">Why this is ranked</h4>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                        <li className="flex justify-between"><span>Momentum Score:</span> <span className="font-mono font-bold text-foreground">{post.momentum.score.toFixed(2)}</span></li>
                        <li className="flex justify-between"><span>Likes / hour:</span> <span className="font-mono text-foreground">+{post.momentum.likes_per_hour.toFixed(1)}</span></li>
                        <li className="flex justify-between"><span>Comments / hour:</span> <span className="font-mono text-foreground">+{post.momentum.comments_per_hour.toFixed(1)}</span></li>
                        <li className="flex justify-between"><span>Age Penalty:</span> <span className="font-mono text-foreground">-{post.momentum.age_penalty.toFixed(2)}</span></li>
                        <li className="flex justify-between"><span>Creator Size Norm:</span> <span className="font-mono text-foreground">x{post.momentum.creator_size_normalized_factor.toFixed(2)}</span></li>
                    </ul>
                </TooltipContent>
             </Tooltip>
          </div>
          <CardTitle className="text-base font-semibold leading-tight pt-2">
            <a href={post.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              {post.title}
            </a>
          </CardTitle>
          <CardDescription>by {post.author}</CardDescription>
        </CardHeader>

        <CardContent className="flex-grow space-y-4">
          <div className="bg-secondary p-3 rounded-md italic text-sm text-muted-foreground border border-border">
            "{post.hook}"
          </div>
          <div className="flex flex-wrap gap-2">
            {post.patternTags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="h-16 w-full">
            <SparklineChart data={post.engagementSnapshots} />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center text-xs text-muted-foreground bg-secondary/50 pt-4 border-t">
            <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><ThumbsUp className="w-3.5 h-3.5" /> {formatNumber(post.engagement.likes)}</span>
                <span className="flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5" /> {formatNumber(post.engagement.comments)}</span>
            </div>
            <span>{timeAgo}</span>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}
