import { CreateNewScanData, CreateNewScanVariables, GetUserByIdData, GetUserByIdVariables, ListScansForPatientData, ListScansForPatientVariables, UpdateDiagnosisClinicianNotesData, UpdateDiagnosisClinicianNotesVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateNewScan(options?: useDataConnectMutationOptions<CreateNewScanData, FirebaseError, CreateNewScanVariables>): UseDataConnectMutationResult<CreateNewScanData, CreateNewScanVariables>;
export function useCreateNewScan(dc: DataConnect, options?: useDataConnectMutationOptions<CreateNewScanData, FirebaseError, CreateNewScanVariables>): UseDataConnectMutationResult<CreateNewScanData, CreateNewScanVariables>;

export function useGetUserById(vars: GetUserByIdVariables, options?: useDataConnectQueryOptions<GetUserByIdData>): UseDataConnectQueryResult<GetUserByIdData, GetUserByIdVariables>;
export function useGetUserById(dc: DataConnect, vars: GetUserByIdVariables, options?: useDataConnectQueryOptions<GetUserByIdData>): UseDataConnectQueryResult<GetUserByIdData, GetUserByIdVariables>;

export function useListScansForPatient(vars: ListScansForPatientVariables, options?: useDataConnectQueryOptions<ListScansForPatientData>): UseDataConnectQueryResult<ListScansForPatientData, ListScansForPatientVariables>;
export function useListScansForPatient(dc: DataConnect, vars: ListScansForPatientVariables, options?: useDataConnectQueryOptions<ListScansForPatientData>): UseDataConnectQueryResult<ListScansForPatientData, ListScansForPatientVariables>;

export function useUpdateDiagnosisClinicianNotes(options?: useDataConnectMutationOptions<UpdateDiagnosisClinicianNotesData, FirebaseError, UpdateDiagnosisClinicianNotesVariables>): UseDataConnectMutationResult<UpdateDiagnosisClinicianNotesData, UpdateDiagnosisClinicianNotesVariables>;
export function useUpdateDiagnosisClinicianNotes(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateDiagnosisClinicianNotesData, FirebaseError, UpdateDiagnosisClinicianNotesVariables>): UseDataConnectMutationResult<UpdateDiagnosisClinicianNotesData, UpdateDiagnosisClinicianNotesVariables>;
