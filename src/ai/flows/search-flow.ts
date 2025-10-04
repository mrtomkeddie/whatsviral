
'use server';
/**
 * @fileOverview A flow for searching content from Instagram.
 *
 * - searchInstagramContent - A function that handles the content search process.
 */

import { ai } from '@/ai/genkit';
import { demoInstagramPosts } from '@/lib/demo-data';
import {
  SearchContentInputSchema,
  SearchContentOutputSchema,
  type SearchContentInput,
  type SearchContentOutput,
} from '@/lib/types';

export async function searchInstagramContent(input: SearchContentInput): Promise<SearchContentOutput> {
  return searchContentFlow(input);
}

const searchContentFlow = ai.defineFlow(
  {
    name: 'searchContentFlow',
    inputSchema: SearchContentInputSchema,
    outputSchema: SearchContentOutputSchema,
  },
  async (input) => {
    // This is where we'll eventually call the real Instagram Graph API.
    // For now, we'll return mock data with calculated scores.
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const processedPosts = demoInstagramPosts.map(post => {
      const likes = post.metrics.likes || 0;
      const comments = post.metrics.comments || 0;
      const ageHours = Math.max(1, (new Date().getTime() - new Date(post.publishedAt).getTime()) / (1000 * 60 * 60));

      const topScore = likes + (2 * comments);
      const trendingScore = topScore / ageHours;

      return {
        ...post,
        metrics: {
          ...post.metrics,
          trendingScore: parseFloat(trendingScore.toFixed(1)),
          topScore: parseFloat(topScore.toFixed(1)),
        }
      };
    });

    const results = processedPosts.sort((a, b) => {
        if (input.mode === 'trending') {
            return (b.metrics.trendingScore || 0) - (a.metrics.trendingScore || 0);
        }
        return (b.metrics.topScore || 0) - (a.metrics.topScore || 0);
    });

    return {
      posts: results,
    };
  }
);
