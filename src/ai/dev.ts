/**
 * @fileoverview This file is for local development of Genkit flows and is not used in production.
 */
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-patient-report.ts';
import '@/ai/flows/ai-driven-diagnostics.ts';
import '@/ai/flows/longitudinal-analysis.ts';
import '@/ai/flows/document-analysis.ts';

console.log('Genkit development server started with all flows.');
