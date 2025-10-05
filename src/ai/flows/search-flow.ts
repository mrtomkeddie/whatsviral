
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
  type InstagramPost,
} from '@/lib/types';
import { extractContentMetadata } from './extract-content-metadata';

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

    const enrichedPosts = await Promise.all(
        demoInstagramPosts.map(async (post) => {
            try {
                const metadata = await extractContentMetadata({ text: post.caption });
                return { ...post, ...metadata };
            } catch (error) {
                console.error(`Failed to get metadata for post ${post.id}`, error);
                return post;
            }
        })
    );


    const processedPosts = enrichedPosts.map(post => {
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
    const totalLikes = results.reduce((sum, post) => sum + (post.metrics.likes || 0), 0);
    const totalComments = results.reduce((sum, post) => sum + (post.metrics.comments || 0), 0);
    const totalPosts = results.length;
    const avgLikes = totalPosts > 0 ? totalLikes / totalPosts : 0;
    const avgComments = totalPosts > 0 ? totalComments / totalPosts : 0;
    
    const formatCounts: Record<string, number> = {};
    results.forEach(post => {
        formatCounts[post.mediaType] = (formatCounts[post.mediaType] || 0) + 1;
    });

    const topFormat = Object.entries(formatCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

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
        avgLikes: Math.round(avgLikes),
        avgComments: Math.round(avgComments),
        topFormat: topFormat as InstagramPost['mediaType'] | 'N/A',
        topMentionedUsers,
        topRelatedHashtags,
      },
    };
  }
);
