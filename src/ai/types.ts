import {z} from 'genkit';
import type { 
    AnalyzeEyeScanInputSchema,
    AnalyzeEyeScanOutputSchema,
    LongitudinalAnalysisInputSchema,
    LongitudinalAnalysisOutputSchema,
    MedicalChartBotInputSchema,
    MedicalChartBotOutputSchema,
} from './schemas';


export type AnalyzeEyeScanInput = z.infer<typeof AnalyzeEyeScanInputSchema>;
export type AnalyzeEyeScanOutput = z.infer<typeof AnalyzeEyeScanOutputSchema>;

export type LongitudinalAnalysisInput = z.infer<typeof LongitudinalAnalysisInputSchema>;
export type LongitudinalAnalysisOutput = z.infer<typeof LongitudinalAnalysisOutputSchema>;

export type MedicalChartBotInput = z.infer<typeof MedicalChartBotInputSchema>;
export type MedicalChartBotOutput = z.infer<typeof MedicalChartBotOutputSchema>;
