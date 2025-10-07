'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const HashtagInsightPromptInputSchema = z.object({
  payload: z
    .string()
    .describe('Serialized JSON dataset used by the AI to generate the insight.'),
});
export type HashtagInsightPromptInput = z.infer<typeof HashtagInsightPromptInputSchema>;

const HashtagInsightPromptOutputSchema = z.object({
  insight: z.string().describe('One-sentence summary (<=240 chars) in plain language.'),
  suggested_hashtags: z.array(z.string()).describe('2–3 related tags from the list.'),
});
export type HashtagInsightPromptOutput = z.infer<typeof HashtagInsightPromptOutputSchema>;

const prompt = ai.definePrompt({
  name: 'generateHashtagInsightPrompt',
  input: { schema: HashtagInsightPromptInputSchema },
  output: { schema: HashtagInsightPromptOutputSchema },
  prompt: `
You are an Instagram analyst. Summarize the dataset in ONE sentence (max 240 chars).
Rules:
- Plain language. No emojis, no hashtags in text.
- If baseline provided, state up/down % vs baseline; else omit comparisons.
- Mention the top-performing format.
- If best_posting_window exists, include it.
- End with 2–3 suggested related tags from the list, comma-separated.

Return strict JSON:
{"insight":"...", "suggested_hashtags":["tag1","tag2","tag3"]}

DATA:
{{{payload}}}
`.trim(),
});

const generateHashtagInsightFlow = ai.defineFlow(
  {
    name: 'generateHashtagInsightFlow',
    inputSchema: HashtagInsightPromptInputSchema,
    outputSchema: HashtagInsightPromptOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function generateHashtagInsight(
  input: HashtagInsightPromptInput
): Promise<HashtagInsightPromptOutput> {
  return generateHashtagInsightFlow(input);
}