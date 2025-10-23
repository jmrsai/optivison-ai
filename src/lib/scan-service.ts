import type { Scan } from "./types";
import { encrypt } from "./crypto";

const getScansFromStorage = (): Record<string, Scan> => {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem('scans');
  return data ? JSON.parse(data) : {};
};

const saveScansToStorage = (scans: Record<string, Scan>) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('scans', JSON.stringify(scans));
};

/**
 * Adds a new scan to localStorage.
 * @param scan The scan data to add (without the id).
 * @returns The ID of the newly created scan document.
 */
export async function addScan(scan: Omit<Scan, 'id'>): Promise<string> {
  const scanData = { ...scan };
  if (scan.clinicalNotes) {
    scanData.clinicalNotes = await encrypt(scan.clinicalNotes);
  }

  const scanId = `scan_${Date.now()}`;
  const newScan: Scan = {
    ...scanData,
    id: scanId,
  };

  const scans = getScansFromStorage();
  scans[scanId] = newScan;
  saveScansToStorage(scans);
  
  return scanId;
}

/**
 * Updates an existing scan in localStorage.
 * @param scanId The ID of the scan to update.
 * @param scanUpdate The partial scan data to update.
 */
export async function updateScan(scanId: string, scanUpdate: Partial<Scan>): Promise<void> {
  const scans = getScansFromStorage();
  const existingScan = scans[scanId];

  if (!existingScan) {
    throw new Error("Scan not found");
  }

  const updateData = { ...scanUpdate };
  if (scanUpdate.clinicalNotes) {
    updateData.clinicalNotes = await encrypt(scanUpdate.clinicalNotes);
  }
  
  const updatedScan = { ...existingScan, ...updateData };
  scans[scanId] = updatedScan;
  saveScansToStorage(scans);
}
