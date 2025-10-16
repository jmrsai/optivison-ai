import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateNewScanData {
  scan_insert: Scan_Key;
}

export interface CreateNewScanVariables {
  patientId: UUIDString;
  uploaderId: UUIDString;
  imageUrl: string;
  scanType: string;
}

export interface Diagnosis_Key {
  id: UUIDString;
  __typename?: 'Diagnosis_Key';
}

export interface Disease_Key {
  id: UUIDString;
  __typename?: 'Disease_Key';
}

export interface GetUserByIdData {
  user?: {
    id: UUIDString;
    displayName: string;
    email: string;
    hospitalAffiliation?: string | null;
    phoneNumber?: string | null;
    role: string;
  } & User_Key;
}

export interface GetUserByIdVariables {
  id: UUIDString;
}

export interface ListScansForPatientData {
  scans: ({
    id: UUIDString;
    deviceUsed?: string | null;
    imageUrl: string;
    notes?: string | null;
    scanType: string;
    uploadDate: TimestampString;
  } & Scan_Key)[];
}

export interface ListScansForPatientVariables {
  patientId: UUIDString;
}

export interface Patient_Key {
  id: UUIDString;
  __typename?: 'Patient_Key';
}

export interface Scan_Key {
  id: UUIDString;
  __typename?: 'Scan_Key';
}

export interface UpdateDiagnosisClinicianNotesData {
  diagnosis_update?: Diagnosis_Key | null;
}

export interface UpdateDiagnosisClinicianNotesVariables {
  id: UUIDString;
  clinicianNotes?: string | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateNewScanRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewScanVariables): MutationRef<CreateNewScanData, CreateNewScanVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateNewScanVariables): MutationRef<CreateNewScanData, CreateNewScanVariables>;
  operationName: string;
}
export const createNewScanRef: CreateNewScanRef;

export function createNewScan(vars: CreateNewScanVariables): MutationPromise<CreateNewScanData, CreateNewScanVariables>;
export function createNewScan(dc: DataConnect, vars: CreateNewScanVariables): MutationPromise<CreateNewScanData, CreateNewScanVariables>;

interface GetUserByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserByIdVariables): QueryRef<GetUserByIdData, GetUserByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserByIdVariables): QueryRef<GetUserByIdData, GetUserByIdVariables>;
  operationName: string;
}
export const getUserByIdRef: GetUserByIdRef;

export function getUserById(vars: GetUserByIdVariables): QueryPromise<GetUserByIdData, GetUserByIdVariables>;
export function getUserById(dc: DataConnect, vars: GetUserByIdVariables): QueryPromise<GetUserByIdData, GetUserByIdVariables>;

interface ListScansForPatientRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListScansForPatientVariables): QueryRef<ListScansForPatientData, ListScansForPatientVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListScansForPatientVariables): QueryRef<ListScansForPatientData, ListScansForPatientVariables>;
  operationName: string;
}
export const listScansForPatientRef: ListScansForPatientRef;

export function listScansForPatient(vars: ListScansForPatientVariables): QueryPromise<ListScansForPatientData, ListScansForPatientVariables>;
export function listScansForPatient(dc: DataConnect, vars: ListScansForPatientVariables): QueryPromise<ListScansForPatientData, ListScansForPatientVariables>;

interface UpdateDiagnosisClinicianNotesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateDiagnosisClinicianNotesVariables): MutationRef<UpdateDiagnosisClinicianNotesData, UpdateDiagnosisClinicianNotesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateDiagnosisClinicianNotesVariables): MutationRef<UpdateDiagnosisClinicianNotesData, UpdateDiagnosisClinicianNotesVariables>;
  operationName: string;
}
export const updateDiagnosisClinicianNotesRef: UpdateDiagnosisClinicianNotesRef;

export function updateDiagnosisClinicianNotes(vars: UpdateDiagnosisClinicianNotesVariables): MutationPromise<UpdateDiagnosisClinicianNotesData, UpdateDiagnosisClinicianNotesVariables>;
export function updateDiagnosisClinicianNotes(dc: DataConnect, vars: UpdateDiagnosisClinicianNotesVariables): MutationPromise<UpdateDiagnosisClinicianNotesData, UpdateDiagnosisClinicianNotesVariables>;

