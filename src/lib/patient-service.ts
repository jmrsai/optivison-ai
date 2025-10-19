
import { addDoc, collection, doc, updateDoc, type Firestore } from "firebase/firestore";
import type { Patient } from "./types";

/**
 * Adds a new patient to the Firestore database.
 * @param firestore The Firestore instance.
 * @param patient The patient data to add (without the id).
 * @returns The ID of the newly created patient document.
 */
export async function addPatient(firestore: Firestore, patient: Omit<Patient, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(firestore, "patients"), patient);
  return docRef.id;
}

/**
 * Updates an existing patient in the Firestore database.
 * @param firestore The Firestore instance.
 * @param patientId The ID of the patient to update.
 * @param patient The partial patient data to update.
 */
export async function updatePatient(firestore: Firestore, patientId: string, patient: Partial<Patient>): Promise<void> {
  const patientRef = doc(firestore, "patients", patientId);
  await updateDoc(patientRef, patient);
}
