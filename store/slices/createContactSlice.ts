import { StateCreator } from 'zustand';
import { FirebaseService } from '@/lib/firebaseService';
import { generateId } from '@/utils/generateId';
import { createLogger } from '@/lib/logger';
import type { OSState } from '../useOSStore';

const logger = createLogger('ContactSlice');

export interface Contact {
  id: string;
  name: string;
  type: 'Customer' | 'Vendor' | 'Partner' | 'Other';
  description?: string;
}

export interface ContactSlice {
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id'>) => void;
  deleteContact: (id: string) => void;
}

export const SEED_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Dave Marketing Co.', type: 'Vendor' },
  { id: 'c2', name: 'Acme Corporation', type: 'Customer' },
];

export const createContactSlice: StateCreator<
  OSState,
  [],
  [],
  ContactSlice
> = (set, get) => ({
  contacts: SEED_CONTACTS,

  addContact: (c) =>
    set((state) => {
      const newContact = { id: generateId('c'), ...c };
      const next = { contacts: [newContact, ...state.contacts] };
      logger.info('add_contact_success', { input: { id: newContact.id } });
      if (state.uid) FirebaseService.updateContacts(state.uid, next.contacts);
      return next;
    }),

  deleteContact: (id) =>
    set((state) => {
      // Cross-slice constraint: Check if transactions use this contact
      const inUse = state.transactions.some((t) => t.contactId === id);
      if (inUse) {
        logger.warn('delete_contact_failed', { error: 'Contact in use.', input: { id } });
        throw new Error('Contact in use. Clear transactions first.');
      }
      const next = { contacts: state.contacts.filter((c) => c.id !== id) };
      logger.info('delete_contact_success', { input: { id } });
      if (state.uid) FirebaseService.updateContacts(state.uid, next.contacts);
      return next;
    }),
});
