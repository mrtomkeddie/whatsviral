
import type { InstagramPost } from './types';

export const demoInstagramPosts: InstagramPost[] = [
  {
    id: 'ig1',
    platform: 'instagram',
    caption: 'Exploring the beautiful mountains of Switzerland! #travel #nature #adventure',
    author: '@swiss.explorer',
    url: 'https://www.instagram.com',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    metrics: {
      likes: 1200,
      comments: 80,
      trendingScore: 95.5,
    },
    thumbnailUrl: 'https://picsum.photos/seed/ig1/480/480',
    mediaType: 'IMAGE',
  },
   {
    id: 'ig2',
    platform: 'instagram',
    caption: 'Unboxing a classic. The sound of nostalgia!',
    author: '@console.classics',
    url: 'https://www.instagram.com',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    metrics: {
      likes: 5400,
      comments: 250,
      trendingScore: 88.2,
    },
    thumbnailUrl: 'https://picsum.photos/seed/ig2/480/480',
    mediaType: 'VIDEO',
  },
  {
    id: 'ig3',
    platform: 'instagram',
    caption: 'My cozy desk setup for a productive week. #wfh #desksetup #productivity',
    author: '@codeandcoffee',
    url: 'https://www.instagram.com',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    metrics: {
      likes: 8000,
      comments: 400,
      trendingScore: 91.0,
    },
    thumbnailUrl: 'https://picsum.photos/seed/ig3/480/480',
    mediaType: 'IMAGE',
  },
  {
    id: 'ig4',
    platform: 'instagram',
    caption: 'A quick tutorial on how to make the perfect latte art. ☕️ #latteart #coffee #tutorial',
    author: '@barista.daily',
    url: 'https://www.instagram.com',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    metrics: {
      likes: 2500,
      comments: 150,
      trendingScore: 98.1,
    },
    thumbnailUrl: 'https://picsum.photos/seed/ig4/480/480',
    mediaType: 'VIDEO',
  },
];
