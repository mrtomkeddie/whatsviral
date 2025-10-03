
import { z } from 'zod';

// Types for the Viral Content Finder will be defined here.

export type Post = {
  id: string;
  platform: 'youtube' | 'reddit' | 'instagram';
  title: string;
  author: string;
  url: string;
  publishedAt: string;
  metrics: {
    views?: number;
    likes?: number;
    comments?: number;
    upvotes?: number;
    engagementRate?: number;
    trendingScore?: number;
  };
  thumbnailUrl?: string;
};

// Schema for searchContent flow input
export const SearchContentInputSchema = z.object({
  platform: z.enum(['youtube', 'reddit', 'instagram']),
  query: z.string(),
  searchMode: z.string(),
});
export type SearchContentInput = z.infer<typeof SearchContentInputSchema>;

// Schema for searchContent flow output
export const SearchContentOutputSchema = z.object({
  posts: z.array(z.custom<Post>()),
});
export type SearchContentOutput = z.infer<typeof SearchContentOutputSchema>;
