

const firebaseConfig = {
  apiKey: "AIzaSyAgFv1mZHfjE12ifT7FHoCMnP97ysngwx0",
  authDomain: "synergy-research-hub.firebaseapp.com",
  projectId: "synergy-research-hub",
  messagingSenderId: "617880536152",
  appId: "1:617880536152:web:f9d5ca6ef1da197cb1762d",
  measurementId: "G-6G5WCLY2WW"
};

// this function is exported FOR CLIENT-SIDE USE ONLY!
export function getFirebaseConfigClient() {
    // Check if all required fields are present
    if (
        !firebaseConfig.apiKey ||
        !firebaseConfig.authDomain ||
        !firebaseConfig.projectId
    ) {
        throw new Error(
        'Firebase configuration is missing or incomplete. Please check your environment variables.'
        );
    }
    return firebaseConfig;
};
