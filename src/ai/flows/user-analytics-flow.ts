
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
        return {
            profile: demoUserProfile,
        };
    }

    return {
      profile: null,
    };
  }
);
