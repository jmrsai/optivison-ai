'use server';

import { google } from 'googleapis';
import { initializeServerApp } from '@/firebase/server-provider';
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";
import type { Patient, Scan } from './types';
import { decrypt } from './crypto';

const drive = google.drive('v3');

async function getAuthenticatedClient(idToken: string) {
    const auth = new google.auth.OAuth2();
    // We need to get the access token from the ID token to make Google API calls.
    // This is a complex flow. For this demo, we'll assume the client-side token can be used
    // after a popup flow has granted the `drive.file` scope.
    // A production app would use a more robust server-to-server OAuth flow.
    auth.setCredentials({ access_token: await tradeIdTokenForAccessToken(idToken) });
    google.options({ auth });
    return auth;
}

// This is a placeholder for a more complex token exchange flow.
// In a real app, you would exchange the ID token for an access token
// with the required Drive scopes.
async function tradeIdTokenForAccessToken(idToken: string): Promise<string> {
    // This is a simplified stand-in. A real implementation would involve
    // a secure server-side exchange with Google's OAuth endpoints.
    // We are returning the idToken for now, but this will fail if it's not
    // already an access token with drive scope. This is why the popup
    // on the client is essential.
    return idToken;
}

/**
 * Converts a JSON object of patients and scans to a CSV string.
 * @param data An object containing patients and scans.
 * @returns A CSV formatted string.
 */
function convertToCsv(data: { patients: Patient[], scans: Scan[] }): string {
    const { patients, scans } = data;
    
    // Create patient CSV
    const patientHeaders = ['patientId', 'clinicianId', 'name', 'age', 'gender', 'lastVisit', 'riskLevel', 'history'];
    const patientRows = patients.map(p => 
        [p.id, p.clinicianId, p.name, p.age, p.gender, p.lastVisit, p.riskLevel, `"${p.history.replace(/"/g, '""')}"`].join(',')
    );
    const patientCsv = [patientHeaders.join(','), ...patientRows].join('\n');

    // Create scan CSV
    const scanHeaders = ['scanId', 'patientId', 'clinicianId', 'date', 'status', 'imageUrl', 'clinicalNotes', 'diagnosticInsights', 'riskLevel'];
    const scanRows = scans.map(s => 
        [
            s.id,
            s.patientId,
            s.clinicianId,
            s.date,
            s.status,
            s.imageUrl,
            `"${s.clinicalNotes?.replace(/"/g, '""') || ''}"`,
            `"${s.analysis?.diagnosticInsights.replace(/"/g, '""') || ''}"`,
            s.analysis?.riskLevel || 'N/A'
        ].join(',')
    );
    const scanCsv = [scanHeaders.join(','), ...scanRows].join('\n');

    return `PATIENTS\n${patientCsv}\n\nSCANS\n${scanCsv}`;
}


/**
 * Fetches all patients and their associated scans for a given clinician.
 * This is intended for server-side use.
 * @param clinicianId The UID of the clinician.
 * @returns An object containing lists of patients and scans.
 */
async function getAllDataForClinician(clinicianId: string): Promise<{ patients: Patient[], scans: Scan[] }> {
    const adminApp = initializeServerApp();
    const firestore = getAdminFirestore(adminApp);

    const patientsQuery = firestore.collection('patients').where('clinicianId', '==', clinicianId);
    const scansQuery = firestore.collection('scans').where('clinicianId', '==', clinicianId);


    const [patientSnap, scanSnap] = await Promise.all([
        patientsQuery.get(),
        scansQuery.get(),
    ]);

    const patients = await Promise.all(patientSnap.docs.map(async (doc) => {
        const patientData = doc.data() as Patient;
        return {
            id: doc.id,
            ...patientData,
            history: await decrypt(patientData.history),
        } as Patient;
    }));
    
    const scans = await Promise.all(scanSnap.docs.map(async (doc) => {
        const scanData = doc.data() as Scan;
        return {
            id: doc.id,
            ...scanData,
            clinicalNotes: scanData.clinicalNotes ? await decrypt(scanData.clinicalNotes) : '',
        } as Scan;
    }));

    return { patients, scans };
}

export async function exportDataToDrive(idToken: string, clinicianId: string): Promise<{ folderId: string, folderName: string }> {
    await getAuthenticatedClient(idToken);
    
    const data = await getAllDataForClinician(clinicianId);
    const jsonData = JSON.stringify(data, null, 2);
    const csvData = convertToCsv(data);

    const folderName = `OptiVision_Backup_${new Date().toISOString().split('T')[0]}`;
    
    const folderMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
    };
    
    const folder = await drive.files.create({
        requestBody: folderMetadata,
        fields: 'id',
    });
    
    const folderId = folder.data.id;
    if (!folderId) {
        throw new Error('Failed to create Google Drive folder.');
    }

    // Upload JSON file
    await drive.files.create({
        requestBody: {
            name: 'patient_data_export.json',
            parents: [folderId],
        },
        media: {
            mimeType: 'application/json',
            body: jsonData,
        },
        fields: 'id',
    });

    // Upload CSV file
    await drive.files.create({
        requestBody: {
            name: 'patient_data_export.csv',
            parents: [folderId],
        },
        media: {
            mimeType: 'text/csv',
            body: csvData,
        },
        fields: 'id',
    });

    return { folderId, folderName };
}
