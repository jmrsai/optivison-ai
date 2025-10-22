
import type { AnalyzeEyeScanOutputSchema } from "@/ai/schemas";
import type { Timestamp } from "firebase/firestore";
import { z } from "genkit";

export type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  role: 'clinician' | 'patient';
};

export type Patient = {
  id: string;
  clinicianId: string;
  userId?: string; // Link to the auth user if the patient has an account
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  lastVisit: string; // ISO string date
  avatarUrl: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'N/A';
  history: string;
  role?: 'patient';
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

export type Message = {
    id: string;
    text: string;
    senderId: string;
    receiverId: string;
    timestamp: Timestamp;
};
