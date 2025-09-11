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
    .describe("The patient's medical history related to eye health."),
  clinicalNotes: z
    .string()
    .optional()
    .describe('Any clinical notes or observations about the patient.'),
});
export type AnalyzeEyeScanInput = z.infer<typeof AnalyzeEyeScanInputSchema>;

const AnalyzeEyeScanOutputSchema = z.object({
  diagnosticInsights: z
    .string()
    .describe('A detailed summary of diagnostic insights based on the eye scan analysis.'),
  potentialAbnormalities: z
    .array(z.string())
    .describe('A list of potential abnormalities or diseases identified in the eye scan (e.g., Glaucoma, Diabetic Retinopathy, Macular Degeneration).'),
  earlySigns: z
    .array(z.string())
    .describe('A list of any subtle or early signs of disease detected.'),
  diseaseStaging: z
    .string()
    .optional()
    .describe('If a disease is identified, provide its stage (e.g., "Early-stage", "Moderate", "Advanced").'),
  treatmentSuggestions: z
    .array(z.string())
    .describe('A list of suggested treatments or management plans based on the diagnosis.'),
  confidenceLevel: z
    .number()
    .describe('The confidence level of the AI in its analysis (from 0 to 1).'),
  recommendations: z
    .string()
    .describe('Recommendations for next steps, such as follow-up tests or specialist referrals.'),
});
export type AnalyzeEyeScanOutput = z.infer<typeof AnalyzeEyeScanOutputSchema>;

export async function analyzeEyeScan(input: AnalyzeEyeScanInput): Promise<AnalyzeEyeScanOutput> {
  return analyzeEyeScanFlow(input);
}

const analyzeEyeScanPrompt = ai.definePrompt({
  name: 'analyzeEyeScanPrompt',
  input: {schema: AnalyzeEyeScanInputSchema},
  output: {schema: AnalyzeEyeScanOutputSchema},
  prompt: `You are an expert ophthalmologist AI. Your task is to conduct a comprehensive, A-to-Z analysis of an eye scan image. Provide a detailed diagnosis, identify early signs of disease, suggest treatments, and estimate the stage of any detected conditions.

Patient History: {{{patientHistory}}}
Clinical Notes: {{{clinicalNotes}}}
Eye Scan: {{media url=eyeScanDataUri}}

Based on all the provided information, perform a full diagnostic analysis. Fill out all fields in the output schema, including diagnostic insights, potential abnormalities, early signs of disease, disease staging (if applicable), treatment suggestions, a confidence level, and recommendations for next steps.`,
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
