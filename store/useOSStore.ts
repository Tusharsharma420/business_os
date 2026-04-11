import { create } from 'zustand';

export interface Product {
  id: string;
  sku: string;
  name: string;
  stockLevel: number;
  cogs: number; // Cost of goods sold
}

export interface Transaction {
  id: string;
  name: string;
  date: string;
  amount: number;
}

export interface Deal {
  id: string;
  customer: string;
  productId: string; // V1.1 Inventory Connection
  value: number;
  stage: 'Lead' | 'Negotiation' | 'Closed';
}

export interface Activity {
  id: string;
  title: string;
  amount?: number;
  type: 'positive' | 'negative' | 'neutral';
}

interface OSState {
  cashflow: number;
  products: Product[];
  transactions: Transaction[];
  deals: Deal[];
  activityFeed: Activity[];
  
  // Actions
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  updateDealStage: (dealId: string, newStage: 'Lead' | 'Negotiation' | 'Closed') => void;
}

export const useOSStore = create<OSState>((set) => ({
  cashflow: 124500.00,
  
  products: [
    { id: 'p1', sku: 'AWS-EC2-YZ', name: 'Enterprise Server Node', stockLevel: 15, cogs: 800 },
    { id: 'p2', sku: 'SAAS-LIC-1Y', name: 'Annual Software License', stockLevel: 999, cogs: 0 },
    { id: 'p3', sku: 'HDW-SRV-99', name: 'Physical Server Unit', stockLevel: 4, cogs: 4500 },
  ],

  transactions: [
    { id: 't1', name: 'Software Licenses', date: 'Oct 24', amount: -240.00 },
    { id: 't2', name: 'Invoice #004 (Acme Corp)', date: 'Oct 23', amount: 5000.00 },
  ],
  
  deals: [
    { id: 'd1', customer: 'Amazon Web Services', productId: 'p1', value: 85000, stage: 'Negotiation' },
    { id: 'd2', customer: 'Global Tech', productId: 'p3', value: 12000, stage: 'Lead' },
    { id: 'd3', customer: 'Daily Planet', productId: 'p2', value: 4500, stage: 'Lead' },
    { id: 'd4', customer: 'Acme Corp', productId: 'p2', value: 5000, stage: 'Closed' },
  ],
  
  activityFeed: [
    { id: 'a1', title: 'Deal Closed: Acme Corp', amount: 5000, type: 'positive' },
    { id: 'a2', title: 'Inventory Warning: HDW-SRV-99 stock low', type: 'negative' },
    { id: 'a3', title: 'System Initialized', type: 'neutral' },
  ],

  addTransaction: (tx) => set((state) => ({
    transactions: [{ id: Date.now().toString(), ...tx }, ...state.transactions],
    cashflow: state.cashflow + tx.amount,
  })),

  updateDealStage: (dealId, newStage) => set((state) => {
    const deals = [...state.deals];
    const dealIndex = deals.findIndex(d => d.id === dealId);
    if (dealIndex === -1) return state;

    const deal = deals[dealIndex];
    if (deal.stage === newStage) return state;
    deal.stage = newStage;

    const newActivity: Activity = {
      id: Date.now().toString(),
      title: `Deal with ${deal.customer} moved to ${newStage}`,
      type: newStage === 'Closed' ? 'positive' : 'neutral',
      amount: newStage === 'Closed' ? deal.value : undefined,
    };

    let newCashflow = state.cashflow;
    const newTransactions = [...state.transactions];
    const newProducts = [...state.products];
    let inventoryActivity: Activity | null = null;

    if (newStage === 'Closed') {
      newCashflow += deal.value;
      newTransactions.unshift({
        id: `tx-${Date.now()}`,
        name: `Deal Closed: ${deal.customer}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: deal.value,
      });

      // V1.1: Automated Inventory Decrement Logic
      const productIndex = newProducts.findIndex(p => p.id === deal.productId);
      if (productIndex !== -1) {
        newProducts[productIndex] = {
          ...newProducts[productIndex],
          stockLevel: newProducts[productIndex].stockLevel - 1
        };
        
        // Push systemic entropy notification
        inventoryActivity = {
           id: Date.now().toString() + '-inv',
           title: `Stock Depleted: ${newProducts[productIndex].sku} (-1 Unit)`,
           type: 'neutral'
        };
      }
    }

    const nextActivityFeed = inventoryActivity 
        ? [inventoryActivity, newActivity, ...state.activityFeed] 
        : [newActivity, ...state.activityFeed];

    return {
      deals,
      activityFeed: nextActivityFeed,
      cashflow: newCashflow,
      transactions: newTransactions,
      products: newProducts, // Persist depleted inventory
    };
  })
}));
