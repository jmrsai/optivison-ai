
'use client';
import { useMemo, type DependencyList } from 'react';
import { type Query, type DocumentReference, type Firestore } from 'firebase/firestore';

// Define a type that represents a Firestore reference or query, or null.
type FirestoreRefOrQuery = Query | DocumentReference | null;

/**
 * Custom hook to memoize Firestore queries and document references.
 *
 * This hook is essential for preventing infinite loops when using `useCollection` or `useDocument`
 * from `react-firebase-hooks`. Those hooks re-run their effects whenever their query/reference
 * dependency changes. If you create the query inline in your component, it will be a new object
 * on every render, causing the hook to re-fetch data endlessly.
 *
 * `useMemoFirebase` solves this by using `React.useMemo` to stabilize the query/reference object.
 * It only re-creates the query when the dependencies in the dependency array change.
 *
 * @param factory A function that returns a Firestore Query, DocumentReference, or null.
 * @param deps An array of dependencies that, when changed, will cause the factory function to re-run.
 * @returns The memoized Firestore reference or query.
 */
export function useMemoFirebase<T extends FirestoreRefOrQuery>(
  factory: () => T,
  deps: DependencyList
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps);
}
