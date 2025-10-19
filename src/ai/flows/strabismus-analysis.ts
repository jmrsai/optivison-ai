'use server';

/**
 * @fileOverview AI flow for analyzing an image for signs of strabismus.
 *
 * - analyzeStrabismus - A function that takes an eye image and returns a diagnostic analysis.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { StrabismusAnalysisInput, StrabismusAnalysisOutput } from '@/ai/types';
import { StrabismusAnalysisInputSchema, StrabismusAnalysisOutputSchema } from '@/ai/schemas';

export async function analyzeStrabismus(input: StrabismusAnalysisInput): Promise<StrabismusAnalysisOutput> {
  return strabismusAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'strabismusAnalysisPrompt',
  input: { schema: StrabismusAnalysisInputSchema },
  output: { schema: StrabismusAnalysisOutputSchema },
  prompt: `You are an expert ophthalmologist AI specializing in pediatric eye conditions. Your task is to analyze the provided image to detect signs of strabismus (crossed eyes).

**Image for Analysis:**
{{media url=eyeImageDataUri}}

**Analysis Workflow:**
1.  **Examine Eye Alignment:** Carefully examine the alignment of both eyes in the image. Look for any deviation of one eye in relation to the other.
2.  **Corneal Light Reflex:** Assess the position of the light reflection (Hirschberg test) on the corneas. Note if the reflections are symmetrical and centered in both pupils.
3.  **Identify Type (if present):** If strabismus is detected, classify its type if possible (e.g., Esotropia - inward turning, Exotropia - outward turning, Hypertropia - upward turning, Hypotropia - downward turning).
4.  **Formulate Diagnosis:** Based on your findings, determine whether strabismus is likely present. Set the 'hasStrabismus' flag accordingly and provide a confidence score for your assessment.
5.  **Provide Observations and Recommendations:** Detail your specific observations in the 'observations' field. In the 'nextSteps' field, recommend appropriate actions, such as consulting a pediatric ophthalmologist for a comprehensive examination.

**IMPORTANT:** Your analysis is a screening tool, not a formal diagnosis. Your 'nextSteps' should always recommend a consultation with a qualified medical professional.
`,
});

const strabismusAnalysisFlow = ai.defineFlow(
  {
    name: 'strabismusAnalysisFlow',
    inputSchema: StrabismusAnalysisInputSchema,
    outputSchema: StrabismusAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
