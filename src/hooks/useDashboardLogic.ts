import { useMemo } from 'react';
import { useOSStore } from '@/store/useOSStore';

export function useDashboardLogic() {
  const { transactions, contacts, items, identity } = useOSStore();
  const cur = identity.currency;

  return useMemo(() => {
    const moneyIn = transactions.filter(t => t.type === 'Money In').reduce((s, t) => s + t.amount, 0);
    const moneyOut = transactions.filter(t => t.type === 'Money Out').reduce((s, t) => s + t.amount, 0);
    const net = moneyIn - moneyOut;
    const isPositive = net >= 0;

    const recent = transactions.slice(0, 4);

    const itemFreq: Record<string, number> = {};
    transactions.filter(t => t.itemId).forEach(t => { itemFreq[t.itemId!] = (itemFreq[t.itemId!] ?? 0) + 1; });
    const topItemId = Object.entries(itemFreq).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topItem = items.find(i => i.id === topItemId);

    const customers = contacts.filter(c => c.type === 'Customer').length;
    const vendors = contacts.filter(c => c.type === 'Vendor').length;

    const lowStockItems = items.filter(i => i.stock <= i.minStock);

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyRevenue = transactions
      .filter(t => t.type === 'Money In' && new Date(t.date) >= monthStart)
      .reduce((s, t) => s + t.amount, 0);
    
    const goalProgress = identity.monthlyRevenueGoal > 0 
      ? Math.min((monthlyRevenue / identity.monthlyRevenueGoal) * 100, 100) 
      : 0;

    return {
      identity, cur, moneyIn, moneyOut, net, isPositive, recent, 
      topItem, customers, vendors, totalItems: items.length, 
      lowStockItems, monthlyRevenue, goalProgress, contacts, items
    };
  }, [transactions, contacts, items, identity]);
}

export function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
