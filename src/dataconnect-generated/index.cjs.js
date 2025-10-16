const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'studio',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createNewScanRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewScan', inputVars);
}
createNewScanRef.operationName = 'CreateNewScan';
exports.createNewScanRef = createNewScanRef;

exports.createNewScan = function createNewScan(dcOrVars, vars) {
  return executeMutation(createNewScanRef(dcOrVars, vars));
};

const getUserByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserById', inputVars);
}
getUserByIdRef.operationName = 'GetUserById';
exports.getUserByIdRef = getUserByIdRef;

exports.getUserById = function getUserById(dcOrVars, vars) {
  return executeQuery(getUserByIdRef(dcOrVars, vars));
};

const listScansForPatientRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListScansForPatient', inputVars);
}
listScansForPatientRef.operationName = 'ListScansForPatient';
exports.listScansForPatientRef = listScansForPatientRef;

exports.listScansForPatient = function listScansForPatient(dcOrVars, vars) {
  return executeQuery(listScansForPatientRef(dcOrVars, vars));
};

const updateDiagnosisClinicianNotesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateDiagnosisClinicianNotes', inputVars);
}
updateDiagnosisClinicianNotesRef.operationName = 'UpdateDiagnosisClinicianNotes';
exports.updateDiagnosisClinicianNotesRef = updateDiagnosisClinicianNotesRef;

exports.updateDiagnosisClinicianNotes = function updateDiagnosisClinicianNotes(dcOrVars, vars) {
  return executeMutation(updateDiagnosisClinicianNotesRef(dcOrVars, vars));
};
