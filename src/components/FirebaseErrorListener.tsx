'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';
import type { FirestorePermissionError } from '@/firebase/errors';

// This component is designed for development purposes to provide
// rich, contextual errors for Firestore security rule violations.
// In a production environment, you would likely have a more robust
// error logging and reporting system.
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      console.error("Firestore Permission Error:", error.toContextObject());

      // In a development environment, we can throw the error to make it
      // visible in the Next.js error overlay. This provides a rich
      // debugging experience.
      if (process.env.NODE_ENV === 'development') {
        // We throw the error in a timeout to break out of the current
        // React render cycle and trigger the Next.js overlay.
        setTimeout(() => {
            throw error;
        }, 0);
      } else {
        // In production, you might want to show a generic toast notification
        // and log the detailed error to a monitoring service.
        toast({
          variant: "destructive",
          title: "Permission Denied",
          description: "You do not have permission to perform this action.",
        });
      }
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  return null; // This component does not render anything
}
