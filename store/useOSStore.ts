import { create } from 'zustand';

export interface Transaction {
  id: string;
  name: string;
  date: string;
  amount: number;
}

export interface Deal {
  id: string;
  customer: string;
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
  transactions: Transaction[];
  deals: Deal[];
  activityFeed: Activity[];
  
  // Actions
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  updateDealStage: (dealId: string, newStage: 'Lead' | 'Negotiation' | 'Closed') => void;
}

export const useOSStore = create<OSState>((set) => ({
  cashflow: 124500.00,
  transactions: [
    { id: 't1', name: 'Software Licenses', date: 'Oct 24', amount: -240.00 },
    { id: 't2', name: 'Invoice #004 (Acme Corp)', date: 'Oct 23', amount: 5000.00 },
    { id: 't3', name: 'Office Supplies', date: 'Oct 22', amount: -150.00 },
    { id: 't4', name: 'Invoice #003 (Stark Ind.)', date: 'Oct 20', amount: 12500.00 },
  ],
  deals: [
    { id: 'd1', customer: 'Amazon Web Services', value: 85000, stage: 'Negotiation' },
    { id: 'd2', customer: 'Global Tech', value: 12000, stage: 'Lead' },
    { id: 'd3', customer: 'Daily Planet', value: 4500, stage: 'Lead' },
    { id: 'd4', customer: 'Acme Corp', value: 5000, stage: 'Closed' },
  ],
  activityFeed: [
    { id: 'a1', title: 'Deal Closed: Acme Corp', amount: 5000, type: 'positive' },
    { id: 'a2', title: 'Inventory Log: AWS Server scaling required', type: 'neutral' },
    { id: 'a3', title: 'System Initialized', type: 'neutral' },
  ],

  addTransaction: (tx) => set((state) => ({
    transactions: [{ id: Date.now().toString(), ...tx }, ...state.transactions],
    cashflow: state.cashflow + tx.amount,
  })),

  // Here is our First Principles Event-Driven architecture in action locally
  updateDealStage: (dealId, newStage) => set((state) => {
    const deals = [...state.deals];
    const dealIndex = deals.findIndex(d => d.id === dealId);
    if (dealIndex === -1) return state;

    const deal = deals[dealIndex];
    if (deal.stage === newStage) return state; // Ignore no-ops
    deal.stage = newStage;

    const newActivity: Activity = {
      id: Date.now().toString(),
      title: `Deal with ${deal.customer} moved to ${newStage}`,
      type: newStage === 'Closed' ? 'positive' : 'neutral',
      amount: newStage === 'Closed' ? deal.value : undefined,
    };

    let newCashflow = state.cashflow;
    const newTransactions = [...state.transactions];

    // If deal triggers revenue recognition event
    if (newStage === 'Closed') {
      newCashflow += deal.value;
      newTransactions.unshift({
        id: `tx-${Date.now()}`,
        name: `Deal Closed: ${deal.customer}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: deal.value,
      });
    }

    return {
      deals,
      activityFeed: [newActivity, ...state.activityFeed],
      cashflow: newCashflow,
      transactions: newTransactions,
    };
  })
}));
