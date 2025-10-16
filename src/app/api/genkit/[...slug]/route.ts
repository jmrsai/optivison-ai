/**
 * @fileoverview This file is the entrypoint for Genkit actions in a Next.js app.
 */
import { nextHandler } from '@genkit-ai/next';
import '@/ai/flows';

export const GET = nextHandler();
export const POST = nextHandler();
