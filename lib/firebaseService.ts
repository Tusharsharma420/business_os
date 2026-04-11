import { doc, setDoc, getDoc, collection, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebase';

export const FirebaseService = {
  // Sync the entire state to the cloud (for migration)
  async saveFullSync(uid: string, data: any) {
    const userDoc = doc(db, 'users', uid);
    await setDoc(userDoc, data, { merge: true });
  },

  // Load state from cloud
  async fetchUserData(uid: string) {
    const userDoc = doc(db, 'users', uid);
    const snap = await getDoc(userDoc);
    return snap.exists() ? snap.data() : null;
  },

  // Atomic updates (optional, but good for scale)
  async updateTransaction(uid: string, transactions: any[]) {
    const userDoc = doc(db, 'users', uid);
    await updateDoc(userDoc, { transactions });
  },

  async updateItems(uid: string, items: any[]) {
    const userDoc = doc(db, 'users', uid);
    await updateDoc(userDoc, { items });
  },

  async updateContacts(uid: string, contacts: any[]) {
    const userDoc = doc(db, 'users', uid);
    await updateDoc(userDoc, { contacts });
  },

  async updateIdentity(uid: string, identity: any) {
    const userDoc = doc(db, 'users', uid);
    await updateDoc(userDoc, { identity });
  }
};
