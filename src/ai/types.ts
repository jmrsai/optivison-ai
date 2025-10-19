import {z} from 'genkit';
import type { 
    AnalyzeEyeScanInputSchema,
    AnalyzeEyeScanOutputSchema,
    LongitudinalAnalysisInputSchema,
    LongitudinalAnalysisOutputSchema,
} from './schemas';


export type AnalyzeEyeScanInput = z.infer<typeof AnalyzeEyeScanInputSchema>;
export type AnalyzeEyeScanOutput = z.infer<typeof AnalyzeEyeScanOutputSchema>;

export type LongitudinalAnalysisInput = z.infer<typeof LongitudinalAnalysisInputSchema>;
export type LongitudinalAnalysisOutput = z.infer<typeof LongitudinalAnalysisOutputSchema>;
