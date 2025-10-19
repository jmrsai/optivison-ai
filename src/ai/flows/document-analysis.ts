'use server';

/**
 * @fileOverview An AI flow for analyzing and summarizing medical documents.
 *
 * - analyzeDocument - A function that handles the document analysis process.
 */

import { ai } from '@/ai/genkit';
import type { DocumentAnalysisInput, DocumentAnalysisOutput } from '@/ai/types';
import { DocumentAnalysisInputSchema, DocumentAnalysisOutputSchema } from '@/ai/schemas';

export async function analyzeDocument(input: DocumentAnalysisInput): Promise<DocumentAnalysisOutput> {
  return documentAnalysisFlow(input);
}

const documentAnalysisPrompt = ai.definePrompt({
  name: 'documentAnalysisPrompt',
  input: { schema: DocumentAnalysisInputSchema },
  output: { schema: DocumentAnalysisOutputSchema },
  prompt: `You are an expert AI medical scribe. Your task is to analyze the provided medical document and extract key information. The document could be a lab report, a specialist's summary, a discharge summary, or any other clinical note.

Document to Analyze:
{{media url=documentDataUri}}

Please analyze the document and fill out the following fields based on its content. Be precise and thorough.
- **summary**: Provide a concise overview of the document's purpose and main points.
- **diagnoses**: List all distinct medical diagnoses mentioned.
- **medications**: List all medications mentioned, including dosage if available.
- **recommendations**: Summarize the primary recommendations, follow-up actions, or treatment plans.`,
});


const documentAnalysisFlow = ai.defineFlow(
  {
    name: 'documentAnalysisFlow',
    inputSchema: DocumentAnalysisInputSchema,
    outputSchema: DocumentAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await documentAnalysisPrompt(input);
    return output!;
  }
);
