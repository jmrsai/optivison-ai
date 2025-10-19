import {z} from 'genkit';

export const AnalyzeEyeScanInputSchema = z.object({
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
  documentSummary: z
    .string()
    .optional()
    .describe(
      "An optional summary of a medical document for additional context."
    ),
});

export const AnalyzeEyeScanOutputSchema = z.object({
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

export const DocumentAnalysisInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A medical document as a data URI that must include a MIME type and use Base64 encoding. Can be an image or a PDF. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export const DocumentAnalysisOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the entire document.'),
  diagnoses: z.array(z.string()).describe('A list of all medical diagnoses mentioned in the document.'),
  medications: z.array(z.string()).describe('A list of all medications mentioned in the document.'),
  recommendations: z.string().describe('A summary of the key recommendations or treatment plans from the document.'),
});

export const GeneratePatientReportInputSchema = z.object({
  patientName: z.string().describe("The patient's full name."),
  patientAge: z.number().describe("The patient's age."),
  patientGender: z.string().describe("The patient's gender."),
  scanDate: z.string().describe("The date of the scan."),
  clinicalNotes: z.string().optional().describe('The clinical notes for the scan.'),
  analysis: AnalyzeEyeScanOutputSchema.describe("The full AI analysis object from the 'analyzeEyeScan' flow."),
  patientHistory: z.string().describe('The patient history for longitudinal analysis.'),
});

export const GeneratePatientReportOutputSchema = z.object({
  report: z.string().describe('The comprehensive patient report in a structured, professional format, using markdown for section headers.'),
});

const ScanSummarySchema = z.object({
  date: z.string().describe('The date of the scan.'),
  diagnosticInsights: z.string().describe('The key diagnostic summary from this scan.'),
  potentialAbnormalities: z.array(z.string()).describe('List of abnormalities found.'),
  riskLevel: z.enum(['Low', 'Medium', 'High', 'N/A']).describe("The patient's overall risk level from this scan."),
});

const ChartDataPointSchema = z.object({
  date: z.string().describe('The date of the scan (e.g., "YYYY-MM-DD").'),
  riskScore: z.number().describe('A numerical representation of risk: Low=1, Medium=2, High=3.'),
});

export const LongitudinalAnalysisInputSchema = z.object({
  patientHistory: z.string().describe("The patient's overall medical history."),
  scans: z
    .array(ScanSummarySchema)
    .describe('An array of previous scan summaries, ordered from most recent to oldest.'),
});

export const LongitudinalAnalysisOutputSchema = z.object({
  longitudinalSummary: z
    .string()
    .describe(
      'A detailed, paragraph-style summary analyzing the progression of the patient’s condition over time. Compare findings between scans to identify trends, stability, or changes (improvement/worsening). Mention specific changes in abnormalities and provide a risk assessment for future progression.'
    ),
  chartData: z.array(ChartDataPointSchema).describe('An array of data points for plotting risk over time. The array should be sorted by date in ascending order.'),
});
