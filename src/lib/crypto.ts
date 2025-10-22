
'use client';

// WARNING: This is a simplified cryptographic implementation for demonstration purposes.
// A production-grade E2EE system requires robust, audited key management and handling.

import { webcrypto } from 'crypto';

const isBrowser = () => typeof window !== 'undefined';

let secretKey: CryptoKey | null = null;
const KEY_STORAGE_NAME = 'optivision_crypto_key';

const cryptoProvider = () => {
    if (isBrowser()) {
        return window.crypto;
    }
    return webcrypto;
}

/**
 * Gets the secret key from storage or generates a new one.
 */
async function getKey(): Promise<CryptoKey> {
  if (secretKey) {
    return secretKey;
  }

  const crypto = cryptoProvider();

  if (!crypto?.subtle) {
    throw new Error('Web Crypto API is not available in this environment.');
  }

  if (isBrowser()) {
    let storedKey = localStorage.getItem(KEY_STORAGE_NAME);

    if (storedKey) {
        try {
        const jwk = JSON.parse(storedKey);
        secretKey = await crypto.subtle.importKey(
            'jwk',
            jwk,
            { name: 'AES-GCM' },
            true,
            ['encrypt', 'decrypt']
        );
        return secretKey;
        } catch (e) {
        console.error('Failed to import stored key, generating a new one.', e);
        }
    }
  }


  // Generate a new key if one doesn't exist
  const newKey = await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true, // a
    ['encrypt', 'decrypt']
  );

  if (isBrowser()) {
    // Export and store the new key
    const jwk = await crypto.subtle.exportKey('jwk', newKey);
    localStorage.setItem(KEY_STORAGE_NAME, JSON.stringify(jwk));
  }
  
  secretKey = newKey;
  return secretKey;
}

/**
 * Encrypts a string using AES-GCM.
 * @param plaintext The string to encrypt.
 * @returns A string containing the IV and the ciphertext, separated by a dot.
 */
export async function encrypt(plaintext: string): Promise<string> {
  if (!plaintext) return plaintext; 
  const crypto = cryptoProvider();

  try {
    const key = await getKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plaintext);

    const ciphertext = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encoded
    );

    // Combine IV and ciphertext for storage. Convert to base64 to avoid encoding issues.
    const ivString = btoa(String.fromCharCode.apply(null, Array.from(iv)));
    const ciphertextString = btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(ciphertext))));

    return `${ivString}.${ciphertextString}`;
  } catch (error) {
    console.error("Encryption failed", error);
    // In case of failure, return plaintext. In a real E2EE app, this should fail loudly.
    return plaintext;
  }
}

/**
 * Decrypts a string using AES-GCM.
 * @param encryptedString The string to decrypt (IV and ciphertext).
 * @returns The decrypted plaintext.
 */
export async function decrypt(encryptedString: string): Promise<string> {
   if (!encryptedString || !encryptedString.includes('.')) {
    return encryptedString;
  }
  
  const crypto = cryptoProvider();

  try {
    const key = await getKey();
    const parts = encryptedString.split('.');
    if (parts.length !== 2) {
      // Not a valid encrypted string, return as is.
      return encryptedString;
    }

    const ivString = atob(parts[0]);
    const ciphertextString = atob(parts[1]);

    const iv = new Uint8Array(ivString.split('').map(c => c.charCodeAt(0)));
    const ciphertext = new Uint8Array(ciphertextString.split('').map(c => c.charCodeAt(0)));

    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    // If decryption fails, it might be because the data was never encrypted.
    // Return the original string. In a real E2EE app, this would be an error.
    return encryptedString;
  }
}
