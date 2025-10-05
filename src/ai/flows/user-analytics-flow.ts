
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
  type Mention,
  type InstagramPost,
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

        // Calculate derived analytics
        const totalLikes = profile.recentPosts.reduce((sum, post) => sum + (post.metrics.likes || 0), 0);
        const totalComments = profile.recentPosts.reduce((sum, post) => sum + (post.metrics.comments || 0), 0);
        profile.avgLikes = profile.recentPosts.length > 0 ? Math.round(totalLikes / profile.recentPosts.length) : 0;
        profile.avgComments = profile.recentPosts.length > 0 ? Math.round(totalComments / profile.recentPosts.length) : 0;

        // Posting Frequency
        if (profile.recentPosts.length > 1) {
            const sortedPosts = [...profile.recentPosts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
            const diffs = [];
            for (let i = 0; i < sortedPosts.length - 1; i++) {
                const diff = new Date(sortedPosts[i].publishedAt).getTime() - new Date(sortedPosts[i + 1].publishedAt).getTime();
                diffs.push(diff);
            }
            const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
            const avgDays = avgDiff / (1000 * 60 * 60 * 24);
            profile.postingFrequency = `1 post every ${Math.round(avgDays)} days`;
        } else {
            profile.postingFrequency = "N/A";
        }

        // Most Engaged Post
        let mostEngagedPost: InstagramPost | undefined = undefined;
        let maxEngagement = -1;
        profile.recentPosts.forEach(post => {
            const engagement = (post.metrics.likes || 0) + (post.metrics.comments || 0);
            if (engagement > maxEngagement) {
                maxEngagement = engagement;
                mostEngagedPost = post;
            }
        });
        profile.mostEngagedPost = mostEngagedPost;

        return {
            profile,
        };
    }

    return {
      profile: null,
    };
  }
);
