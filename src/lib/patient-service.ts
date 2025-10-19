
import { addDoc, collection, doc, updateDoc, type Firestore, getDocs, query, where } from "firebase/firestore";
import type { Patient, Scan } from "./types";
import { useFirestore } from "@/firebase";

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


/**
 * Fetches all patients and their associated scans for a given clinician.
 * This is intended for server-side use, e.g., in a Genkit flow.
 * @param clinicianId The UID of the clinician.
 * @returns An object containing lists of patients and scans.
 */
export async function getAllDataForClinician(clinicianId: string): Promise<{ patients: Patient[], scans: Scan[] }> {
    const firestore = useFirestore();

    const patientsQuery = query(collection(firestore, 'patients'), where('clinicianId', '==', clinicianId));
    const scansQuery = query(collection(firestore, 'scans'), where('clinicianId', '==', clinicianId));

    const [patientSnap, scanSnap] = await Promise.all([
        getDocs(patientsQuery),
        getDocs(scansQuery),
    ]);

    const patients = patientSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Patient));
    const scans = scanSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Scan));

    return { patients, scans };
}
