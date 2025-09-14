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
  differentialDiagnosis: z.array(z.string()).describe('A list of possible alternative diagnoses to consider.'),
  earlySigns: z
    .array(z.string())
    .describe('A list of any subtle or early signs of disease detected. Focus on early detection.'),
  preventionSuggestions: z
    .array(z.string())
    .describe('A list of suggested preventive measures based on the findings.'),
  diseaseStaging: z
    .string()
    .optional()
    .describe('If a disease is identified, provide its stage (e.g., "Early-stage", "Moderate", "Advanced").'),
  riskAssessment: z
    .string()
    .describe('An assessment of the patient’s risk for disease progression or developing new conditions.'),
  riskLevel: z.enum(['Low', 'Medium', 'High', 'N/A']).describe("The patient's overall risk level based on the analysis. Must be 'Low', 'Medium', or 'High'."),
  treatmentSuggestions: z
    .array(z.string())
    .describe('A list of suggested treatments or management plans based on the diagnosis.'),
  followUpPlan: z
    .string()
    .describe('A detailed plan for patient follow-up, including recommended tests and timelines.'),
  confidenceLevel: z
    .number()
    .describe('The confidence level of the AI in its analysis (from 0 to 1).'),
  recommendations: z
    .string()
    .describe('Recommendations for next steps, such as specialist referrals.'),
});
export type AnalyzeEyeScanOutput = z.infer<typeof AnalyzeEyeScanOutputSchema>;

export async function analyzeEyeScan(input: AnalyzeEyeScanInput): Promise<AnalyzeEyeScanOutput> {
  return analyzeEyeScanFlow(input);
}

const analyzeEyeScanPrompt = ai.definePrompt({
  name: 'analyzeEyeScanPrompt',
  input: {schema: AnalyzeEyeScanInputSchema},
  output: {schema: AnalyzeEyeScanOutputSchema},
  prompt: `You are an expert ophthalmologist AI. Your task is to conduct a comprehensive, A-to-Z analysis of an eye scan image. Provide a detailed diagnosis, identify early signs of disease, suggest treatments and prevention strategies, and estimate the stage of any detected conditions.

Patient History: {{{patientHistory}}}
Clinical Notes: {{{clinicalNotes}}}
Eye Scan: {{media url=eyeScanDataUri}}

Based on all the provided information, perform a full diagnostic analysis. Pay special attention to early detection of diseases. Fill out all fields in the output schema, including diagnostic insights, potential abnormalities, differential diagnosis, early signs of disease, prevention suggestions, disease staging (if applicable), a detailed risk assessment, a risk level ('Low', 'Medium', or 'High'), treatment suggestions, a detailed follow-up plan, a confidence level, and recommendations for next steps.`,
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
