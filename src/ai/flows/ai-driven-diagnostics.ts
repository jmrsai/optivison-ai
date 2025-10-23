
'use server';

/**
 * @fileOverview AI-driven diagnostics flow for analyzing eye scans and providing a full diagnostic report.
 *
 * - analyzeEyeScan - A function that analyzes an uploaded eye scan and provides diagnostic insights.
 */

import {ai} from '@/ai/genkit';
import type { AnalyzeEyeScanInput, AnalyzeEyeScanOutput, DocumentAnalysisOutput } from '@/ai/types';
import { AnalyzeEyeScanInputSchema, AnalyzeEyeScanOutputSchema } from '@/ai/schemas';
import { analyzeDocument } from './document-analysis';
import { z } from 'zod';

export async function analyzeEyeScan(input: AnalyzeEyeScanInput): Promise<AnalyzeEyeScanOutput> {
  return analyzeEyeScanFlow(input);
}

const analyzeEyeScanPrompt = ai.definePrompt({
  name: 'analyzeEyeScanPrompt',
  input: {schema: z.object({
    ...AnalyzeEyeScanInputSchema.shape,
    documentAnalysis: DocumentAnalysisOutputSchema.optional().describe('Structured analysis from an external medical document, if provided.'),
  })},
  output: {schema: AnalyzeEyeScanOutputSchema},
  prompt: `You are an expert ophthalmologist AI, a state-of-the-art deep learning-powered clinical decision support system. Your primary goal is **early detection** of ophthalmic diseases. Your task is to perform a comprehensive analysis and generate a structured diagnostic assessment.

**Workflow:**
1.  **Image Analysis & Early Detection**: First, meticulously analyze the input eye scan image. Your internal model should perform segmentation of key structures and extract relevant biomarkers. Pay special attention to subtle indicators that could be early signs of progressive diseases (e.g., nerve fiber layer thinning, microaneurysms, drusen characteristics).
2.  **Multi-Modal Correlation**: Correlate findings from the visual data with the patient history, clinical notes, and any provided analysis from external medical documents. Use this complete context to refine your assessment.
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

{{#if documentAnalysis}}
**External Document Summary:**
- **Document Type:** {{{documentAnalysis.summary}}}
- **Key Findings:** {{{documentAnalysis.keyFindings}}}
- **Prior Conditions:** {{#each documentAnalysis.priorConditions}} {{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- **Medications:** {{#each documentAnalysis.medications}} {{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- **Recommendations from Document:** {{{documentAnalysis.recommendations}}}
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
    let documentAnalysis: DocumentAnalysisOutput | undefined;
    if (input.documentDataUri) {
        // Step 1: Analyze the document first if it exists.
        documentAnalysis = await analyzeDocument({ documentDataUri: input.documentDataUri });
    }

    // Step 2: Pass the original input and the structured document analysis to the main prompt.
    const {output} = await analyzeEyeScanPrompt({
        ...input,
        documentAnalysis: documentAnalysis,
    });
    
    return output!;
  }
);
