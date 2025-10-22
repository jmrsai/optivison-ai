'use server';

/**
 * @fileOverview An interactive medical chart bot that maintains conversation history.
 *
 * - chatWithMedicalChart - A function that allows asking questions about a patient's chart.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { MedicalChartBotInput, MedicalChartBotOutput } from '@/ai/types';
import { MedicalChartBotInputSchema, MedicalChartBotOutputSchema } from '@/ai/schemas';

export async function chatWithMedicalChart(input: MedicalChartBotInput): Promise<MedicalChartBotOutput> {
  const { stream } = await medicalChartBotFlow(input);
  // In the new implementation, we will primarily use the stream on the client.
  // This immediate return can be used for non-streaming scenarios or logging.
  let finalResponse = '';
  for await (const chunk of stream) {
    finalResponse += chunk;
  }
  return { response: finalResponse };
}

export const medicalChartBotStream = ai.defineFlow(
  {
    name: 'medicalChartBotStream',
    inputSchema: MedicalChartBotInputSchema,
    outputSchema: z.string(),
    streamSchema: z.string(),
  },
  async (input, { stream }) => {
    const { response, stream: responseStream } = await ai.generateStream({
        prompt: `You are an expert AI medical assistant integrated into the OptiVision AI platform. Your role is to answer questions from a clinician about a specific patient's chart. You will be provided with the patient's history, their latest analysis, a summary of all their historical scans, and the ongoing conversation history.

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

---
**Conversation History:**
{{#each history}}
- **{{role}}**: {{content}}
{{/each}}
---

**New Clinician Query:**
"{{{query}}}"

Please provide a direct answer to the latest query based on all the data above.`,
        history: input.history?.map(m => ({ role: m.role, content: m.content })),
        input,
        model: 'gemini-1.5-flash',
        stream: true,
    });
    
    for await (const chunk of responseStream) {
        stream.write(chunk.text);
    }
    
    return (await response).text;
  }
);


const medicalChartBotFlow = ai.defineFlow(
  {
    name: 'medicalChartBotFlow',
    inputSchema: MedicalChartBotInputSchema,
    outputSchema: MedicalChartBotOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
        prompt: `You are an expert AI medical assistant integrated into the OptiVision AI platform. Your role is to answer questions from a clinician about a specific patient's chart. You will be provided with the patient's history, their latest analysis, a summary of all their historical scans, and the ongoing conversation history.

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

---
**Conversation History:**
{{#each history}}
- **{{role}}**: {{content}}
{{/each}}
---

**New Clinician Query:**
"{{{query}}}"

Please provide a direct answer to the latest query based on all the data above.`,
        history: input.history?.map(m => ({ role: m.role, content: m.content })),
        input: input,
        model: 'gemini-1.5-flash',
    });

    return { response: output?.text || '' };
  }
);
