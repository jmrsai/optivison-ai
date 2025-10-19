
import { addDoc, collection, doc, updateDoc, type Firestore } from "firebase/firestore";
import type { Scan } from "./types";

/**
 * Adds a new scan to the Firestore database.
 * @param firestore The Firestore instance.
 * @param scan The scan data to add (without the id).
 * @returns The ID of the newly created scan document.
 */
export async function addScan(firestore: Firestore, scan: Omit<Scan, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(firestore, "scans"), scan);
  return docRef.id;
}

/**
 * Updates an existing scan in the Firestore database.
 * @param firestore The Firestore instance.
 * @param scanId The ID of the scan to update.
 * @param scan The partial scan data to update.
 */
export async function updateScan(firestore: Firestore, scanId: string, scan: Partial<Scan>): Promise<void> {
  const scanRef = doc(firestore, "scans", scanId);
  await updateDoc(scanRef, scan);
}
