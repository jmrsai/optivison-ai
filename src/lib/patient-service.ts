
'use client';

import type { Patient } from "./types";
import { encrypt } from "./crypto";

const getPatientsFromStorage = (): Record<string, Omit<Patient, 'id'>> => {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem('patients');
  return data ? JSON.parse(data) : {};
};

const savePatientsToStorage = (patients: Record<string, Omit<Patient, 'id'>>) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('patients', JSON.stringify(patients));
};

/**
 * Adds a new patient to localStorage, encrypting sensitive fields.
 * @param patient The patient data to add (without the id).
 * @returns The ID of the newly created patient document.
 */
export async function addPatient(patient: Omit<Patient, 'id'>): Promise<string> {
  const encryptedHistory = await encrypt(patient.history);

  const patientId = patient.userId || `patient_${Date.now()}`;
  
  // Ensure we are saving the Omit<Patient, 'id'> type
  const newPatientData: Omit<Patient, 'id'> = {
    clinicianId: patient.clinicianId,
    userId: patient.userId,
    name: patient.name,
    age: patient.age,
    gender: patient.gender,
    lastVisit: patient.lastVisit,
    avatarUrl: patient.avatarUrl,
    riskLevel: patient.riskLevel,
    history: encryptedHistory,
  };
  
  const patients = getPatientsFromStorage();
  patients[patientId] = newPatientData;
  savePatientsToStorage(patients);
  
  return patientId;
}

/**
 * Updates an existing patient in localStorage.
 * @param patientId The ID of the patient to update.
 * @param patientUpdate The partial patient data to update.
 */
export async function updatePatient(patientId: string, patientUpdate: Partial<Omit<Patient, 'id'>>): Promise<void> {
  const patients = getPatientsFromStorage();
  const existingPatient = patients[patientId];

  if (!existingPatient) {
    throw new Error("Patient not found");
  }

  const updateData: Partial<Omit<Patient, 'id'>> = { ...patientUpdate };
  
  if (patientUpdate.history) {
    updateData.history = await encrypt(patientUpdate.history);
  }

  const updatedPatient = { ...existingPatient, ...updateData };
  patients[patientId] = updatedPatient;
  savePatientsToStorage(patients);
}
