
import {z} from 'genkit';
import type { 
    AnalyzeEyeScanInputSchema,
    AnalyzeEyeScanOutputSchema,
    GeneratePatientReportInputSchema,
    GeneratePatientReportOutputSchema,
    LongitudinalAnalysisInputSchema,
    LongitudinalAnalysisOutputSchema,
    MedicalChartBotInputSchema,
    MedicalChartBotOutputSchema,
    StrabismusAnalysisInputSchema,
    StrabismusAnalysisOutputSchema,
    DocumentAnalysisInputSchema,
    DocumentAnalysisOutputSchema,
} from './schemas';


export type AnalyzeEyeScanInput = z.infer<typeof AnalyzeEyeScanInputSchema>;
export type AnalyzeEyeScanOutput = z.infer<typeof AnalyzeEyeScanOutputSchema>;

export type GeneratePatientReportInput = z.infer<typeof GeneratePatientReportInputSchema>;
export type GeneratePatientReportOutput = z.infer<typeof GeneratePatientReportOutputSchema>;

export type LongitudinalAnalysisInput = z.infer<typeof LongitudinalAnalysisInputSchema>;
export type LongitudinalAnalysisOutput = z.infer<typeof LongitudinalAnalysisOutputSchema>;

export type MedicalChartBotInput = z.infer<typeof MedicalChartBotInputSchema>;
export type MedicalChartBotOutput = z.infer<typeof MedicalChartBotOutputSchema>;

export type StrabismusAnalysisInput = z.infer<typeof StrabismusAnalysisInputSchema>;
export type StrabismusAnalysisOutput = z.infer<typeof StrabismusAnalysisOutputSchema>;

export type DocumentAnalysisInput = z.infer<typeof DocumentAnalysisInputSchema>;
export type DocumentAnalysisOutput = z.infer<typeof DocumentAnalysisOutputSchema>;

export type ChatMessage = {
    role: 'user' | 'model';
    content: string;
};
