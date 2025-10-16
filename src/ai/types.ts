import {z} from 'genkit';
import type { 
    AnalyzeEyeScanInputSchema,
    AnalyzeEyeScanOutputSchema,
    DocumentAnalysisInputSchema,
    DocumentAnalysisOutputSchema,
    GeneratePatientReportInputSchema,
    GeneratePatientReportOutputSchema,
    LongitudinalAnalysisInputSchema,
    LongitudinalAnalysisOutputSchema,
} from './schemas';


export type AnalyzeEyeScanInput = z.infer<typeof AnalyzeEyeScanInputSchema>;
export type AnalyzeEyeScanOutput = z.infer<typeof AnalyzeEyeScanOutputSchema>;

export type DocumentAnalysisInput = z.infer<typeof DocumentAnalysisInputSchema>;
export type DocumentAnalysisOutput = z.infer<typeof DocumentAnalysisOutputSchema>;

export type GeneratePatientReportInput = z.infer<typeof GeneratePatientReportInputSchema>;
export type GeneratePatientReportOutput = z.infer<typeof GeneratePatientReportOutputSchema>;

export type LongitudinalAnalysisInput = z.infer<typeof LongitudinalAnalysisInputSchema>;
export type LongitudinalAnalysisOutput = z.infer<typeof LongitudinalAnalysisOutputSchema>;
