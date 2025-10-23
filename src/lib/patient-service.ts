
'use client';

import type { Patient } from "./types";
import { encrypt } from "./crypto";
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { initializeFirebase } from "@/firebase";

/**
 * Adds a new patient to Firestore, encrypting sensitive fields.
 * @param patient The patient data to add (without the id).
 * @returns The ID of the newly created patient document.
 */
export async function addPatient(patient: Omit<Patient, 'id'>): Promise<string> {
  const { firestore } = initializeFirebase();
  const encryptedHistory = await encrypt(patient.history);

  const patientCollection = collection(firestore, 'patients');
  
  const newPatientData = {
    ...patient,
    history: encryptedHistory,
  };

  const docRef = await addDoc(patientCollection, newPatientData);
  return docRef.id;
}

/**
 * Updates an existing patient in Firestore.
 * @param patientId The ID of the patient to update.
 * @param patientUpdate The partial patient data to update.
 */
export async function updatePatient(patientId: string, patientUpdate: Partial<Omit<Patient, 'id'>>): Promise<void> {
  const { firestore } = initializeFirebase();
  const patientDocRef = doc(firestore, 'patients', patientId);

  const updateData: { [key: string]: any } = { ...patientUpdate };
  
  if (patientUpdate.history) {
    updateData.history = await encrypt(patientUpdate.history);
  }

  await updateDoc(patientDocRef, updateData);
}

    