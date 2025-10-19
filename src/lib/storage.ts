import { MOCK_PATIENTS, MOCK_SCANS } from './mock-data';
import type { Patient, Scan } from './types';
import { encrypt, decrypt } from './crypto';

const PATIENTS_KEY = 'optivision_patients';
const SCANS_KEY = 'optivision_scans';

// Function to check if running in a browser environment
const isBrowser = () => typeof window !== 'undefined';

async function initializeStorage() {
  if (!isBrowser()) return;

  if (!localStorage.getItem(PATIENTS_KEY)) {
    const encryptedPatients = await Promise.all(
      MOCK_PATIENTS.map(async (p) => ({ ...p, history: await encrypt(p.history) }))
    );
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(encryptedPatients));
  }

  if (!localStorage.getItem(SCANS_KEY)) {
    const encryptedScans = await Promise.all(
      MOCK_SCANS.map(async (s) => ({ ...s, clinicalNotes: await encrypt(s.clinicalNotes) }))
    );
    localStorage.setItem(SCANS_KEY, JSON.stringify(encryptedScans));
  }
}

initializeStorage();


// === Patient Functions ===

export async function getPatients(): Promise<Patient[]> {
  if (!isBrowser()) return MOCK_PATIENTS;
  const patientsJSON = localStorage.getItem(PATIENTS_KEY);
  if (!patientsJSON) return [];
  const patients = JSON.parse(patientsJSON);

  // Decrypt patient history
  return Promise.all(
    patients.map(async (p: Patient) => ({
      ...p,
      history: await decrypt(p.history),
    }))
  );
}

export async function getPatient(id: string): Promise<Patient | undefined> {
  const patients = await getPatients();
  return patients.find((p) => p.id === id);
}

export async function savePatient(patient: Patient): Promise<void> {
  if (!isBrowser()) return;
  let patients = JSON.parse(localStorage.getItem(PATIENTS_KEY) || '[]');
  const encryptedPatient = {
    ...patient,
    history: await encrypt(patient.history),
  };

  const existingIndex = patients.findIndex((p: Patient) => p.id === patient.id);
  if (existingIndex > -1) {
    patients[existingIndex] = encryptedPatient;
  } else {
    patients.unshift(encryptedPatient);
  }
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
}

// === Scan Functions ===

export async function getScans(): Promise<Scan[]> {
  if (!isBrowser()) return MOCK_SCANS;
  const scansJSON = localStorage.getItem(SCANS_KEY);
   if (!scansJSON) return [];
  const scans = JSON.parse(scansJSON);
  
  // Decrypt clinical notes
  return Promise.all(
      scans.map(async (s: Scan) => ({
          ...s,
          clinicalNotes: s.clinicalNotes ? await decrypt(s.clinicalNotes) : '',
      }))
  );
}

export async function getScansByPatient(patientId: string): Promise<Scan[]> {
  const scans = await getScans();
  return scans.filter((s) => s.patientId === patientId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function saveScan(scan: Scan): Promise<void> {
  if (!isBrowser()) return;
  const scans = JSON.parse(localStorage.getItem(SCANS_KEY) || '[]');
  const encryptedScan = {
      ...scan,
      clinicalNotes: await encrypt(scan.clinicalNotes),
  };

  const existingIndex = scans.findIndex((s) => s.id === scan.id);
  if (existingIndex > -1) {
    scans[existingIndex] = encryptedScan;
  } else {
    scans.unshift(encryptedScan);
  }
  localStorage.setItem(SCANS_KEY, JSON.stringify(scans));
}
