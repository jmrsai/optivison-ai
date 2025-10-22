'use server';

/**
 * @fileOverview A Genkit flow for exporting user data to Google Drive.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { google } from 'googleapis';
import { initializeServerApp } from '@/firebase/server-provider';
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";
import type { Patient, Scan } from '@/lib/types';
import { decrypt } from '@/lib/crypto';
import { GoogleAuth } from 'google-auth-library';

const drive = google.drive('v3');


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
        const patientData = doc.data() as Omit<Patient, 'id'>;
        return {
            id: doc.id,
            ...patientData,
            history: await decrypt(patientData.history),
        } as Patient;
    }));
    
    const scans = await Promise.all(scanSnap.docs.map(async (doc) => {
        const scanData = doc.data() as Omit<Scan, 'id'>;
        return {
            id: doc.id,
            ...scanData,
            clinicalNotes: scanData.clinicalNotes ? await decrypt(scanData.clinicalNotes) : '',
        } as Scan;
    }));

    return { patients, scans };
}


function convertToCsv(data: { patients: Patient[], scans: Scan[] }): string {
    const { patients, scans } = data;
    
    const patientHeaders = ['patientId', 'clinicianId', 'name', 'age', 'gender', 'lastVisit', 'riskLevel', 'history'];
    const patientRows = patients.map(p => 
        [p.id, p.clinicianId, p.name, p.age, p.gender, p.lastVisit, p.riskLevel, `"${p.history.replace(/"/g, '""')}"`].join(',')
    );
    const patientCsv = [patientHeaders.join(','), ...patientRows].join('\n');

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

export const exportDataToDrive = ai.defineFlow(
    {
        name: 'exportDataToDrive',
        inputSchema: z.object({
            idToken: z.string().describe("The user's Firebase ID token."),
            clinicianId: z.string().describe("The clinician's user ID."),
        }),
        outputSchema: z.object({ folderId: z.string(), folderName: z.string() }),
    },
    async ({ idToken, clinicianId }) => {
        // This is a complex step. In a real app, you would exchange the Firebase ID token
        // for a Google OAuth2 access token that has the drive.file scope.
        // This requires setting up OAuth consent screens in Google Cloud.
        // For this demo, we'll use a simplified auth method assuming the environment
        // is configured with sufficient permissions (e.g., a service account).
        const auth = new GoogleAuth({
            scopes: 'https://www.googleapis.com/auth/drive.file',
        });
        const authClient = await auth.getClient();
        google.options({ auth: authClient });

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
);
