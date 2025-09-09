'use server';

/**
 * @fileOverview A patient report generation AI agent.
 *
 * - generatePatientReport - A function that handles the patient report generation process.
 * - GeneratePatientReportInput - The input type for the generatePatientReport function.
 * - GeneratePatientReportOutput - The return type for the generatePatientReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePatientReportInputSchema = z.object({
  scanImage: z
    .string()
    .describe(
      "An eye scan image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  aiFindings: z.string().describe('The AI findings from the eye scan analysis.'),
  riskAssessment: z.string().describe('The risk assessment based on the AI analysis.'),
  patientHistory: z.string().describe('The patient history for longitudinal analysis.'),
});
export type GeneratePatientReportInput = z.infer<typeof GeneratePatientReportInputSchema>;

const GeneratePatientReportOutputSchema = z.object({
  report: z.string().describe('The comprehensive patient report.'),
});
export type GeneratePatientReportOutput = z.infer<typeof GeneratePatientReportOutputSchema>;

export async function generatePatientReport(input: GeneratePatientReportInput): Promise<GeneratePatientReportOutput> {
  return generatePatientReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePatientReportPrompt',
  input: {schema: GeneratePatientReportInputSchema},
  output: {schema: GeneratePatientReportOutputSchema},
  prompt: `You are an expert medical scribe specializing in ophthalmology.

You will use the AI findings, risk assessment, patient history, and scan image to generate a comprehensive patient report.

AI Findings: {{{aiFindings}}}
Risk Assessment: {{{riskAssessment}}}
Patient History: {{{patientHistory}}}
Scan Image: {{media url=scanImage}}

Generate a detailed patient report including the above information.`,
});

const generatePatientReportFlow = ai.defineFlow(
  {
    name: 'generatePatientReportFlow',
    inputSchema: GeneratePatientReportInputSchema,
    outputSchema: GeneratePatientReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
