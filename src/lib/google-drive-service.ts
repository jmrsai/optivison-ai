
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { google } from 'googleapis';
import { initializeServerApp } from '@/firebase/server-provider';
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";
import type { Patient, Scan } from './types';

const drive = google.drive('v3');

async function getAuthenticatedClient(idToken: string) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ id_token: idToken });
    google.options({ auth });
    return auth;
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

    const patients = patientSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Patient));
    const scans = scanSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Scan));

    return { patients, scans };
}

export const exportDataToDrive = ai.defineFlow(
    {
        name: 'exportDataToDrive',
        inputSchema: z.tuple([z.string(), z.string()]),
        outputSchema: z.object({ folderId: z.string(), folderName: z.string() }),
    },
    async (idToken, clinicianId) => {
        await getAuthenticatedClient(idToken);
        
        // 1. Fetch all data for the clinician
        const data = await getAllDataForClinician(clinicianId);
        const jsonData = JSON.stringify(data, null, 2);

        // 2. Create a unique folder for the backup
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

        // 3. Upload the JSON file
        const fileMetadata = {
            name: 'patient_data_export.json',
            parents: [folderId],
        };

        const media = {
            mimeType: 'application/json',
            body: jsonData,
        };

        await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id',
        });

        return { folderId, folderName };
    }
);
