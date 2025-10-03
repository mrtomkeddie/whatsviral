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
