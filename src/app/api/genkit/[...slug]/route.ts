/**
 * @fileoverview This file is the entrypoint for Genkit actions in a Next.js app.
 */
import { genkitNextHandler } from '@genkit-ai/next';
import '@/ai/flows';

export const GET = genkitNextHandler();
export const POST = genkitNextHandler();
