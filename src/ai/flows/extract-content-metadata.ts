
'use server';

/**
 * @fileOverview An AI agent for extracting content metadata, including a short hook and pattern tags.
 *
 * - extractContentMetadata - A function that extracts content metadata from a given text.
 * - ExtractContentMetadataInput - The input type for the extractContentMetadata function.
 * - ExtractContentMetadataOutput - The return type for the extractContentMetadata function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractContentMetadataInputSchema = z.object({
  text: z.string().describe('The content to extract metadata from.'),
});
export type ExtractContentMetadataInput = z.infer<typeof ExtractContentMetadataInputSchema>;

const ExtractContentMetadataOutputSchema = z.object({
  hook: z
    .string()
    .describe('A short, engaging hook (<=15 words) summarizing the content.'),
  patternTags:
    z.array(z.string())
      .describe('An array of pattern tags (e.g., POV, listicle, tutorial) describing the content.'),
});
export type ExtractContentMetadataOutput = z.infer<typeof ExtractContentMetadataOutputSchema>;

export async function extractContentMetadata(
  input: ExtractContentMetadataInput
): Promise<ExtractContentMetadataOutput> {
  return extractContentMetadataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractContentMetadataPrompt',
  input: {schema: ExtractContentMetadataInputSchema},
  output: {schema: ExtractContentMetadataOutputSchema},
  prompt: `You are an AI assistant that extracts content metadata from text.

  Given the following text, extract a short hook (<=15 words) that summarizes the core idea of the content, and identify relevant pattern tags that describe the content's format.

  Text: {{{text}}}

  Respond in a JSON format.
  {
    "hook": "[short hook summarizing the content]",
    "patternTags": ["tag1", "tag2", "tag3"]
  }

  Available pattern tags: POV, listicle, meme, reaction, tutorial, countdown, storytime, green-screen.
  `,
});

const extractContentMetadataFlow = ai.defineFlow(
  {
    name: 'extractContentMetadataFlow',
    inputSchema: ExtractContentMetadataInputSchema,
    outputSchema: ExtractContentMetadataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
