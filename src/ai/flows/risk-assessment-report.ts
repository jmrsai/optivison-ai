'use server';

/**
 * @fileOverview AI flow for generating a risk assessment report based on scan analysis.
 *
 * - generateRiskAssessmentReport - A function that generates a risk assessment report.
 * - RiskAssessmentInput - The input type for the generateRiskAssessmentReport function.
 * - RiskAssessmentOutput - The return type for the generateRiskAssessmentReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RiskAssessmentInputSchema = z.object({
  scanAnalysis: z
    .string()
    .describe('The analysis of the eye scan, including identified abnormalities and conditions.'),
  patientHistory: z
    .string()
    .optional()
    .describe('The patient history, including previous scans and AI findings.'),
});
export type RiskAssessmentInput = z.infer<typeof RiskAssessmentInputSchema>;

const RiskAssessmentOutputSchema = z.object({
  riskAssessmentReport: z.string().describe('The generated risk assessment report.'),
});
export type RiskAssessmentOutput = z.infer<typeof RiskAssessmentOutputSchema>;

export async function generateRiskAssessmentReport(
  input: RiskAssessmentInput
): Promise<RiskAssessmentOutput> {
  return riskAssessmentReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'riskAssessmentReportPrompt',
  input: {schema: RiskAssessmentInputSchema},
  output: {schema: RiskAssessmentOutputSchema},
  prompt: `You are an AI assistant that generates risk assessment reports for ophthalmology patients based on scan analysis and patient history.

  Given the following scan analysis and patient history, generate a risk assessment report that predicts the likelihood of disease progression to inform treatment plans and patient management. The risk assessment should include potential risks, severity, and recommendations.

  Scan Analysis: {{{scanAnalysis}}}
  Patient History: {{{patientHistory}}}
  `,
});

const riskAssessmentReportFlow = ai.defineFlow(
  {
    name: 'riskAssessmentReportFlow',
    inputSchema: RiskAssessmentInputSchema,
    outputSchema: RiskAssessmentOutputSchema,
  },
  async input => {
    // This flow is now largely superseded by the more detailed 'generatePatientReport' flow.
    // We can keep it for now or decide to deprecate it. For now, we'll just create a simple summary.
    
    const {output} = await prompt(input);
    return output!;
  }
);
