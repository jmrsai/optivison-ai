import type { AnalyzeEyeScanOutput } from "@/ai/flows/ai-driven-diagnostics";

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  lastVisit: string;
  avatarUrl: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'N/A';
  history: string;
};

export type Scan = {
  id: string;
  patientId: string;
  date: string;
  imageUrl: string;
  clinicalNotes: string;
  status: 'completed' | 'processing' | 'failed';
  analysis?: AnalyzeEyeScanOutput;
  report?: string;
};
