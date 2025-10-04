
import { z } from 'zod';

// Types for the Instagram Viral Content Finder

export type InstagramPost = {
  id: string;
  platform: 'instagram';
  caption: string;
  author: string;
  url: string;
  publishedAt: string;
  metrics: {
    likes?: number;
    comments?: number;
    trendingScore?: number;
  };
  thumbnailUrl?: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
};

// Schema for searchContent flow input
export const SearchContentInputSchema = z.object({
  hashtag: z.string(),
  mode: z.enum(['trending', 'top']),
});
export type SearchContentInput = z.infer<typeof SearchContentInputSchema>;

// Schema for searchContent flow output
export const SearchContentOutputSchema = z.object({
  posts: z.array(z.custom<InstagramPost>()),
});
export type SearchContentOutput = z.infer<typeof SearchContentOutputSchema>;
