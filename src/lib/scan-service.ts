
import { addDoc, collection, doc, updateDoc, type Firestore } from "firebase/firestore";
import type { Scan } from "./types";
import { encrypt } from "./crypto";
import { FirestorePermissionError } from "@/firebase/errors";
import { errorEmitter } from "@/firebase/error-emitter";

/**
 * Adds a new scan to the Firestore database.
 * @param firestore The Firestore instance.
 * @param scan The scan data to add (without the id).
 * @returns The ID of the newly created scan document.
 */
export async function addScan(firestore: Firestore, scan: Omit<Scan, 'id'>): Promise<string> {
  // Encrypt clinical notes if they exist
  const scanData = { ...scan };
  if (scan.clinicalNotes) {
    scanData.clinicalNotes = await encrypt(scan.clinicalNotes);
  }

  try {
    const docRef = await addDoc(collection(firestore, "scans"), scanData);
    return docRef.id;
  } catch (serverError) {
     const permissionError = new FirestorePermissionError({
        path: `/scans`,
        operation: 'create',
        requestResourceData: scanData,
      });
      errorEmitter.emit('permission-error', permissionError);
      throw serverError;
  }
}

/**
 * Updates an existing scan in the Firestore database.
 * @param firestore The Firestore instance.
 * @param scanId The ID of the scan to update.
 * @param scan The partial scan data to update.
 */
export async function updateScan(firestore: Firestore, scanId: string, scan: Partial<Scan>): Promise<void> {
  const scanRef = doc(firestore, "scans", scanId);

  // Encrypt clinical notes if they are being updated
  const updateData = { ...scan };
  if (scan.clinicalNotes) {
    updateData.clinicalNotes = await encrypt(scan.clinicalNotes);
  }

  try {
    await updateDoc(scanRef, updateData);
  } catch (serverError) {
     const permissionError = new FirestorePermissionError({
      path: scanRef.path,
      operation: 'update',
      requestResourceData: updateData,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  }
}
