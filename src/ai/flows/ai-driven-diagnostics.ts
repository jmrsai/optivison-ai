'use server';

/**
 * @fileOverview AI-driven diagnostics flow for analyzing eye scans and providing diagnostic insights.
 *
 * - analyzeEyeScan - A function that analyzes an uploaded eye scan and provides diagnostic insights.
 * - AnalyzeEyeScanInput - The input type for the analyzeEyeScan function.
 * - AnalyzeEyeScanOutput - The return type for the analyzeEyescan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { DocumentAnalysisOutput } from './document-analysis';

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
  documentAnalysis: z.any().optional().describe('Analysis from an external medical document.')
});
export type AnalyzeEyeScanInput = z.infer<typeof AnalyzeEyeScanInputSchema> & { documentAnalysis?: DocumentAnalysisOutput };


const AnalyzeEyeScanOutputSchema = z.object({
  diagnosticInsights: z
    .string()
    .describe('A detailed summary of diagnostic insights based on the eye scan analysis. Reference specific biomarkers or features detected by the deep learning model.'),
  potentialAbnormalities: z
    .array(z.string())
    .describe('A list of potential abnormalities or diseases identified from the deep learning analysis (e.g., Glaucoma, Diabetic Retinopathy, Macular Degeneration).'),
  differentialDiagnosis: z.array(z.string()).describe('A list of possible alternative diagnoses to consider based on the identified patterns.'),
  earlySigns: z
    .array(z.string())
    .describe('A list of any subtle or early-stage biomarkers of disease detected by the model. Focus on early detection.'),
  preventionSuggestions: z
    .array(z.string())
    .describe('A list of suggested preventive measures based on the findings.'),
  diseaseStaging: z
    .string()
    .optional()
    .describe('If a disease is identified, provide its stage (e.g., "Early-stage", "Moderate", "Advanced") based on quantitative analysis if possible.'),
  riskAssessment: z
    .string()
    .describe('An assessment of the patient’s risk for disease progression or developing new conditions, citing specific features from the scan.'),
  riskLevel: z.enum(['Low', 'Medium', 'High', 'N/A']).describe("The patient's overall risk level based on the analysis. Must be 'Low', 'Medium', or 'High'."),
  treatmentSuggestions: z
    .array(z.string())
    .describe('A list of suggested treatments or management plans based on the diagnosis.'),
  followUpPlan: z
    .string()
    .describe('A detailed plan for patient follow-up, including recommended imaging, tests, and timelines.'),
  confidenceLevel: z
    .number()
    .min(0)
    .max(1)
    .describe('The confidence level of the AI model in its primary diagnosis (from 0 to 1).'),
  recommendations: z
    .string()
    .describe('Recommendations for next steps, such as specialist referrals or further imaging.'),
});
export type AnalyzeEyeScanOutput = z.infer<typeof AnalyzeEyeScanOutputSchema>;

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
