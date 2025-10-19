'use server';

/**
 * @fileOverview An interactive medical chart bot.
 *
 * - chatWithMedicalChart - A function that allows asking questions about a patient's chart.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { MedicalChartBotInput, MedicalChartBotOutput } from '@/ai/types';
import { MedicalChartBotInputSchema, MedicalChartBotOutputSchema } from '@/ai/schemas';

export async function chatWithMedicalChart(input: MedicalChartBotInput): Promise<MedicalChartBotOutput> {
  return medicalChartBotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'medicalChartBotPrompt',
  input: {schema: MedicalChartBotInputSchema},
  output: {schema: MedicalChartBotOutputSchema},
  prompt: `You are an expert AI medical assistant integrated into the OptiVision AI platform. Your role is to answer questions from a clinician about a specific patient's chart. You will be provided with the patient's history, their latest analysis, and a summary of all their historical scans.

Your answers must be:
- Derived ONLY from the information provided in the context. Do not invent or infer information.
- Concise, accurate, and professional.
- Directly responsive to the clinician's query.

**Patient Context:**
- Name: {{{patient.name}}}
- Age: {{{patient.age}}}
- Gender: {{{patient.gender}}}
- Medical History: {{{patient.history}}}

**Latest Scan Analysis:**
- Insights: {{{latestScan.analysis.diagnosticInsights}}}
- Abnormalities: {{#each latestScan.analysis.potentialAbnormalities}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Risk Level: {{{latestScan.analysis.riskLevel}}}
- Recommendations: {{{latestScan.analysis.recommendations}}}

**Historical Scan Summaries (oldest to newest):**
{{#each historicalScans}}
- Date: {{date}}
  - Risk Level: {{analysis.riskLevel}}
  - Key Findings: {{analysis.diagnosticInsights}}
{{/each}}

**Clinician's Query:**
"{{{query}}}"

Please provide a direct answer to the query based on the data above.
`,
});

const medicalChartBotFlow = ai.defineFlow(
  {
    name: 'medicalChartBotFlow',
    inputSchema: MedicalChartBotInputSchema,
    outputSchema: MedicalChartBotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
