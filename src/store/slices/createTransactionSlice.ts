import { StateCreator } from 'zustand';
import { ApiService } from '@/lib/apiService';
import { generateId } from '@/utils/generateId';
import { createLogger } from '@/lib/logger';
import type { OSState } from '../useOSStore';

const logger = createLogger('TransactionSlice');

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

export const EXPENSE_CATEGORY_ICON: Record<ExpenseCategory, string> = {
  Salaries: 'users',
  Rent: 'building-2',
  Marketing: 'megaphone',
  Software: 'cpu',
  Utilities: 'zap',
  Travel: 'plane',
  Supplies: 'package',
  Other: 'layout-grid',
};

export interface LineItem {
  itemId: string;
  name: string;
  qty: number;
  price: number;
  discount?: number;
  tax?: number;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'Money In' | 'Money Out';
  amount: number; // Total after discount & tax
  contactId?: string;
  lineItems: LineItem[];
  tax: number;
  discount: number;
  status: 'paid' | 'pending' | 'overdue';
  note?: string;
  expenseCategory?: ExpenseCategory;
}

export interface TransactionSlice {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
}

export const SEED_TRANSACTIONS: Transaction[] = [
  { id: 'tx1', date: '2024-10-24T10:00:00.000Z', type: 'Money Out', amount: 500, contactId: 'c1', expenseCategory: 'Marketing', note: 'Q4 campaign', lineItems: [], tax: 0, discount: 0, status: 'paid' },
  { id: 'tx2', date: '2024-10-25T15:30:00.000Z', type: 'Money In', amount: 10000, contactId: 'c2', lineItems: [{ itemId: 'i1', name: 'Design Retainer', qty: 2, price: 5000 }], tax: 0, discount: 0, status: 'paid', note: 'Design retainer x2' },
];

export const createTransactionSlice: StateCreator<
  OSState,
  [],
  [],
  TransactionSlice
> = (set, get) => ({
  transactions: SEED_TRANSACTIONS,

  addTransaction: (tx) =>
    set((state) => {
      let updatedItems = [...state.items];
      
      // Stock management for all items in the transaction
      tx.lineItems.forEach(li => {
        if (tx.type === 'Money In') {
          updatedItems = updatedItems.map(item => 
            item.id === li.itemId 
              ? { ...item, stock: item.stock - li.qty } 
              : item
          );
        }
      });

      const newTx = { id: generateId('tx'), ...tx };
      const nextTransactions = [newTx, ...state.transactions];
      
      logger.info('add_transaction_success', { input: { id: newTx.id, amount: newTx.amount } });
      
      ApiService.addTransaction(newTx);
      // We don't have a bulk updateItems yet, we should add it to ApiService
      // or update items individually. For now, we skip individual calls to avoid spam.
      
      return {
        items: updatedItems,
        transactions: nextTransactions,
      };
    }),

  updateTransaction: (id, updates) =>
    set((state) => {
      const next = { transactions: state.transactions.map(t => t.id === id ? { ...t, ...updates } : t) };
      logger.info('update_transaction_success', { input: { id, updates } });
      // ApiService needs updateTransaction (atomic)
      return next;
    }),

  deleteTransaction: (id) =>
    set((state) => {
      const next = { transactions: state.transactions.filter((t) => t.id !== id) };
      logger.info('delete_transaction_success', { input: { id } });
      ApiService.deleteTransaction(id);
      return next;
    }),
});
