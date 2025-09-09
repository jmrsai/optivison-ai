// This is a server-side file.
'use server';

/**
 * @fileOverview AI-driven diagnostics flow for analyzing eye scans and providing diagnostic insights.
 *
 * - analyzeEyeScan - A function that analyzes an uploaded eye scan and provides diagnostic insights.
 * - AnalyzeEyeScanInput - The input type for the analyzeEyeScan function.
 * - AnalyzeEyeScanOutput - The return type for the analyzeEyeScan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeEyeScanInputSchema = z.object({
  eyeScanDataUri: z
    .string()
    .describe(
      "An eye scan image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  patientHistory: z
    .string()
    .optional()
    .describe('The patient\'s medical history related to eye health.'),
  clinicalNotes: z
    .string()
    .optional()
    .describe('Any clinical notes or observations about the patient.'),
});
export type AnalyzeEyeScanInput = z.infer<typeof AnalyzeEyeScanInputSchema>;

const AnalyzeEyeScanOutputSchema = z.object({
  diagnosticInsights: z
    .string()
    .describe('Diagnostic insights based on the eye scan analysis.'),
  potentialAbnormalities: z
    .array(z.string())
    .describe('A list of potential abnormalities identified in the eye scan.'),
  confidenceLevel: z
    .number()
    .describe('The confidence level of the AI in its analysis (0-1).'),
  recommendations: z
    .string()
    .describe('Recommendations based on the analysis.'),
});
export type AnalyzeEyeScanOutput = z.infer<typeof AnalyzeEyeScanOutputSchema>;

export async function analyzeEyeScan(input: AnalyzeEyeScanInput): Promise<AnalyzeEyeScanOutput> {
  return analyzeEyeScanFlow(input);
}

const analyzeEyeScanPrompt = ai.definePrompt({
  name: 'analyzeEyeScanPrompt',
  input: {schema: AnalyzeEyeScanInputSchema},
  output: {schema: AnalyzeEyeScanOutputSchema},
  prompt: `You are an expert ophthalmologist, and will analyze eye scans to identify potential abnormalities and provide diagnostic insights. Include a confidence level (0-1). Also provide recommendations based on the analysis.

Patient History: {{{patientHistory}}}
Clinical Notes: {{{clinicalNotes}}}
Eye Scan: {{media url=eyeScanDataUri}}

Based on the provided eye scan, patient history, and clinical notes, provide diagnostic insights, potential abnormalities, a confidence level, and recommendations.`, // changed from triple braces to double braces
});

const analyzeEyeScanFlow = ai.defineFlow(
  {
    name: 'analyzeEyeScanFlow',
    inputSchema: AnalyzeEyeScanInputSchema,
    outputSchema: AnalyzeEyeScanOutputSchema,
  },
  async input => {
    const {output} = await analyzeEyeScanPrompt(input);
    return output!;
  }
);
