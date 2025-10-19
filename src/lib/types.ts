import type { AnalyzeEyeScanOutputSchema } from "@/ai/schemas";
import type { Timestamp } from "firebase/firestore";
import { z } from "genkit";

export type Patient = {
  id: string;
  clinicianId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  lastVisit: string; // ISO string date
  avatarUrl: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'N/A';
  history: string;
};

// We only need the 'analysis' part of the schema for the scan type
const ScanAnalysisSchema = AnalyzeEyeScanOutputSchema.shape.analysis;
type ScanAnalysis = z.infer<typeof ScanAnalysisSchema>;


export type Scan = {
  id: string;
  patientId: string;
  clinicianId: string;
  date: string; // ISO string date
  imageUrl: string;
  clinicalNotes: string;
  status: 'completed' | 'processing' | 'failed';
  analysis?: ScanAnalysis;
  report?: string;
  createdAt?: Timestamp;
};
