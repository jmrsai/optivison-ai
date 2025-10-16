'use server';
/**
 * @fileoverview This file is for local development of Genkit flows and is not used in production.
 */
import { config } from 'dotenv';
config();

import '@/ai/flows';

console.log('Genkit development server started with all flows.');
