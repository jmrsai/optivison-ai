import type { AnalyzeEyeScanOutput } from "@/ai/types";
import type { Timestamp } from "firebase/firestore";

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

export type Scan = {
  id: string;
  patientId: string;
  clinicianId: string;
  date: string; // ISO string date
  imageUrl: string;
  clinicalNotes: string;
  status: 'completed' | 'processing' | 'failed';
  analysis?: AnalyzeEyeScanOutput;
  report?: string;
  createdAt?: Timestamp;
};
