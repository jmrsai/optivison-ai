
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { google } from 'googleapis';
import { getAllDataForClinician } from './patient-service';

const drive = google.drive('v3');

async function getAuthenticatedClient(idToken: string) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ id_token: idToken });
    google.options({ auth });
    return auth;
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
