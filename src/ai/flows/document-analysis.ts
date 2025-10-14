'use server';

/**
 * @fileOverview An AI flow for analyzing and summarizing medical documents.
 *
 * - analyzeDocument - A function that handles the document analysis process.
 * - DocumentAnalysisInput - The input type for the analyzeDocument function.
 * - DocumentAnalysisOutput - The return type for the analyzeDocument function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DocumentAnalysisInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A medical document as a data URI that must include a MIME type and use Base64 encoding. Can be an image or a PDF. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DocumentAnalysisInput = z.infer<typeof DocumentAnalysisInputSchema>;

const DocumentAnalysisOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the entire document.'),
  diagnoses: z.array(z.string()).describe('A list of all medical diagnoses mentioned in the document.'),
  medications: z.array(z.string()).describe('A list of all medications mentioned in the document.'),
  recommendations: z.string().describe('A summary of the key recommendations or treatment plans from the document.'),
});
export type DocumentAnalysisOutput = z.infer<typeof DocumentAnalysisOutputSchema>;

export async function analyzeDocument(input: DocumentAnalysisInput): Promise<DocumentAnalysisOutput> {
  return documentAnalysisFlow(input);
}

const prompt = ai.definePrompt({
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
    const { output } = await prompt(input);
    return output!;
  }
);
