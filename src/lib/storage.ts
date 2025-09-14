
import { MOCK_PATIENTS, MOCK_SCANS } from './mock-data';
import type { Patient, Scan } from './types';

const PATIENTS_KEY = 'optivision_patients';
const SCANS_KEY = 'optivision_scans';

// Function to check if running in a browser environment
const isBrowser = () => typeof window !== 'undefined';

// Initialize data in localStorage if it's not already there
if (isBrowser()) {
  if (!localStorage.getItem(PATIENTS_KEY)) {
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(MOCK_PATIENTS));
  }
  if (!localStorage.getItem(SCANS_KEY)) {
    localStorage.setItem(SCANS_KEY, JSON.stringify(MOCK_SCANS));
  }
}

// === Patient Functions ===

export function getPatients(): Patient[] {
  if (!isBrowser()) return MOCK_PATIENTS;
  const patients = localStorage.getItem(PATIENTS_KEY);
  return patients ? JSON.parse(patients) : [];
}

export function getPatient(id: string): Patient | null {
  if (!isBrowser()) return MOCK_PATIENTS.find(p => p.id === id) || null;
  const patients = getPatients();
  return patients.find((p) => p.id === id) || null;
}

export function savePatient(patient: Patient): void {
  if (!isBrowser()) return;
  const patients = getPatients();
  const existingIndex = patients.findIndex((p) => p.id === patient.id);
  if (existingIndex > -1) {
    patients[existingIndex] = patient;
  } else {
    patients.unshift(patient);
  }
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
}

// === Scan Functions ===

export function getScans(): Scan[] {
  if (!isBrowser()) return MOCK_SCANS;
  const scans = localStorage.getItem(SCANS_KEY);
  return scans ? JSON.parse(scans) : [];
}

export function getScansByPatient(patientId: string): Scan[] {
  if (!isBrowser()) return MOCK_SCANS.filter(s => s.patientId === patientId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const scans = getScans();
  return scans.filter((s) => s.patientId === patientId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function saveScan(scan: Scan): void {
  if (!isBrowser()) return;
  const scans = getScans();
  const existingIndex = scans.findIndex((s) => s.id === scan.id);
  if (existingIndex > -1) {
    scans[existingIndex] = scan;
  } else {
    scans.unshift(scan);
  }
  localStorage.setItem(SCANS_KEY, JSON.stringify(scans));
}
