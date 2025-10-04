
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
    // For now, we'll return mock data.
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const results = demoInstagramPosts.sort((a, b) => {
        if (input.mode === 'trending') {
            return (b.metrics.trendingScore || 0) - (a.metrics.trendingScore || 0);
        }
        return (b.metrics.likes || 0) - (a.metrics.likes || 0);
    });

    return {
      posts: results,
    };
  }
);
