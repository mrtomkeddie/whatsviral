
'use server';
/**
 * @fileOverview A flow for searching content from different platforms.
 *
 * - searchContent - A function that handles the content search process.
 */

import { ai } from '@/ai/genkit';
import { demoPosts } from '@/lib/demo-data';
import {
  SearchContentInputSchema,
  SearchContentOutputSchema,
  type SearchContentInput,
  type SearchContentOutput,
} from '@/lib/types';

export async function searchContent(input: SearchContentInput): Promise<SearchContentOutput> {
  return searchContentFlow(input);
}

const searchContentFlow = ai.defineFlow(
  {
    name: 'searchContentFlow',
    inputSchema: SearchContentInputSchema,
    outputSchema: SearchContentOutputSchema,
  },
  async (input) => {
    // This is where we'll eventually call the real APIs.
    // For now, we'll return mock data based on the platform.
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const results = demoPosts.filter((p) => p.platform === input.platform);

    return {
      posts: results,
    };
  }
);
