'use server';

/**
 * @fileOverview An AI flow for analyzing and summarizing medical documents.
 *
 * - analyzeDocument - A function that handles the document analysis process.
 */

import { ai } from '@/ai/genkit';
import pdf from 'pdf-parse';
import type { DocumentAnalysisInput, DocumentAnalysisOutput } from '@/ai/types';
import { DocumentAnalysisInputSchema, DocumentAnalysisOutputSchema } from '@/ai/schemas';

export async function analyzeDocument(input: DocumentAnalysisInput): Promise<DocumentAnalysisOutput> {
  return documentAnalysisFlow(input);
}

const documentAnalysisFlow = ai.defineFlow(
  {
    name: 'documentAnalysisFlow',
    inputSchema: DocumentAnalysisInputSchema,
    outputSchema: DocumentAnalysisOutputSchema,
  },
  async (input) => {
    const { documentDataUri } = input;
    const [header, data] = documentDataUri.split(',');
    const mimeType = header.split(';')[0].split(':')[1];

    if (mimeType === 'application/pdf') {
        const buffer = Buffer.from(data, 'base64');
        const pdfData = await pdf(buffer);
        const textContent = pdfData.text;

        const { output } = await ai.generate({
            prompt: `You are an expert AI medical scribe. Your task is to analyze the provided medical text and extract key information.
            
            Text to Analyze:
            ${textContent}
            
            Please analyze the text and fill out the following fields based on its content. Be precise and thorough.`,
            model: 'googleai/gemini-1.5-pro',
            output: {
              schema: DocumentAnalysisOutputSchema,
            }
        });
        return output!;

    } else {
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
        const { output } = await prompt(input);
        return output!;
    }
  }
);
