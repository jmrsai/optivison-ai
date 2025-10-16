'use server';

/**
 * @fileOverview AI-driven diagnostics flow for analyzing eye scans and providing diagnostic insights.
 *
 * - analyzeEyeScan - A function that analyzes an uploaded eye scan and provides diagnostic insights.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { AnalyzeEyeScanInput, AnalyzeEyeScanOutput } from '@/ai/types';
import { AnalyzeEyeScanInputSchema, AnalyzeEyeScanOutputSchema } from '@/ai/schemas';

export async function analyzeEyeScan(input: AnalyzeEyeScanInput): Promise<AnalyzeEyeScanOutput> {
  return analyzeEyeScanFlow(input);
}

const analyzeEyeScanPrompt = ai.definePrompt({
  name: 'analyzeEyeScanPrompt',
  input: {schema: AnalyzeEyeScanInputSchema},
  output: {schema: AnalyzeEyeScanOutputSchema},
  prompt: `You are an expert ophthalmologist AI, a state-of-the-art deep learning-powered clinical decision support system. Your task is to perform a comprehensive, A-to-Z analysis of an eye scan image, correlating it with patient history and any provided medical documents.

**Workflow:**
1.  **Image Analysis**: First, meticulously analyze the input eye scan image. Your internal model should perform segmentation of key structures (optic nerve, macula, blood vessels) and extract relevant features and biomarkers.
2.  **Correlate with Textual Data**: Next, correlate the visual findings from the image with the provided patient history, clinical notes, and the analysis from any external medical document. Use this context to refine your initial assessment.
3.  **Pattern Recognition**: Compare the combined features against known patterns of ophthalmic diseases.
4.  **Diagnosis and Reporting**: Finally, generate a detailed report based on your complete, synthesized analysis of all available information.

**Patient Information:**
- Patient History: {{{patientHistory}}}
- Clinical Notes: {{{clinicalNotes}}}
- Eye Scan: {{media url=eyeScanDataUri}}

{{#if documentAnalysis}}
**External Medical Document Analysis Summary:**
- Diagnoses Mentioned: {{#if documentAnalysis.diagnoses.length}} {{#each documentAnalysis.diagnoses}} {{{this}}}{{#unless @last}}, {{/unless}}{{/each}} {{else}}None{{/if}}
- Medications Mentioned: {{#if documentAnalysis.medications.length}} {{#each documentAnalysis.medications}} {{{this}}}{{#unless @last}}, {{/unless}}{{/each}} {{else}}None{{/if}}
- Key Recommendations: {{{documentAnalysis.recommendations}}}
{{/if}}


**Analysis Task:**
Based on the provided information and following the workflow above, perform a full diagnostic analysis. Pay special attention to early detection of diseases by identifying subtle biomarkers. Fill out all fields in the output schema with highly detailed, accurate, and clinically relevant information. Your language should be professional and technical, suitable for a medical expert. Reference the deep learning model's findings (e.g., "segmentation reveals...", "feature extraction identified...").`,
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
