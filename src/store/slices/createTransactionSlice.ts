import { StateCreator } from 'zustand';
import { FirebaseService } from '@/lib/firebaseService';
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

export interface Transaction {
  id: string;
  date: string;
  type: 'Money In' | 'Money Out';
  amount: number;
  contactId?: string;
  itemId?: string;
  qty?: number;
  note?: string;
  expenseCategory?: ExpenseCategory;
}

export interface TransactionSlice {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
}

export const SEED_TRANSACTIONS: Transaction[] = [
  { id: 'tx1', date: '2024-10-24T10:00:00.000Z', type: 'Money Out', amount: 500, contactId: 'c1', expenseCategory: 'Marketing', note: 'Q4 campaign' },
  { id: 'tx2', date: '2024-10-25T15:30:00.000Z', type: 'Money In', amount: 10000, contactId: 'c2', itemId: 'i1', qty: 2, note: 'Design retainer x2' },
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
      let updatedItems = state.items;
      // Cross-slice mutation: decrease stock
      if (tx.type === 'Money In' && tx.itemId) {
        updatedItems = state.items.map(item => 
          item.id === tx.itemId 
            ? { ...item, stock: item.stock - (tx.qty || 1) } 
            : item
        );
      }
      const newTx = { id: generateId('tx'), ...tx };
      const nextTransactions = [newTx, ...state.transactions];
      
      logger.info('add_transaction_success', { input: { id: newTx.id, amount: newTx.amount } });
      
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
      logger.info('delete_transaction_success', { input: { id } });
      if (state.uid) {
        FirebaseService.updateTransaction(state.uid, next.transactions);
      }
      return next;
    }),
});
