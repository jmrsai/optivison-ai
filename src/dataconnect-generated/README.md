# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetUserById*](#getuserbyid)
  - [*ListScansForPatient*](#listscansforpatient)
- [**Mutations**](#mutations)
  - [*CreateNewScan*](#createnewscan)
  - [*UpdateDiagnosisClinicianNotes*](#updatediagnosiscliniciannotes)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetUserById
You can execute the `GetUserById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUserById(vars: GetUserByIdVariables): QueryPromise<GetUserByIdData, GetUserByIdVariables>;

interface GetUserByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserByIdVariables): QueryRef<GetUserByIdData, GetUserByIdVariables>;
}
export const getUserByIdRef: GetUserByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserById(dc: DataConnect, vars: GetUserByIdVariables): QueryPromise<GetUserByIdData, GetUserByIdVariables>;

interface GetUserByIdRef {
  ...
  (dc: DataConnect, vars: GetUserByIdVariables): QueryRef<GetUserByIdData, GetUserByIdVariables>;
}
export const getUserByIdRef: GetUserByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserByIdRef:
```typescript
const name = getUserByIdRef.operationName;
console.log(name);
```

### Variables
The `GetUserById` query requires an argument of type `GetUserByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetUserById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserByIdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUserById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserById, GetUserByIdVariables } from '@dataconnect/generated';

// The `GetUserById` query requires an argument of type `GetUserByIdVariables`:
const getUserByIdVars: GetUserByIdVariables = {
  id: ..., 
};

// Call the `getUserById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserById(getUserByIdVars);
// Variables can be defined inline as well.
const { data } = await getUserById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserById(dataConnect, getUserByIdVars);

console.log(data.user);

// Or, you can use the `Promise` API.
getUserById(getUserByIdVars).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetUserById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserByIdRef, GetUserByIdVariables } from '@dataconnect/generated';

// The `GetUserById` query requires an argument of type `GetUserByIdVariables`:
const getUserByIdVars: GetUserByIdVariables = {
  id: ..., 
};

// Call the `getUserByIdRef()` function to get a reference to the query.
const ref = getUserByIdRef(getUserByIdVars);
// Variables can be defined inline as well.
const ref = getUserByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserByIdRef(dataConnect, getUserByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListScansForPatient
You can execute the `ListScansForPatient` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listScansForPatient(vars: ListScansForPatientVariables): QueryPromise<ListScansForPatientData, ListScansForPatientVariables>;

interface ListScansForPatientRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListScansForPatientVariables): QueryRef<ListScansForPatientData, ListScansForPatientVariables>;
}
export const listScansForPatientRef: ListScansForPatientRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listScansForPatient(dc: DataConnect, vars: ListScansForPatientVariables): QueryPromise<ListScansForPatientData, ListScansForPatientVariables>;

interface ListScansForPatientRef {
  ...
  (dc: DataConnect, vars: ListScansForPatientVariables): QueryRef<ListScansForPatientData, ListScansForPatientVariables>;
}
export const listScansForPatientRef: ListScansForPatientRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listScansForPatientRef:
```typescript
const name = listScansForPatientRef.operationName;
console.log(name);
```

### Variables
The `ListScansForPatient` query requires an argument of type `ListScansForPatientVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListScansForPatientVariables {
  patientId: UUIDString;
}
```
### Return Type
Recall that executing the `ListScansForPatient` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListScansForPatientData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListScansForPatient`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listScansForPatient, ListScansForPatientVariables } from '@dataconnect/generated';

// The `ListScansForPatient` query requires an argument of type `ListScansForPatientVariables`:
const listScansForPatientVars: ListScansForPatientVariables = {
  patientId: ..., 
};

// Call the `listScansForPatient()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listScansForPatient(listScansForPatientVars);
// Variables can be defined inline as well.
const { data } = await listScansForPatient({ patientId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listScansForPatient(dataConnect, listScansForPatientVars);

console.log(data.scans);

// Or, you can use the `Promise` API.
listScansForPatient(listScansForPatientVars).then((response) => {
  const data = response.data;
  console.log(data.scans);
});
```

### Using `ListScansForPatient`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listScansForPatientRef, ListScansForPatientVariables } from '@dataconnect/generated';

// The `ListScansForPatient` query requires an argument of type `ListScansForPatientVariables`:
const listScansForPatientVars: ListScansForPatientVariables = {
  patientId: ..., 
};

// Call the `listScansForPatientRef()` function to get a reference to the query.
const ref = listScansForPatientRef(listScansForPatientVars);
// Variables can be defined inline as well.
const ref = listScansForPatientRef({ patientId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listScansForPatientRef(dataConnect, listScansForPatientVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.scans);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.scans);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateNewScan
You can execute the `CreateNewScan` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createNewScan(vars: CreateNewScanVariables): MutationPromise<CreateNewScanData, CreateNewScanVariables>;

interface CreateNewScanRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewScanVariables): MutationRef<CreateNewScanData, CreateNewScanVariables>;
}
export const createNewScanRef: CreateNewScanRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createNewScan(dc: DataConnect, vars: CreateNewScanVariables): MutationPromise<CreateNewScanData, CreateNewScanVariables>;

interface CreateNewScanRef {
  ...
  (dc: DataConnect, vars: CreateNewScanVariables): MutationRef<CreateNewScanData, CreateNewScanVariables>;
}
export const createNewScanRef: CreateNewScanRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createNewScanRef:
```typescript
const name = createNewScanRef.operationName;
console.log(name);
```

### Variables
The `CreateNewScan` mutation requires an argument of type `CreateNewScanVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateNewScanVariables {
  patientId: UUIDString;
  uploaderId: UUIDString;
  imageUrl: string;
  scanType: string;
}
```
### Return Type
Recall that executing the `CreateNewScan` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateNewScanData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateNewScanData {
  scan_insert: Scan_Key;
}
```
### Using `CreateNewScan`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createNewScan, CreateNewScanVariables } from '@dataconnect/generated';

// The `CreateNewScan` mutation requires an argument of type `CreateNewScanVariables`:
const createNewScanVars: CreateNewScanVariables = {
  patientId: ..., 
  uploaderId: ..., 
  imageUrl: ..., 
  scanType: ..., 
};

// Call the `createNewScan()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createNewScan(createNewScanVars);
// Variables can be defined inline as well.
const { data } = await createNewScan({ patientId: ..., uploaderId: ..., imageUrl: ..., scanType: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createNewScan(dataConnect, createNewScanVars);

console.log(data.scan_insert);

// Or, you can use the `Promise` API.
createNewScan(createNewScanVars).then((response) => {
  const data = response.data;
  console.log(data.scan_insert);
});
```

### Using `CreateNewScan`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createNewScanRef, CreateNewScanVariables } from '@dataconnect/generated';

// The `CreateNewScan` mutation requires an argument of type `CreateNewScanVariables`:
const createNewScanVars: CreateNewScanVariables = {
  patientId: ..., 
  uploaderId: ..., 
  imageUrl: ..., 
  scanType: ..., 
};

// Call the `createNewScanRef()` function to get a reference to the mutation.
const ref = createNewScanRef(createNewScanVars);
// Variables can be defined inline as well.
const ref = createNewScanRef({ patientId: ..., uploaderId: ..., imageUrl: ..., scanType: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createNewScanRef(dataConnect, createNewScanVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.scan_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.scan_insert);
});
```

## UpdateDiagnosisClinicianNotes
You can execute the `UpdateDiagnosisClinicianNotes` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateDiagnosisClinicianNotes(vars: UpdateDiagnosisClinicianNotesVariables): MutationPromise<UpdateDiagnosisClinicianNotesData, UpdateDiagnosisClinicianNotesVariables>;

interface UpdateDiagnosisClinicianNotesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateDiagnosisClinicianNotesVariables): MutationRef<UpdateDiagnosisClinicianNotesData, UpdateDiagnosisClinicianNotesVariables>;
}
export const updateDiagnosisClinicianNotesRef: UpdateDiagnosisClinicianNotesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateDiagnosisClinicianNotes(dc: DataConnect, vars: UpdateDiagnosisClinicianNotesVariables): MutationPromise<UpdateDiagnosisClinicianNotesData, UpdateDiagnosisClinicianNotesVariables>;

interface UpdateDiagnosisClinicianNotesRef {
  ...
  (dc: DataConnect, vars: UpdateDiagnosisClinicianNotesVariables): MutationRef<UpdateDiagnosisClinicianNotesData, UpdateDiagnosisClinicianNotesVariables>;
}
export const updateDiagnosisClinicianNotesRef: UpdateDiagnosisClinicianNotesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateDiagnosisClinicianNotesRef:
```typescript
const name = updateDiagnosisClinicianNotesRef.operationName;
console.log(name);
```

### Variables
The `UpdateDiagnosisClinicianNotes` mutation requires an argument of type `UpdateDiagnosisClinicianNotesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateDiagnosisClinicianNotesVariables {
  id: UUIDString;
  clinicianNotes?: string | null;
}
```
### Return Type
Recall that executing the `UpdateDiagnosisClinicianNotes` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateDiagnosisClinicianNotesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateDiagnosisClinicianNotesData {
  diagnosis_update?: Diagnosis_Key | null;
}
```
### Using `UpdateDiagnosisClinicianNotes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateDiagnosisClinicianNotes, UpdateDiagnosisClinicianNotesVariables } from '@dataconnect/generated';

// The `UpdateDiagnosisClinicianNotes` mutation requires an argument of type `UpdateDiagnosisClinicianNotesVariables`:
const updateDiagnosisClinicianNotesVars: UpdateDiagnosisClinicianNotesVariables = {
  id: ..., 
  clinicianNotes: ..., // optional
};

// Call the `updateDiagnosisClinicianNotes()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateDiagnosisClinicianNotes(updateDiagnosisClinicianNotesVars);
// Variables can be defined inline as well.
const { data } = await updateDiagnosisClinicianNotes({ id: ..., clinicianNotes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateDiagnosisClinicianNotes(dataConnect, updateDiagnosisClinicianNotesVars);

console.log(data.diagnosis_update);

// Or, you can use the `Promise` API.
updateDiagnosisClinicianNotes(updateDiagnosisClinicianNotesVars).then((response) => {
  const data = response.data;
  console.log(data.diagnosis_update);
});
```

### Using `UpdateDiagnosisClinicianNotes`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateDiagnosisClinicianNotesRef, UpdateDiagnosisClinicianNotesVariables } from '@dataconnect/generated';

// The `UpdateDiagnosisClinicianNotes` mutation requires an argument of type `UpdateDiagnosisClinicianNotesVariables`:
const updateDiagnosisClinicianNotesVars: UpdateDiagnosisClinicianNotesVariables = {
  id: ..., 
  clinicianNotes: ..., // optional
};

// Call the `updateDiagnosisClinicianNotesRef()` function to get a reference to the mutation.
const ref = updateDiagnosisClinicianNotesRef(updateDiagnosisClinicianNotesVars);
// Variables can be defined inline as well.
const ref = updateDiagnosisClinicianNotesRef({ id: ..., clinicianNotes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateDiagnosisClinicianNotesRef(dataConnect, updateDiagnosisClinicianNotesVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.diagnosis_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.diagnosis_update);
});
```

