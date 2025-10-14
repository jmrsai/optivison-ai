/**
 * @fileoverview This file is the entrypoint for Genkit actions in a Next.js app.
 */
import { nextHandler } from '@genkit-ai/next';
import '@/ai/flows/ai-driven-diagnostics';
import '@/ai/flows/document-analysis';
import '@/ai/flows/generate-patient-report';
import '@/ai/flows/longitudinal-analysis';

export const GET = nextHandler();
export const POST = nextHandler();
