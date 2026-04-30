import { doc, setDoc, getDoc, collection, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebase';
import { createLogger } from '@/lib/logger';

const logger = createLogger('firebaseService');

export const FirebaseService = {
  // Sync the entire state to the cloud (for migration)
  async saveFullSync(uid: string, data: any) {
    try {
      const userDoc = doc(db, 'users', uid);
      await setDoc(userDoc, data, { merge: true });
      logger.info('db_save_full_sync_success', { input: { uid } });
    } catch (e: any) {
      logger.error('db_save_full_sync_error', { error: e.message, input: { uid } });
    }
  },

  // Load state from cloud
  async fetchUserData(uid: string) {
    try {
      const userDoc = doc(db, 'users', uid);
      const snap = await getDoc(userDoc);
      logger.info('db_fetch_user_data_success', { input: { uid }, output: { exists: snap.exists() } });
      return snap.exists() ? snap.data() : null;
    } catch (e: any) {
      logger.error('db_fetch_user_data_error', { error: e.message, input: { uid } });
      return null;
    }
  },

  // Atomic updates (optional, but good for scale)
  async updateTransaction(uid: string, transactions: any[]) {
    try {
      const userDoc = doc(db, 'users', uid);
      await updateDoc(userDoc, { transactions });
    } catch (e: any) {
      logger.error('db_update_transaction_error', { error: e.message, input: { uid } });
    }
  },

  async updateItems(uid: string, items: any[]) {
    try {
      const userDoc = doc(db, 'users', uid);
      await updateDoc(userDoc, { items });
    } catch (e: any) {
      logger.error('db_update_items_error', { error: e.message, input: { uid } });
    }
  },

  async updateContacts(uid: string, contacts: any[]) {
    try {
      const userDoc = doc(db, 'users', uid);
      await updateDoc(userDoc, { contacts });
    } catch (e: any) {
      logger.error('db_update_contacts_error', { error: e.message, input: { uid } });
    }
  },

  async updateIdentity(uid: string, identity: any) {
    try {
      const userDoc = doc(db, 'users', uid);
      await updateDoc(userDoc, { identity });
    } catch (e: any) {
      logger.error('db_update_identity_error', { error: e.message, input: { uid } });
    }
  }
};
