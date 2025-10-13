'use server';
/**
 * @fileOverview A file for initializing the Genkit AI instance.
 */
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI(),
  ],
  logLevel: 'debug',
  enableTracing: true,
});
