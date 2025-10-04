
'use server';
/**
 * @fileOverview A flow for fetching Instagram user analytics.
 *
 * - getUserAnalytics - A function that handles the user analytics search process.
 */

import { ai } from '@/ai/genkit';
import { demoUserProfile } from '@/lib/demo-data';
import {
  UserAnalyticsInputSchema,
  UserAnalyticsOutputSchema,
  type UserAnalyticsInput,
  type UserAnalyticsOutput,
  type Mention
} from '@/lib/types';

export async function getUserAnalytics(input: UserAnalyticsInput): Promise<UserAnalyticsOutput> {
  return userAnalyticsFlow(input);
}

const userAnalyticsFlow = ai.defineFlow(
  {
    name: 'userAnalyticsFlow',
    inputSchema: UserAnalyticsInputSchema,
    outputSchema: UserAnalyticsOutputSchema,
  },
  async (input) => {
    // This is where we'll eventually call the real Instagram Graph API.
    // For now, we'll return mock data if the username matches the demo.
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (input.username.toLowerCase() === 'travel.junkie') {
        const profile = { ...demoUserProfile };

        // Process captions to find mentions
        const mentionCounts: Record<string, number> = {};
        const mentionRegex = /@(\w[\w.]*\w)/g;

        profile.recentPosts.forEach(post => {
            const matches = post.caption.match(mentionRegex);
            if (matches) {
                matches.forEach(mention => {
                    const username = mention.substring(1); // remove '@'
                    mentionCounts[username] = (mentionCounts[username] || 0) + 1;
                });
            }
        });

        const topMentions: Mention[] = Object.entries(mentionCounts)
            .map(([username, count]) => ({ username, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // Get top 5

        profile.topMentions = topMentions;

        return {
            profile,
        };
    }

    return {
      profile: null,
    };
  }
);
