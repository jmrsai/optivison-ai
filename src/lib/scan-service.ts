
import type { Scan } from "./types";
import { encrypt } from "./crypto";
import { initializeFirebase } from "@/firebase";
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, type UploadTask } from 'firebase/storage';

/**
 * Adds a new scan document to Firestore and initiates image upload to Storage.
 * @param scan The scan data to add (without the id and storage details).
 * @param imageFile The image file to upload.
 * @returns The ID of the newly created scan document and the upload task.
 */
export async function addScan(scan: Omit<Scan, 'id' | 'imageUrl' | 'storagePath'>, imageFile: File): Promise<{ scanId: string, uploadTask: UploadTask }> {
  const { firestore, storage } = initializeFirebase();
  let clinicalNotes = scan.clinicalNotes;
  if (scan.clinicalNotes) {
    clinicalNotes = await encrypt(scan.clinicalNotes);
  }

  const scanCollection = collection(firestore, 'scans');
  
  const scanDocRef = await addDoc(scanCollection, {
    ...scan,
    clinicalNotes,
    status: 'processing',
    imageUrl: '', // Will be updated after upload
    storagePath: '' // Will be updated after upload
  });

  const scanId = scanDocRef.id;
  const storagePath = `scans/${scan.patientId}/${scanId}-${imageFile.name}`;
  const storageRef = ref(storage, storagePath);
  const uploadTask = uploadBytesResumable(storageRef, imageFile);
  
  return { scanId, uploadTask };
}

/**
 * Updates an existing scan in Firestore.
 * @param scanId The ID of the scan to update.
 * @param scanUpdate The partial scan data to update.
 */
export async function updateScan(scanId: string, scanUpdate: Partial<Scan>): Promise<void> {
  const { firestore } = initializeFirebase();
  const scanDocRef = doc(firestore, 'scans', scanId);
  
  const updateData: { [key: string]: any } = { ...scanUpdate };
  if (scanUpdate.clinicalNotes) {
    updateData.clinicalNotes = await encrypt(scanUpdate.clinicalNotes);
  }
  
  await updateDoc(scanDocRef, updateData);
}

    