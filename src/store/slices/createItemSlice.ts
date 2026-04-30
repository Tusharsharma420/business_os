import { StateCreator } from 'zustand';
import { FirebaseService } from '@/lib/firebaseService';
import { generateId } from '@/utils/generateId';
import { createLogger } from '@/lib/logger';
import type { OSState } from '../useOSStore';

const logger = createLogger('ItemSlice');

export interface Item {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  minStock: number;
}

export interface ItemSlice {
  items: Item[];
  addItem: (item: Omit<Item, 'id'>) => void;
  updateItem: (id: string, updates: Partial<Omit<Item, 'id'>>) => void;
  deleteItem: (id: string) => void;
}

export const SEED_ITEMS: Item[] = [
  { id: 'i1', name: 'Monthly Design Retainer', price: 5000, category: 'Service', stock: 999, minStock: 0 },
  { id: 'i2', name: 'Premium Server Rack', price: 1200, category: 'Hardware', stock: 5, minStock: 2 },
];

export const createItemSlice: StateCreator<
  OSState,
  [],
  [],
  ItemSlice
> = (set, get) => ({
  items: SEED_ITEMS,

  addItem: (i) =>
    set((state) => {
      const newItem = { id: generateId('i'), ...i, stock: i.stock ?? 0, minStock: i.minStock ?? 0 };
      const next = { items: [newItem, ...state.items] };
      logger.info('add_item_success', { input: { id: newItem.id } });
      if (state.uid) FirebaseService.updateItems(state.uid, next.items);
      return next;
    }),

  updateItem: (id, updates) =>
    set((state) => {
      const next = { items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)) };
      logger.info('update_item_success', { input: { id, updates } });
      if (state.uid) FirebaseService.updateItems(state.uid, next.items);
      return next;
    }),

  deleteItem: (id) =>
    set((state) => {
      const inUse = state.transactions.some((t) => t.itemId === id);
      if (inUse) {
        logger.warn('delete_item_failed', { error: 'Item in use.', input: { id } });
        throw new Error('Item in use. Clear transactions first.');
      }
      const next = { items: state.items.filter((i) => i.id !== id) };
      logger.info('delete_item_success', { input: { id } });
      if (state.uid) FirebaseService.updateItems(state.uid, next.items);
      return next;
    }),
});
