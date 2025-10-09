'use server';
/**
 * @fileOverview A file for initializing the Genkit AI instance.
 */
import {genkit, configureGenkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
    }),
  ],
});

configureGenkit({
  logLevel: 'debug',
  enableTracing: true,
});
