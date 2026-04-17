import { StateCreator } from 'zustand';
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

export interface IdentitySlice {
  identity: BusinessIdentity;
  updateIdentity: (config: Partial<BusinessIdentity>) => void;
}

export const createIdentitySlice: StateCreator<
  IdentitySlice & { uid: string | null },
  [],
  [],
  IdentitySlice
> = (set, get) => ({
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
  updateIdentity: (config) =>
    set((state) => {
      const next = { identity: { ...state.identity, ...config } };
      if (state.uid) FirebaseService.updateIdentity(state.uid, next.identity);
      return next;
    }),
});
