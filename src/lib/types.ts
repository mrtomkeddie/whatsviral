
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
    topScore?: number;
  };
  thumbnailUrl?: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
};

export type InstagramUserProfile = {
  id: string;
  username: string;
  fullName: string;
  profilePictureUrl: string;
  followers: number;
  following: number;
  postCount: number;
  engagementRate: number;
  avgLikes: number;
  avgComments: number;
  recentPosts: InstagramPost[];
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


// Schema for user analytics flow input
export const UserAnalyticsInputSchema = z.object({
  username: z.string(),
});
export type UserAnalyticsInput = z.infer<typeof UserAnalyticsInputSchema>;

// Schema for user analytics flow output
export const UserAnalyticsOutputSchema = z.object({
  profile: z.custom<InstagramUserProfile>().nullable(),
});
export type UserAnalyticsOutput = z.infer<typeof UserAnalyticsOutputSchema>;
