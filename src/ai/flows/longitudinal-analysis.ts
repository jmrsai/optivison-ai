'use server';

/**
 * @fileOverview AI flow for generating a longitudinal analysis report by comparing multiple scans over time.
 *
 * - generateLongitudinalAnalysis - A function that generates the report.
 * - LongitudinalAnalysisInput - The input type for the function.
 * - LongitudinalAnalysisOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScanSummarySchema = z.object({
  date: z.string().describe('The date of the scan.'),
  diagnosticInsights: z.string().describe('The key diagnostic summary from this scan.'),
  potentialAbnormalities: z.array(z.string()).describe('List of abnormalities found.'),
  riskLevel: z.enum(['Low', 'Medium', 'High', 'N/A']).describe("The patient's overall risk level from this scan."),
});

const LongitudinalAnalysisInputSchema = z.object({
  patientHistory: z.string().describe("The patient's overall medical history."),
  scans: z
    .array(ScanSummarySchema)
    .describe('An array of previous scan summaries, ordered from most recent to oldest.'),
});
export type LongitudinalAnalysisInput = z.infer<typeof LongitudinalAnalysisInputSchema>;

const ChartDataPointSchema = z.object({
  date: z.string().describe('The date of the scan (e.g., "YYYY-MM-DD").'),
  riskScore: z.number().describe('A numerical representation of risk: Low=1, Medium=2, High=3.'),
});

const LongitudinalAnalysisOutputSchema = z.object({
  longitudinalSummary: z
    .string()
    .describe(
      'A detailed, paragraph-style summary analyzing the progression of the patient’s condition over time. Compare findings between scans to identify trends, stability, or changes (improvement/worsening). Mention specific changes in abnormalities and provide a risk assessment for future progression.'
    ),
  chartData: z.array(ChartDataPointSchema).describe('An array of data points for plotting risk over time. The array should be sorted by date in ascending order.'),
});
export type LongitudinalAnalysisOutput = z.infer<typeof LongitudinalAnalysisOutputSchema>;

export async function generateLongitudinalAnalysis(
  input: LongitudinalAnalysisInput
): Promise<LongitudinalAnalysisOutput> {
  return longitudinalAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'longitudinalAnalysisPrompt',
  input: {schema: LongitudinalAnalysisInputSchema},
  output: {schema: LongitudinalAnalysisOutputSchema},
  prompt: `You are an expert ophthalmologist AI specializing in longitudinal analysis of chronic eye conditions. Your task is to analyze a series of scans from the same patient to assess disease progression over time.

Patient History: {{{patientHistory}}}

You will be provided with a series of scan summaries. Compare the findings from the most recent scan to the previous ones. Identify any new abnormalities, changes in existing conditions (e.g., increased optic nerve cupping, new drusen), or signs of stability.

Based on this trend analysis, provide a comprehensive, accurate, and detailed summary that describes the disease's trajectory. Conclude with a risk assessment for future progression and suggest if the current management plan needs adjustment.

For the 'chartData' output, create a data point for each scan. Convert the risk level to a numerical score: 'Low' = 1, 'Medium' = 2, 'High' = 3. Format the date as 'YYYY-MM-DD' and ensure the final array is sorted chronologically from oldest to newest.

Scan History (most recent first):
{{#each scans}}
- Scan Date: {{date}}
  - Insights: {{diagnosticInsights}}
  - Abnormalities: {{#if potentialAbnormalities}}{{#each potentialAbnormalities}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None noted{{/if}}
  - Risk Level: {{riskLevel}}
{{/each}}
`,
});

const longitudinalAnalysisFlow = ai.defineFlow(
  {
    name: 'longitudinalAnalysisFlow',
    inputSchema: LongitudinalAnalysisInputSchema,
    outputSchema: LongitudinalAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
