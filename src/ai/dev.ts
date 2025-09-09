import { config } from 'dotenv';
config();

import '@/ai/flows/generate-patient-report.ts';
import '@/ai/flows/risk-assessment-report.ts';
import '@/ai/flows/ai-driven-diagnostics.ts';