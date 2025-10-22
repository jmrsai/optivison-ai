'use server';

/**
 * @fileOverview A simple "hello world" flow to demonstrate basic Genkit functionality.
 *
 * - helloFlow - A function that returns a personalized greeting from the AI.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export async function helloFlow(name: string): Promise<string> {
  const { output } = await simpleHelloFlow(name);
  return output || '';
}

const simpleHelloFlow = ai.defineFlow(
  {
    name: 'helloFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (name) => {
    const { output } = await ai.generate({
      prompt: `You are a friendly AI assistant. Say hello to ${name}.`,
      model: 'gemini-1.5-flash',
    });
    return output || `Hello, ${name}!`;
  }
);
