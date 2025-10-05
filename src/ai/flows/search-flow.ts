
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
  type Mention,
  type RelatedHashtag,
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
      const authorFollowers = post.authorFollowers || 10000; // Assume 10k followers if not provided

      const topScore = likes + (2 * comments);
      const trendingScore = topScore / ageHours;

      // Calculate engagement rate relative to author's followers
      const engagementRate = authorFollowers > 0 ? ((likes + comments) / authorFollowers) * 100 : 0;

      return {
        ...post,
        metrics: {
          ...post.metrics,
          trendingScore: parseFloat(trendingScore.toFixed(1)),
          topScore: parseFloat(topScore.toFixed(1)),
          engagementRate: parseFloat(engagementRate.toFixed(2)),
        }
      };
    });

    const results = processedPosts.sort((a, b) => {
        if (input.mode === 'trending') {
            return (b.metrics.trendingScore || 0) - (a.metrics.trendingScore || 0);
        }
        return (b.metrics.topScore || 0) - (a.metrics.topScore || 0);
    });

    // Calculate insights
    const totalPosts = results.length;
    const totalEngagementRate = results.reduce((sum, post) => sum + (post.metrics.engagementRate || 0), 0);
    const avgEngagementRate = totalPosts > 0 ? totalEngagementRate / totalPosts : 0;

    const mentionCounts: Record<string, number> = {};
    const hashtagCounts: Record<string, number> = {};
    const mentionRegex = /@(\w[\w.]*\w)/g;
    const hashtagRegex = /#(\w+)/g;

    results.forEach(post => {
      let match;
      while ((match = mentionRegex.exec(post.caption)) !== null) {
        const username = match[1];
        mentionCounts[username] = (mentionCounts[username] || 0) + 1;
      }
      while ((match = hashtagRegex.exec(post.caption)) !== null) {
        const hashtag = match[1].toLowerCase();
        if (hashtag !== input.hashtag.replace('#','').toLowerCase()) {
            hashtagCounts[hashtag] = (hashtagCounts[hashtag] || 0) + 1;
        }
      }
    });

    const topMentionedUsers: Mention[] = Object.entries(mentionCounts)
      .map(([username, count]) => ({ username, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const topRelatedHashtags: RelatedHashtag[] = Object.entries(hashtagCounts)
      .map(([hashtag, count]) => ({ hashtag: `#${hashtag}`, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      posts: results,
      insights: {
        totalPosts: demoInstagramPosts.length, // In a real scenario this would be a larger number from the API
        avgEngagementRate: parseFloat(avgEngagementRate.toFixed(2)),
        topMentionedUsers,
        topRelatedHashtags,
      },
    };
  }
);
