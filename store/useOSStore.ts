import { create } from 'zustand';

export interface CompanyIdentity {
  name: string;
  taxId: string;
  logoUrl: string;
  signatureName: string;
}

export interface Customer {
  id: string;
  name: string;
  lifetimeValue: number;
  status: 'Active' | 'Churned' | 'Lead';
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  itemType: 'physical' | 'service'; // V1.4 Distinction
  stockLevel?: number; // Optional for Services
  cogs: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  salary: number;
  status: 'Active' | 'On Leave';
  cacImpact: number; // Basic marketing index
}

export interface Transaction {
  id: string;
  name: string;
  date: string;
  amount: number;
  customerId?: string; 
  dealId?: string;     
}

export interface Deal {
  id: string;
  customerId: string; 
  productId: string; 
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
  company: CompanyIdentity;
  cashflow: number;
  team: Employee[];
  customers: Customer[];
  products: Product[];
  transactions: Transaction[];
  deals: Deal[];
  activityFeed: Activity[];
  
  // Actions
  updateCompanyIdentity: (company: Partial<CompanyIdentity>) => void;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  updateDealStage: (dealId: string, newStage: 'Lead' | 'Negotiation' | 'Closed') => void;
}

export const useOSStore = create<OSState>((set) => ({
  company: {
    name: 'Your Company LLC',
    taxId: 'US-999-888-777',
    logoUrl: 'https://cdn-icons-png.flaticon.com/512/8621/8621183.png',
    signatureName: 'Authorized Representative'
  },
  
  cashflow: 124500.00,
  
  team: [
    { id: 'e1', name: 'Alice Waverly', role: 'VP Sales', salary: 145000, status: 'Active', cacImpact: 0 },
    { id: 'e2', name: 'Bob Constructor', role: 'Lead Engineer', salary: 160000, status: 'Active', cacImpact: 0 },
    { id: 'e3', name: 'Charlie Marketing', role: 'Head of Growth', salary: 110000, status: 'Active', cacImpact: 15000 },
  ],

  customers: [
    { id: 'c1', name: 'Amazon Web Services', lifetimeValue: 450000, status: 'Active' },
    { id: 'c2', name: 'Global Tech', lifetimeValue: 12500, status: 'Active' },
    { id: 'c3', name: 'Daily Planet', lifetimeValue: 0, status: 'Lead' },
    { id: 'c4', name: 'Acme Corp', lifetimeValue: 5000, status: 'Active' },
  ],

  products: [
    { id: 'p1', sku: 'AWS-EC2-YZ', name: 'Enterprise Server Node', itemType: 'physical', stockLevel: 15, cogs: 800 },
    { id: 'p2', sku: 'SAAS-LIC-1Y', name: 'Annual Software License', itemType: 'service', cogs: 0 },
    { id: 'p3', sku: 'HDW-SRV-99', name: 'Physical Server Unit', itemType: 'physical', stockLevel: 4, cogs: 4500 },
    { id: 'p4', sku: 'CONSULT-HR', name: 'Integration Consulting (Hour)', itemType: 'service', cogs: 50 },
  ],

  transactions: [
    { id: 't1', name: 'Software Licenses', date: 'Oct 24', amount: -240.00 },
    { id: 't2', name: 'Invoice #004 (Acme Corp)', date: 'Oct 23', amount: 5000.00 },
  ],
  
  deals: [
    { id: 'd1', customerId: 'c1', productId: 'p1', value: 85000, stage: 'Negotiation' },
    { id: 'd2', customerId: 'c2', productId: 'p3', value: 12000, stage: 'Lead' },
    { id: 'd3', customerId: 'c3', productId: 'p2', value: 4500, stage: 'Lead' },
    { id: 'd4', customerId: 'c4', productId: 'p4', value: 2000, stage: 'Closed' },
  ],
  
  activityFeed: [
    { id: 'a1', title: 'Deal Closed: Acme Corp', amount: 5000, type: 'positive' },
    { id: 'a2', title: 'Inventory Warning: HDW-SRV-99 stock low', type: 'negative' },
    { id: 'a3', title: 'System Initialized', type: 'neutral' },
  ],

  updateCompanyIdentity: (config) => set((state) => ({
    company: { ...state.company, ...config }
  })),

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

    const customer = state.customers.find(c => c.id === deal.customerId);
    const customerName = customer ? customer.name : 'Unknown Client';

    const newActivity: Activity = {
      id: Date.now().toString(),
      title: `Deal with ${customerName} moved to ${newStage}`,
      type: newStage === 'Closed' ? 'positive' : 'neutral',
      amount: newStage === 'Closed' ? deal.value : undefined,
    };

    let newCashflow = state.cashflow;
    const newTransactions = [...state.transactions];
    const newProducts = [...state.products];
    const newCustomers = [...state.customers];
    let inventoryActivity: Activity | null = null;

    if (newStage === 'Closed') {
      newCashflow += deal.value;
      newTransactions.unshift({
        id: `tx-${Date.now()}`,
        name: `Deal Closed: ${customerName}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: deal.value,
        customerId: deal.customerId, 
        dealId: deal.id              
      });

      const productIndex = newProducts.findIndex(p => p.id === deal.productId);
      if (productIndex !== -1) {
        // V1.4 Mathematical check: ONLY deplete if physical
        if (newProducts[productIndex].itemType === 'physical') {
           const currentStock = newProducts[productIndex].stockLevel || 0;
           newProducts[productIndex] = {
             ...newProducts[productIndex],
             stockLevel: Math.max(0, currentStock - 1)
           };
           
           inventoryActivity = {
              id: Date.now().toString() + '-inv',
              title: `Stock Depleted: ${newProducts[productIndex].sku} (-1 Unit)`,
              type: 'neutral'
           };
        } else {
           // It's a service, map an info log instead.
           inventoryActivity = {
              id: Date.now().toString() + '-svc',
              title: `Service Executed: ${newProducts[productIndex].name}`,
              type: 'neutral'
           };
        }
      }

      const customerIndex = newCustomers.findIndex(c => c.id === deal.customerId);
      if (customerIndex !== -1) {
         newCustomers[customerIndex] = {
            ...newCustomers[customerIndex],
            lifetimeValue: newCustomers[customerIndex].lifetimeValue + deal.value,
            status: 'Active'
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
      products: newProducts,
      customers: newCustomers,
    };
  })
}));
