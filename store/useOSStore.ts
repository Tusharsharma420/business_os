import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BusinessIdentity {
  name: string;
  taxId: string;
  logoUrl: string;
  signatureName: string;
  address: string;
  email: string;
  phone: string;
  currency: string;
  taxRate: number; // percentage e.g. 18 for 18%
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

export type ExpenseCategory =
  | 'Salaries'
  | 'Rent'
  | 'Marketing'
  | 'Software'
  | 'Utilities'
  | 'Travel'
  | 'Supplies'
  | 'Other';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Salaries', 'Rent', 'Marketing', 'Software',
  'Utilities', 'Travel', 'Supplies', 'Other',
];

export const EXPENSE_CATEGORY_EMOJI: Record<ExpenseCategory, string> = {
  Salaries: '👥', Rent: '🏢', Marketing: '📣', Software: '💻',
  Utilities: '⚡', Travel: '✈️', Supplies: '📦', Other: '🗂️',
};

export interface Transaction {
  id: string;
  date: string;
  type: 'Money In' | 'Money Out';
  amount: number;
  contactId?: string;
  itemId?: string;
  qty?: number;
  note?: string;
  expenseCategory?: ExpenseCategory; // only for Money Out
}

interface OSState {
  identity: BusinessIdentity;
  contacts: Contact[];
  items: Item[];
  transactions: Transaction[];

  updateIdentity: (config: Partial<BusinessIdentity>) => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addContact: (contact: Omit<Contact, 'id'>) => void;
  deleteContact: (id: string) => void;
  addItem: (item: Omit<Item, 'id'>) => void;
  deleteItem: (id: string) => void;
}

const SEED_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Dave Marketing Co.', type: 'Vendor' },
  { id: 'c2', name: 'Acme Corporation', type: 'Customer' },
];

const SEED_ITEMS: Item[] = [
  { id: 'i1', name: 'Monthly Design Retainer', price: 5000, category: 'Service' },
  { id: 'i2', name: 'Premium Server Rack', price: 1200, category: 'Hardware' },
];

const SEED_TRANSACTIONS: Transaction[] = [
  { id: 'tx1', date: '2024-10-24T10:00:00.000Z', type: 'Money Out', amount: 500, contactId: 'c1', expenseCategory: 'Marketing', note: 'Q4 campaign' },
  { id: 'tx2', date: '2024-10-25T15:30:00.000Z', type: 'Money In', amount: 10000, contactId: 'c2', itemId: 'i1', qty: 2, note: 'Design retainer x2' },
];

export const useOSStore = create<OSState>()(
  persist(
    (set) => ({
      identity: {
        name: 'Your Business',
        taxId: '',
        logoUrl: 'https://cdn-icons-png.flaticon.com/512/8621/8621183.png',
        signatureName: 'Authorized Signatory',
        address: '',
        email: '',
        phone: '',
        currency: '₹',
        taxRate: 18,
      },
      contacts: SEED_CONTACTS,
      items: SEED_ITEMS,
      transactions: SEED_TRANSACTIONS,

      updateIdentity: (config) =>
        set((state) => ({ identity: { ...state.identity, ...config } })),

      addTransaction: (tx) =>
        set((state) => ({
          transactions: [{ id: `tx_${Date.now()}`, ...tx }, ...state.transactions],
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      addContact: (c) =>
        set((state) => ({
          contacts: [{ id: `c_${Date.now()}`, ...c }, ...state.contacts],
        })),

      deleteContact: (id) =>
        set((state) => {
          const inUse = state.transactions.some((t) => t.contactId === id);
          if (inUse) {
            throw new Error('Contact in use. Clear transactions first.');
          }
          return { contacts: state.contacts.filter((c) => c.id !== id) };
        }),

      addItem: (i) =>
        set((state) => ({
          items: [{ id: `i_${Date.now()}`, ...i }, ...state.items],
        })),

      deleteItem: (id) =>
        set((state) => {
          const inUse = state.transactions.some((t) => t.itemId === id);
          if (inUse) {
            throw new Error('Item in use. Clear transactions first.');
          }
          return { items: state.items.filter((i) => i.id !== id) };
        }),
    }),
    {
      name: 'business-os-v26',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
