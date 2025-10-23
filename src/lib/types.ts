
import type { AnalyzeEyeScanOutputSchema } from "@/ai/schemas";
import { z } from 'genkit';

export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
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
  history: string; // This will be the encrypted string
};

export type ScanAnalysis = z.infer<typeof AnalyzeEyeScanOutputSchema>;


export type Scan = {
  id: string;
  patientId: string;
  clinicianId: string;
  date: string; // ISO string date
  imageUrl: string;
  clinicalNotes: string; // This will be the encrypted string
  status: 'completed' | 'processing' | 'failed';
  analysis?: ScanAnalysis;
  report?: string;
};

export type Message = {
    id: string;
    text: string;
    senderId: string;
    receiverId: string;
    timestamp: number; // Use number for client-side timestamp
};
