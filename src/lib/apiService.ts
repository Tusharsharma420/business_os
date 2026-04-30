import Constants from 'expo-constants';
import { createLogger } from '@/lib/logger';

const logger = createLogger('apiService');
const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';

export const ApiService = {
  // Sync the entire state (Fallback)
  async saveFullSync(uid: string, data: any) {
    logger.info('api_save_full_sync_mock', { input: { uid } });
    // For now we don't sync the entire state blob, we sync individual tables
  },

  // Load state from cloud
  async fetchUserData(uid: string) {
    try {
      // Fetch all to build the local state
      const [contacts, items, transactions] = await Promise.all([
        fetch(`${API_URL}/contacts`).then(r => r.json()),
        fetch(`${API_URL}/items`).then(r => r.json()),
        fetch(`${API_URL}/transactions`).then(r => r.json()),
      ]);
      logger.info('api_fetch_user_data_success', { input: { uid } });
      return { contacts, items, transactions };
    } catch (e: any) {
      logger.error('api_fetch_user_data_error', { error: e.message, input: { uid } });
      return null;
    }
  },

  // Atomic updates
  async updateTransaction(uid: string, transactions: any[]) {
    // In a real API we would just send the latest one, but to match the old Firebase pattern
    // we can either overwrite or just take the first newly added transaction.
    // For simplicity, we assume we just send the latest transaction if we refactor the slice,
    // or we can implement an overwrite endpoint on the backend.
    
    // Instead of sending the whole array, let's just log it. 
    // In our refactor we will call atomic methods directly.
    logger.info('Use atomic addTransaction instead.');
  },

  async addTransaction(transaction: any) {
    try {
      const res = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction)
      });
      return await res.json();
    } catch (e: any) {
      logger.error('api_add_transaction_error', { error: e.message });
    }
  },

  async addItem(item: any) {
    try {
      const res = await fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      return await res.json();
    } catch (e: any) {
      logger.error('api_add_item_error', { error: e.message });
    }
  },

  async addContact(contact: any) {
    try {
      const res = await fetch(`${API_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
      });
      return await res.json();
    } catch (e: any) {
      logger.error('api_add_contact_error', { error: e.message });
    }
  },

  // Legacy full array update signatures to avoid breaking immediately
  async updateItems(uid: string, items: any[]) {
    // In our new architecture, we should update individually, 
    // but for now, this stub prevents crashes.
  },

  async updateContacts(uid: string, contacts: any[]) {},

  async updateIdentity(uid: string, identity: any) {
    // Identity is a singleton in our logic for now
    try {
      await fetch(`${API_URL}/identity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(identity)
      });
    } catch (e) {
      logger.error('api_update_identity_error', { error: (e as any).message });
    }
  },

  async deleteContact(id: string) {
    return fetch(`${API_URL}/contacts/${id}`, { method: 'DELETE' });
  },

  async deleteItem(id: string) {
    return fetch(`${API_URL}/items/${id}`, { method: 'DELETE' });
  },

  async deleteTransaction(id: string) {
    return fetch(`${API_URL}/transactions/${id}`, { method: 'DELETE' });
  },

  async updateItem(id: string, updates: any) {
    try {
      const res = await fetch(`${API_URL}/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      return await res.json();
    } catch (e: any) {
      logger.error('api_update_item_error', { error: e.message });
    }
  },

  async updateContact(id: string, updates: any) {
    try {
      const res = await fetch(`${API_URL}/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      return await res.json();
    } catch (e: any) {
      logger.error('api_update_contact_error', { error: e.message });
    }
  }
};
