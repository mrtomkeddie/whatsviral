import type { Post } from './types';

export const demoPosts: Post[] = [
  // YouTube Posts
  {
    id: 'yt1',
    platform: 'youtube',
    title: 'The Hidden History of the Sega Dreamcast',
    author: 'Gaming Historian',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    metrics: {
      views: 250000,
      likes: 15000,
      comments: 2000,
    },
    thumbnailUrl: 'https://picsum.photos/seed/yt1/480/360',
  },
  {
    id: 'yt2',
    platform: 'youtube',
    title: 'I Built a Retro Gaming PC for $100',
    author: 'LGR',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    metrics: {
      views: 750000,
      likes: 45000,
      comments: 5000,
    },
    thumbnailUrl: 'https://picsum.photos/seed/yt2/480/360',
  },
  // Reddit Posts
  {
    id: 'rd1',
    platform: 'reddit',
    title: 'Found my old Game Boy Color, still works!',
    author: 'u/retro-enthusiast',
    url: 'https://www.reddit.com',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    metrics: {
      upvotes: 2500,
      comments: 300,
    },
    thumbnailUrl: 'https://picsum.photos/seed/rd1/480/360',
  },
  {
    id: 'rd2',
    platform: 'reddit',
    title: 'What\'s a "retro" game that\'s actually not that old?',
    author: 'u/asky-gamer',
    url: 'https://www.reddit.com',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    metrics: {
      upvotes: 5000,
      comments: 1200,
    },
    thumbnailUrl: 'https://picsum.photos/seed/rd2/480/360',
  },
  // Instagram Posts
  {
    id: 'ig1',
    platform: 'instagram',
    title: 'My setup for #retrogaming night! #sega #nintendo',
    author: '@pixelated.dreams',
    url: 'https://www.instagram.com',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    metrics: {
      likes: 1200,
      comments: 80,
      trendingScore: 95.5,
    },
    thumbnailUrl: 'https://picsum.photos/seed/ig1/480/480',
  },
   {
    id: 'ig2',
    platform: 'instagram',
    title: 'Unboxing a classic. The sound of nostalgia!',
    author: '@console.classics',
    url: 'https://www.instagram.com',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    metrics: {
      likes: 5400,
      comments: 250,
      trendingScore: 88.2,
    },
    thumbnailUrl: 'https://picsum.photos/seed/ig2/480/480',
  },
];
