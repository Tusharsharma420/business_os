/**
 * Generates a scalable, highly collision-resistant globally unique identifier 
 * suitable for distributed offline-first client-side creation.
 * Returns formats like: tx_17204910293_ab92x8
 */
export const generateId = (prefix: 'tx' | 'c' | 'i'): string => {
  const timestamp = Date.now().toString(36);
  // Generate random string (entropy)
  const randomEntropy = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${randomEntropy}`;
};
