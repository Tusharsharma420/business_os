import { create } from 'zustand';

export interface BusinessIdentity {
  name: string;
  taxId: string;
  logoUrl: string;
  signatureName: string;
  address: string;
  email: string;
  phone: string;
}

export interface Contact {
  id: string;
  name: string;
  type: 'Customer' | 'Vendor' | 'Partner' | 'Other';
  description?: string;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  category: string;
}

// Replaces all complex accounting ledgers.
export interface Transaction {
  id: string;
  date: string;
  type: 'Money In' | 'Money Out';
  amount: number;
  contactId?: string;
  itemId?: string; // Singular item purchase for simplicity in V2 MVP
  qty?: number;
}

interface OSState {
  identity: BusinessIdentity;
  contacts: Contact[];
  items: Item[];
  transactions: Transaction[];
  
  // Actions
  updateIdentity: (config: Partial<BusinessIdentity>) => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  addContact: (contact: Omit<Contact, 'id'>) => void;
  addItem: (item: Omit<Item, 'id'>) => void;
}

export const useOSStore = create<OSState>((set) => ({
  identity: {
    name: 'Your Minimal Business',
    taxId: 'US-999-888-777',
    logoUrl: 'https://cdn-icons-png.flaticon.com/512/8621/8621183.png',
    signatureName: 'Authorized Admin',
    address: '123 Apple Way, Cupertino, CA',
    email: 'hello@business.com',
    phone: '+1 555-0199'
  },
  
  contacts: [
    { id: 'c1', name: 'Dave Marketing Co.', type: 'Vendor' },
    { id: 'c2', name: 'Acme Corporation', type: 'Customer' }
  ],

  items: [
    { id: 'i1', name: 'Monthly Design Retainer', price: 5000, category: 'Service' },
    { id: 'i2', name: 'Premium Server Rack', price: 1200, category: 'Hardware' }
  ],

  transactions: [
    { id: 'tx1', date: 'Oct 24', type: 'Money Out', amount: 500, contactId: 'c1' },
    { id: 'tx2', date: 'Oct 25', type: 'Money In', amount: 10000, contactId: 'c2', itemId: 'i1', qty: 2 }
  ],

  updateIdentity: (config) => set((state) => ({
    identity: { ...state.identity, ...config }
  })),

  addTransaction: (tx) => set((state) => ({
    transactions: [{ id: Date.now().toString(), ...tx }, ...state.transactions]
  })),

  addContact: (c) => set((state) => ({
    contacts: [{ id: Date.now().toString(), ...c }, ...state.contacts]
  })),

  addItem: (i) => set((state) => ({
    items: [{ id: Date.now().toString(), ...i }, ...state.items]
  })),
}));
