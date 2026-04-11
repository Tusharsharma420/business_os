import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseService } from '@/lib/firebaseService';

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
  monthlyRevenueGoal: number;
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
  stock: number;
  minStock: number;
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

  uid: string | null;
  updateIdentity: (config: Partial<BusinessIdentity>) => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addContact: (contact: Omit<Contact, 'id'>) => void;
  deleteContact: (id: string) => void;
  addItem: (item: Omit<Item, 'id'>) => void;
  updateItem: (id: string, updates: Partial<Omit<Item, 'id'>>) => void;
  deleteItem: (id: string) => void;
  syncWithCloud: (uid: string) => Promise<void>;
}

const SEED_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Dave Marketing Co.', type: 'Vendor' },
  { id: 'c2', name: 'Acme Corporation', type: 'Customer' },
];

const SEED_ITEMS: Item[] = [
  { id: 'i1', name: 'Monthly Design Retainer', price: 5000, category: 'Service', stock: 999, minStock: 0 },
  { id: 'i2', name: 'Premium Server Rack', price: 1200, category: 'Hardware', stock: 5, minStock: 2 },
];

const SEED_TRANSACTIONS: Transaction[] = [
  { id: 'tx1', date: '2024-10-24T10:00:00.000Z', type: 'Money Out', amount: 500, contactId: 'c1', expenseCategory: 'Marketing', note: 'Q4 campaign' },
  { id: 'tx2', date: '2024-10-25T15:30:00.000Z', type: 'Money In', amount: 10000, contactId: 'c2', itemId: 'i1', qty: 2, note: 'Design retainer x2' },
];

export const useOSStore = create<OSState>()(
  persist(
    (set, get) => ({
      uid: null,
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
        monthlyRevenueGoal: 50000,
      },
      contacts: SEED_CONTACTS,
      items: SEED_ITEMS,
      transactions: SEED_TRANSACTIONS,

      updateIdentity: (config) =>
        set((state) => {
          const next = { identity: { ...state.identity, ...config } };
          if (state.uid) FirebaseService.updateIdentity(state.uid, next.identity);
          return next;
        }),

      addTransaction: (tx) =>
        set((state) => {
          let updatedItems = state.items;
          if (tx.type === 'Money In' && tx.itemId) {
            updatedItems = state.items.map(item => 
              item.id === tx.itemId 
                ? { ...item, stock: item.stock - (tx.qty || 1) } 
                : item
            );
          }
          const nextTransactions = [{ id: `tx_${Date.now()}`, ...tx }, ...state.transactions];
          if (state.uid) {
            FirebaseService.updateTransaction(state.uid, nextTransactions);
            FirebaseService.updateItems(state.uid, updatedItems);
          }
          return {
            items: updatedItems,
            transactions: nextTransactions,
          };
        }),

      deleteTransaction: (id) =>
        set((state) => {
          const next = { transactions: state.transactions.filter((t) => t.id !== id) };
          if (state.uid) FirebaseService.updateTransaction(state.uid, next.transactions);
          return next;
        }),

      addContact: (c) =>
        set((state) => {
          const next = { contacts: [{ id: `c_${Date.now()}`, ...c }, ...state.contacts] };
          if (state.uid) FirebaseService.updateContacts(state.uid, next.contacts);
          return next;
        }),

      deleteContact: (id) =>
        set((state) => {
          const inUse = state.transactions.some((t) => t.contactId === id);
          if (inUse) throw new Error('Contact in use. Clear transactions first.');
          const next = { contacts: state.contacts.filter((c) => c.id !== id) };
          if (state.uid) FirebaseService.updateContacts(state.uid, next.contacts);
          return next;
        }),

      addItem: (i) =>
        set((state) => {
          const next = { items: [{ id: `i_${Date.now()}`, ...i, stock: i.stock ?? 0, minStock: i.minStock ?? 0 }, ...state.items] };
          if (state.uid) FirebaseService.updateItems(state.uid, next.items);
          return next;
        }),

      updateItem: (id, updates) =>
        set((state) => {
          const next = { items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)) };
          if (state.uid) FirebaseService.updateItems(state.uid, next.items);
          return next;
        }),

      deleteItem: (id) =>
        set((state) => {
          const inUse = state.transactions.some((t) => t.itemId === id);
          if (inUse) throw new Error('Item in use. Clear transactions first.');
          const next = { items: state.items.filter((i) => i.id !== id) };
          if (state.uid) FirebaseService.updateItems(state.uid, next.items);
          return next;
        }),

      syncWithCloud: async (uid) => {
        set({ uid });
        const cloudData = await FirebaseService.fetchUserData(uid);
        
        if (cloudData) {
          // Cloud exists: Hydrate state (Merging strategy: Cloud wins)
          set({
            identity: { ...get().identity, ...cloudData.identity },
            contacts: cloudData.contacts || get().contacts,
            items: cloudData.items || get().items,
            transactions: cloudData.transactions || get().transactions,
          });
        } else {
          // Cloud empty: Push local migration
          const state = get();
          await FirebaseService.saveFullSync(uid, {
            identity: state.identity,
            contacts: state.contacts,
            items: state.items,
            transactions: state.transactions,
          });
        }
      },
    }),
    {
      name: 'business-os-v2.9',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
