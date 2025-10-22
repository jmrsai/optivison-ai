import { addDoc, collection, doc, updateDoc, type Firestore } from "firebase/firestore";
import type { Patient } from "./types";
import { encrypt } from "./crypto";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";

/**
 * Adds a new patient to the Firestore database, encrypting sensitive fields.
 * @param firestore The Firestore instance.
 * @param patient The patient data to add (without the id).
 * @returns The ID of the newly created patient document.
 */
export async function addPatient(firestore: Firestore, patient: Omit<Patient, 'id'>): Promise<string> {
  // Encrypt sensitive fields before saving
  const encryptedHistory = await encrypt(patient.history);

  const patientData: Omit<Patient, 'id'> = {
    ...patient,
    history: encryptedHistory,
  };

  // If the patient is registering themselves, link their auth UID
  if (patient.role === 'patient' && patient.userId) {
    patientData.userId = patient.userId;
  }
  
  const docRef = await addDoc(collection(firestore, "patients"), patientData as any)
    .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: `/patients`,
            operation: 'create',
            requestResourceData: patientData,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
        throw serverError; // Re-throw to allow the caller to handle it.
    });

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

  // If history is being updated, encrypt it
  const updateData = { ...patient };
  if (patient.history) {
    updateData.history = await encrypt(patient.history);
  }
  
  updateDoc(patientRef, updateData)
    .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: patientRef.path,
            operation: 'update',
            requestResourceData: updateData,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
    });
}
