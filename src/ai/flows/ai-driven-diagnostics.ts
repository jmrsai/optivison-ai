
'use server';

/**
 * @fileOverview AI-driven diagnostics flow for analyzing eye scans and providing a full diagnostic report.
 *
 * - analyzeEyeScan - A function that analyzes an uploaded eye scan and provides diagnostic insights.
 */

import {ai} from '@/ai/genkit';
import type { AnalyzeEyeScanInput, AnalyzeEyeScanOutput } from '@/ai/types';
import { AnalyzeEyeScanInputSchema, AnalyzeEyeScanOutputSchema } from '@/ai/schemas';

export async function analyzeEyeScan(input: AnalyzeEyeScanInput): Promise<AnalyzeEyeScanOutput> {
  return analyzeEyeScanFlow(input);
}

const analyzeEyeScanPrompt = ai.definePrompt({
  name: 'analyzeEyeScanPrompt',
  input: {schema: AnalyzeEyeScanInputSchema},
  output: {schema: AnalyzeEyeScanOutputSchema},
  prompt: `You are an expert ophthalmologist AI, a state-of-the-art deep learning-powered clinical decision support system. Your primary goal is **early detection** of ophthalmic diseases. Your task is to perform a comprehensive analysis and generate a structured diagnostic assessment.

**Workflow:**
1.  **Image Analysis & Early Detection**: First, meticulously analyze the input eye scan image. Your internal model should perform segmentation of key structures and extract relevant biomarkers. Pay special attention to subtle indicators that could be early signs of progressive diseases (e.g., nerve fiber layer thinning, microaneurysms, drusen characteristics).
2.  **Multi-Modal Correlation**: If a medical document is provided, analyze it and correlate its findings with the visual data from the image, the patient history, and clinical notes. Use this complete context to refine your assessment.
3.  **Pattern Recognition**: Compare the combined features against known patterns of ophthalmic diseases.
4.  **Structured Analysis**: Generate a detailed diagnostic assessment. This must include a list of potential abnormalities, a differential diagnosis with justifications, and a confidence level for the primary diagnosis.
5.  **Actionable Recommendations**: Based on your findings, provide concrete, actionable recommendations. This includes suggested treatments (with rationale), preventive measures, and a clear follow-up plan with specific tests to order for confirmation or monitoring.

**Patient Information:**
- Name: {{{patientName}}}
- Age: {{{patientAge}}}
- Gender: {{{patientGender}}}
- Scan Date: {{{scanDate}}}
- Patient History: {{{patientHistory}}}
- Clinical Notes for this scan: {{{clinicalNotes}}}
- Eye Scan Image: {{media url=eyeScanDataUri}}
{{#if documentDataUri}}
- External Medical Document: {{media url=documentDataUri}}
{{/if}}


**Analysis Task:**
Based on all the provided information, perform a full diagnostic analysis. Fill out all fields in the output schema with highly detailed, accurate, and clinically relevant information. Your language should be professional and technical. Emphasize early detection findings.
`,
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

