import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'studio',
  location: 'us-east4'
};

export const createNewScanRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewScan', inputVars);
}
createNewScanRef.operationName = 'CreateNewScan';

export function createNewScan(dcOrVars, vars) {
  return executeMutation(createNewScanRef(dcOrVars, vars));
}

export const getUserByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserById', inputVars);
}
getUserByIdRef.operationName = 'GetUserById';

export function getUserById(dcOrVars, vars) {
  return executeQuery(getUserByIdRef(dcOrVars, vars));
}

export const listScansForPatientRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListScansForPatient', inputVars);
}
listScansForPatientRef.operationName = 'ListScansForPatient';

export function listScansForPatient(dcOrVars, vars) {
  return executeQuery(listScansForPatientRef(dcOrVars, vars));
}

export const updateDiagnosisClinicianNotesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateDiagnosisClinicianNotes', inputVars);
}
updateDiagnosisClinicianNotesRef.operationName = 'UpdateDiagnosisClinicianNotes';

export function updateDiagnosisClinicianNotes(dcOrVars, vars) {
  return executeMutation(updateDiagnosisClinicianNotesRef(dcOrVars, vars));
}

