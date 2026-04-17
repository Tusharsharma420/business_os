import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseService } from '@/lib/firebaseService';
import { createLogger } from '@/lib/logger';

import { createIdentitySlice, IdentitySlice } from './slices/createIdentitySlice';
import { createContactSlice, ContactSlice } from './slices/createContactSlice';
import { createItemSlice, ItemSlice } from './slices/createItemSlice';
import { createTransactionSlice, TransactionSlice } from './slices/createTransactionSlice';

// Re-export all models for convenient consumer imports
export * from './slices/createIdentitySlice';
export * from './slices/createContactSlice';
export * from './slices/createItemSlice';
export * from './slices/createTransactionSlice';

const logger = createLogger('useOSStore');

export interface OSState extends IdentitySlice, ContactSlice, ItemSlice, TransactionSlice {
  uid: string | null;
  syncWithCloud: (uid: string) => Promise<void>;
}

export const useOSStore = create<OSState>()(
  persist(
    (...a) => ({
      ...createIdentitySlice(...a),
      ...createContactSlice(...a),
      ...createItemSlice(...a),
      ...createTransactionSlice(...a),
      
      uid: null,
      syncWithCloud: async (uid) => {
        const [set, get] = a;
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
          logger.info('sync_with_cloud', { output: 'Hydrated state from cloud' });
        } else {
          // Cloud empty: Push local migration
          const state = get();
          await FirebaseService.saveFullSync(uid, {
            identity: state.identity,
            contacts: state.contacts,
            items: state.items,
            transactions: state.transactions,
          });
          logger.info('sync_with_cloud', { output: 'Pushed local migration to cloud' });
        }
      },
    }),
    {
      name: 'business-os-v3.0', // Major version bump to accommodate slicing abstraction
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
